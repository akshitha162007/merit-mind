from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import bcrypt
from database import get_db
from models import User, Session as UserSession, Candidate, FairnessAuditLog, Resume, JobDescription
import uuid
from datetime import datetime, timedelta
from agents.counterfactual_agent import (
    generate_counterfactual_profiles,
    evaluate_variants,
    calculate_bias_delta,
    apply_bias_correction,
    log_fairness_audit,
    BIAS_THRESHOLD
)
from agents.skill_graph_agent import (
    extract_candidate_skills,
    extract_job_requirements,
    evaluate_skill_match,
    save_skill_match_result
)

app = FastAPI(title="Merit Mind API")

app.add_middleware(
    CORSMiddleware,
    # frontend dev server may run on any localhost port; allow all localhost origins
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# ── Auth Schemas ──────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "recruiter"  # recruiter | candidate

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    user_id: str
    name: str
    email: str
    role: str

# ── Auth Endpoints ────────────────────────────────────────────

@app.post("/api/auth/register", response_model=AuthResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    if req.role not in ("recruiter", "candidate"):
        raise HTTPException(status_code=400, detail="role must be 'recruiter' or 'candidate'")
    user = User(
        name=req.name,
        email=req.email,
        password_hash=hash_password(req.password),
        role=req.role,
    )
    db.add(user)
    db.flush()
    token = str(uuid.uuid4())
    session = UserSession(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(days=7),
    )
    db.add(session)
    db.commit()
    return AuthResponse(token=token, user_id=str(user.id), name=user.name, email=user.email, role=user.role)

@app.post("/api/auth/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = str(uuid.uuid4())
    session = UserSession(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(days=7),
    )
    db.add(session)
    db.commit()
    return AuthResponse(token=token, user_id=str(user.id), name=user.name, email=user.email, role=user.role)

@app.post("/api/auth/logout")
def logout(token: str, db: Session = Depends(get_db)):
    db.query(UserSession).filter(UserSession.token == token).delete()
    db.commit()
    return {"ok": True}

# ── Authentication utility ─────────────────────────────────────

from fastapi import Header


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Validate bearer token from Authorization header and return User.

    Expects header of form "Bearer <token>". Raises HTTPException if missing/invalid.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1]
    session = db.query(UserSession).filter(
        UserSession.token == token,
        UserSession.expires_at > datetime.utcnow()
    ).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        # Shouldn't happen but guard anyway
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user


# ── Health ────────────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Merit Mind backend is running!"}

# ── Simple helper endpoints for creating test data ───────────────

class CandidateCreateRequest(BaseModel):
    name: str
    email: str
    resume_url: str = None

@app.post("/api/candidates")
def create_candidate(req: CandidateCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # only recruiters or admins can create candidates
    if current_user.role not in ("recruiter", "admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    candidate = Candidate(name=req.name, email=req.email, resume_url=req.resume_url)
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return {"id": str(candidate.id), "name": candidate.name, "email": candidate.email}

class JobCreateRequest(BaseModel):
    title: str
    raw_text: str = None

@app.post("/api/jobdescriptions")
def create_job(req: JobCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ("recruiter", "admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    job = JobDescription(recruiter_id=current_user.id, title=req.title, raw_text=req.raw_text)
    db.add(job)
    db.commit()
    db.refresh(job)
    return {"id": str(job.id), "title": job.title}

# ── Fairness Agent ────────────────────────────────────────────

class FairnessCheckRequest(BaseModel):
    candidate_id: str

class FairnessCheckResponse(BaseModel):
    candidate_id: str
    original_score: float
    corrected_score: float
    bias_detected: bool
    bias_delta: float
    variant_scores: dict

@app.post("/api/fairness/check", response_model=FairnessCheckResponse)
def check_fairness(req: FairnessCheckRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    candidate = db.query(Candidate).filter(Candidate.id == uuid.UUID(req.candidate_id)).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    candidate_profile = {
        "name": candidate.name,
        "skills": ["Python", "SQL", "FastAPI"],
        "experience": 3,
        "education": "B.Tech Computer Science",
        "college": "NIT Trichy",
        "location": "Bangalore",
        "projects": []
    }
    
    profiles = generate_counterfactual_profiles(candidate_profile)
    scores = evaluate_variants(profiles)
    bias_delta = calculate_bias_delta(scores)
    
    original_score = scores.get(candidate.name, 62.0)
    corrected_score = apply_bias_correction(original_score, scores)
    bias_detected = bias_delta > BIAS_THRESHOLD
    
    log_fairness_audit(db, req.candidate_id, original_score, corrected_score, bias_delta)
    
    return FairnessCheckResponse(
        candidate_id=req.candidate_id,
        original_score=original_score,
        corrected_score=corrected_score,
        bias_detected=bias_detected,
        bias_delta=bias_delta,
        variant_scores=scores
    )

# ── Skill Graph Intelligence ──────────────────────────────────────────

class SkillEvaluationRequest(BaseModel):
    candidate_id: str
    job_id: str

class SkillEvaluationResponse(BaseModel):
    candidate_id: str
    job_id: str
    skill_score: float
    matched_skills: list
    skill_details: list
    matched_count: int
    total_required: int

@app.post("/api/skills/evaluate", response_model=SkillEvaluationResponse)
def evaluate_skills(req: SkillEvaluationRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Fetch candidate
    candidate = db.query(Candidate).filter(Candidate.id == uuid.UUID(req.candidate_id)).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Fetch resume
    resume = db.query(Resume).filter(Resume.candidate_id == uuid.UUID(req.candidate_id)).first()
    
    # Fetch job description
    job = db.query(JobDescription).filter(JobDescription.id == uuid.UUID(req.job_id)).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found")
    
    # Extract skills
    candidate_data = {
        "skills": ["Python", "SQL", "Business Analytics", "Excel"],
        "parsed_json": resume.parsed_json if resume else None
    }
    
    job_data = {
        "required_skills": ["Data Analysis", "SQL", "Python"]
    }
    
    if job.required_skills:
        job_data["required_skills"] = job.required_skills if isinstance(job.required_skills, list) else []
    
    candidate_skills = extract_candidate_skills(candidate_data)
    job_skills = extract_job_requirements(job_data)
    
    # Evaluate match
    result = evaluate_skill_match(candidate_skills, job_skills)
    
    # Save to database
    save_skill_match_result(db, req.candidate_id, req.job_id, result)
    
    return SkillEvaluationResponse(
        candidate_id=req.candidate_id,
        job_id=req.job_id,
        skill_score=result["skill_score"],
        matched_skills=result["matched_skills"],
        skill_details=result["skill_details"],
        matched_count=result["matched_count"],
        total_required=result["total_job_skills"]
    )