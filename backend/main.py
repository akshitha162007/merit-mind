from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import bcrypt
from database import get_db
from models import User, Session as UserSession, Candidate, FairnessAuditLog, Resume, JobDescription
import uuid
from datetime import datetime, timedelta
from routers import silence_rank as silence_rank_router
from routers import emotion_blind as emotion_blind_router
from routers import resume_upload as resume_upload_router
import math
import random
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
    role: str = "recruiter"

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
    if req.role == "candidate":
        db.add(Candidate(id=user.id, name=req.name, email=req.email))
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

app.include_router(silence_rank_router.router)
app.include_router(emotion_blind_router.router)
app.include_router(resume_upload_router.router)

# ── Simulator Schemas ─────────────────────────────────────────

class SimulationRequest(BaseModel):
    jd_id: str
    profile_count: int = 100
    axes: list = ["gender", "college_tier", "career_gap", "region", "age"]

# ── Simulator Endpoints ───────────────────────────────────────

from models import ReverseBiasSimulation, JobDescription, Candidate, Application

@app.post("/api/simulator/run")
def run_simulation(
    req: SimulationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can run simulations")
    
    # Generate synthetic profiles
    profiles = []
    for i in range(1, req.profile_count + 1):
        gender_choice = random.choices(["male", "female", "non-binary"], weights=[0.48, 0.48, 0.04])[0]
        college_tier_choice = random.choices(["tier1", "tier2", "tier3"], weights=[0.25, 0.35, 0.40])[0]
        career_gap_choice = random.choices([True, False], weights=[0.35, 0.65])[0]
        region_choice = random.choices(["metro", "non-metro"], weights=[0.55, 0.45])[0]
        age_group_choice = random.choices(["22-30", "31-40", "41-50", "50+"], weights=[0.30, 0.35, 0.25, 0.10])[0]
        base_skill_score = random.uniform(60, 95)
        
        # Compute pipeline score with bias factors
        pipeline_score = base_skill_score
        if college_tier_choice == "tier3":
            pipeline_score -= random.uniform(8, 15)
        if career_gap_choice:
            pipeline_score -= random.uniform(5, 12)
        if region_choice == "non-metro":
            pipeline_score -= random.uniform(3, 8)
        if age_group_choice == "50+":
            pipeline_score -= random.uniform(4, 10)
        if gender_choice == "non-binary":
            pipeline_score -= random.uniform(2, 6)
        
        pipeline_score = max(20, pipeline_score)
        selected = pipeline_score >= 65
        
        profiles.append({
            "id": i,
            "gender": gender_choice,
            "college_tier": college_tier_choice,
            "career_gap": career_gap_choice,
            "region": region_choice,
            "age_group": age_group_choice,
            "base_skill_score": base_skill_score,
            "pipeline_score": pipeline_score,
            "selected": selected
        })
    
    # Compute fairness metrics
    axes_breakdown = []
    disparate_impact_ratios = []
    demographic_parity_differences = []
    
    axis_mapping = {
        "gender": "gender",
        "college_tier": "college_tier",
        "career_gap": "career_gap",
        "region": "region",
        "age": "age_group"
    }
    
    for axis in req.axes:
        axis_field = axis_mapping.get(axis, axis)
        groups = {}
        for profile in profiles:
            group_val = str(profile.get(axis_field, "unknown"))
            if group_val not in groups:
                groups[group_val] = {"total": 0, "selected": 0}
            groups[group_val]["total"] += 1
            if profile["selected"]:
                groups[group_val]["selected"] += 1
        
        group_rates = {}
        for group_name, counts in groups.items():
            rate = counts["selected"] / counts["total"] if counts["total"] > 0 else 0
            group_rates[group_name] = rate
        
        rates = list(group_rates.values())
        max_rate = max(rates) if rates else 0
        min_rate = min(rates) if rates else 0
        
        disparate_impact_ratio = min_rate / max_rate if max_rate > 0 else 1.0
        demographic_parity_difference = max_rate - min_rate
        biased = disparate_impact_ratio < 0.8
        
        axes_breakdown.append({
            "axis": axis.replace("_", " ").title(),
            "disparate_impact_ratio": round(disparate_impact_ratio, 3),
            "demographic_parity_difference": round(demographic_parity_difference, 3),
            "biased": biased,
            "group_rates": {k: round(v, 3) for k, v in group_rates.items()}
        })
        
        disparate_impact_ratios.append(disparate_impact_ratio)
        demographic_parity_differences.append(demographic_parity_difference)
    
    # BRS calculation
    brs_components = []
    for ratio in disparate_impact_ratios:
        axis_brs = (1 - ratio) * 100
        brs_components.append(axis_brs)
    
    bias_risk_score = round(min(100, sum(brs_components) / len(req.axes) * 2.5))
    
    if bias_risk_score <= 20:
        risk_level = "low"
    elif bias_risk_score <= 50:
        risk_level = "medium"
    elif bias_risk_score <= 80:
        risk_level = "high"
    else:
        risk_level = "critical"
    
    # Recommendations
    recommendations = []
    for axis_data in axes_breakdown:
        if axis_data["biased"]:
            axis_name = axis_data["axis"]
            impact_pct = round((1 - axis_data["disparate_impact_ratio"]) * 100)
            
            if "College Tier" in axis_name:
                tier3_rate = axis_data["group_rates"].get("tier3", 0)
                tier1_rate = axis_data["group_rates"].get("tier1", 0)
                tier3_rejection = round((1 - tier3_rate) * 100)
                tier1_rejection = round((1 - tier1_rate) * 100)
                recommendations.append({
                    "axis": axis_name,
                    "severity": "high",
                    "finding": f"Tier-3 candidates rejected at {tier3_rejection}% vs {tier1_rejection}% for Tier-1",
                    "action": "Reduce college prestige weighting in resume scoring",
                    "impact": f"{impact_pct}% disparity detected"
                })
            elif "Career Gap" in axis_name:
                gap_rate = axis_data["group_rates"].get("True", 0)
                no_gap_rate = axis_data["group_rates"].get("False", 0)
                gap_rejection = round((1 - gap_rate) * 100)
                no_gap_rejection = round((1 - no_gap_rate) * 100)
                recommendations.append({
                    "axis": axis_name,
                    "severity": "high",
                    "finding": f"Career gap candidates rejected at {gap_rejection}% vs {no_gap_rejection}% without gap",
                    "action": "Evaluate skills over employment continuity",
                    "impact": f"{impact_pct}% disparity detected"
                })
            elif "Region" in axis_name:
                non_metro_rate = axis_data["group_rates"].get("non-metro", 0)
                metro_rate = axis_data["group_rates"].get("metro", 0)
                non_metro_rejection = round((1 - non_metro_rate) * 100)
                metro_rejection = round((1 - metro_rate) * 100)
                recommendations.append({
                    "axis": axis_name,
                    "severity": "medium",
                    "finding": f"Non-metro candidates rejected at {non_metro_rejection}% vs {metro_rejection}% for metro",
                    "action": "Remove location bias from screening criteria",
                    "impact": f"{impact_pct}% disparity detected"
                })
            elif "Age" in axis_name:
                age_50_rate = axis_data["group_rates"].get("50+", 0)
                age_22_rate = axis_data["group_rates"].get("22-30", 0)
                age_50_rejection = round((1 - age_50_rate) * 100)
                age_22_rejection = round((1 - age_22_rate) * 100)
                recommendations.append({
                    "axis": axis_name,
                    "severity": "high",
                    "finding": f"50+ candidates rejected at {age_50_rejection}% vs {age_22_rejection}% for 22-30",
                    "action": "Focus on skills and experience over age",
                    "impact": f"{impact_pct}% disparity detected"
                })
            elif "Gender" in axis_name:
                nb_rate = axis_data["group_rates"].get("non-binary", 0)
                male_rate = axis_data["group_rates"].get("male", 0)
                nb_rejection = round((1 - nb_rate) * 100)
                male_rejection = round((1 - male_rate) * 100)
                recommendations.append({
                    "axis": axis_name,
                    "severity": "critical",
                    "finding": f"Non-binary candidates rejected at {nb_rejection}% vs {male_rejection}% for male",
                    "action": "Implement blind screening and gender-neutral language",
                    "impact": f"{impact_pct}% disparity detected"
                })
    
    # Stage breakdown
    college_gap = 1 - axes_breakdown[1]["disparate_impact_ratio"] if len(axes_breakdown) > 1 else 0
    career_gap_val = 1 - axes_breakdown[2]["disparate_impact_ratio"] if len(axes_breakdown) > 2 else 0
    resume_screening_bias = (college_gap + career_gap_val) / 2
    
    region_gap = 1 - axes_breakdown[3]["disparate_impact_ratio"] if len(axes_breakdown) > 3 else 0
    age_gap = 1 - axes_breakdown[4]["disparate_impact_ratio"] if len(axes_breakdown) > 4 else 0
    skill_matching_bias = (region_gap + age_gap) / 2
    
    gender_gap = 1 - axes_breakdown[0]["disparate_impact_ratio"] if len(axes_breakdown) > 0 else 0
    final_scoring_bias = gender_gap
    
    stage_breakdown = [
        {"stage": "Resume Screening", "bias_score": round(resume_screening_bias, 3)},
        {"stage": "Skill Matching", "bias_score": round(skill_matching_bias, 3)},
        {"stage": "Final Scoring", "bias_score": round(final_scoring_bias, 3)}
    ]
    
    # Save to database
    simulation = ReverseBiasSimulation(
        jd_id=uuid.UUID(req.jd_id),
        synthetic_profiles_count=req.profile_count,
        demographic_parity=round(1 - sum(demographic_parity_differences) / len(demographic_parity_differences), 3),
        disparate_impact_ratio=round(sum(disparate_impact_ratios) / len(disparate_impact_ratios), 3),
        bias_risk_score=bias_risk_score
    )
    db.add(simulation)
    db.commit()
    db.refresh(simulation)
    
    return {
        "bias_risk_score": bias_risk_score,
        "risk_level": risk_level,
        "profiles_tested": req.profile_count,
        "demographic_parity": round(1 - sum(demographic_parity_differences) / len(demographic_parity_differences), 3),
        "disparate_impact_ratio": round(sum(disparate_impact_ratios) / len(disparate_impact_ratios), 3),
        "statistical_parity_difference": round(sum(demographic_parity_differences) / len(demographic_parity_differences), 3),
        "axes_breakdown": axes_breakdown,
        "stage_breakdown": stage_breakdown,
        "recommendations": recommendations,
        "simulation_id": str(simulation.id)
    }

@app.get("/api/simulator/history")
def get_simulation_history(
    jd_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can view history")
    
    simulations = db.query(ReverseBiasSimulation).filter(
        ReverseBiasSimulation.jd_id == uuid.UUID(jd_id)
    ).order_by(ReverseBiasSimulation.created_at.asc()).all()
    
    return [{
        "run_at": str(sim.created_at),
        "bias_risk_score": sim.bias_risk_score,
        "profiles_tested": sim.synthetic_profiles_count,
        "disparate_impact_ratio": float(sim.disparate_impact_ratio)
    } for sim in simulations]

@app.get("/api/simulator/my-pipeline-status")
def get_my_pipeline_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can view pipeline status")
    
    candidate = db.query(Candidate).filter(Candidate.email == current_user.email).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    
    application = db.query(Application).filter(
        Application.candidate_id == candidate.id
    ).order_by(Application.created_at.desc()).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="No applications found")
    
    simulation = db.query(ReverseBiasSimulation).filter(
        ReverseBiasSimulation.jd_id == application.jd_id
    ).order_by(ReverseBiasSimulation.created_at.desc()).first()
    
    job = db.query(JobDescription).filter(JobDescription.id == application.jd_id).first()
    
    bias_risk_score = simulation.bias_risk_score if simulation else 0
    if bias_risk_score <= 20:
        risk_level = "low"
    elif bias_risk_score <= 50:
        risk_level = "medium"
    elif bias_risk_score <= 80:
        risk_level = "high"
    else:
        risk_level = "critical"
    
    return {
        "job_title": job.title if job else "Unknown Job",
        "bias_risk_score": bias_risk_score,
        "risk_level": risk_level,
        "was_tested": simulation is not None,
        "profiles_tested": simulation.synthetic_profiles_count if simulation else 0,
        "disparate_impact_ratio": float(simulation.disparate_impact_ratio) if simulation else 0.0,
        "current_stage": application.status,
        "tested_axes": ["Gender", "College Tier", "Career Gap", "Region", "Age"]
    }


# ── Fairness Optimizer Endpoints (for job listing) ───────────

@app.get("/api/fairness/jobs")
def get_recruiter_jobs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "recruiter":
        return []
    jobs = db.query(JobDescription).filter(JobDescription.recruiter_id == current_user.id).all()
    return [{"id": str(j.id), "title": j.title} for j in jobs]


# ── Fairness Optimizer Additional Endpoints ──────────────────

from models import BiasReport, FairnessMetric

class OptimizeRequest(BaseModel):
    jd_id: str
    constraints: dict

@app.post("/api/fairness/optimize")
def optimize_fairness(
    req: OptimizeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can optimize")
    
    # Query applications
    applications = db.query(Application).filter(
        Application.jd_id == uuid.UUID(req.jd_id),
        Application.merit_score.isnot(None)
    ).all()
    
    if not applications:
        return {
            "shortlist_count": 0,
            "fairness_score": 0,
            "diversity_index": 0,
            "fairness_roi": {"merit_delta": 0, "fairness_delta": 0},
            "optimized_candidates": [],
            "demographic_breakdown": []
        }
    
    # Process each application
    app_data = []
    for app in applications:
        bias_reports = db.query(BiasReport).filter(BiasReport.application_id == app.id).all()
        
        # Compute adaptive weight
        adaptive_weight = 1.0
        for axis_key, constraint_val in req.constraints.items():
            if any(r.axis == axis_key for r in bias_reports):
                adaptive_weight += (constraint_val / 100) * 0.15
        adaptive_weight = min(adaptive_weight, 1.5)
        
        # Compute fairness adjustment
        fairness_adjustment = sum(r.severity * 0.1 for r in bias_reports)
        
        # Compute final score
        final_score = app.merit_score * adaptive_weight + fairness_adjustment
        
        app_data.append({
            "app": app,
            "bias_reports": bias_reports,
            "adaptive_weight": adaptive_weight,
            "fairness_adjustment": fairness_adjustment,
            "final_score": final_score
        })
    
    # Sort for original rank
    app_data_sorted_merit = sorted(app_data, key=lambda x: x["app"].merit_score, reverse=True)
    for idx, item in enumerate(app_data_sorted_merit):
        item["original_rank"] = idx + 1
    
    # Sort for optimized rank
    app_data_sorted_final = sorted(app_data, key=lambda x: x["final_score"], reverse=True)
    for idx, item in enumerate(app_data_sorted_final):
        item["optimized_rank"] = idx + 1
    
    # Top 10
    top_10_optimized = app_data_sorted_final[:10]
    top_10_original = app_data_sorted_merit[:10]
    
    # Compute fairness score
    axis_counts = {axis: 0 for axis in ["gender", "caste", "region", "age", "college_tier"]}
    for item in top_10_optimized:
        for report in item["bias_reports"]:
            if report.axis in axis_counts:
                axis_counts[report.axis] += 1
    
    fairness_score = sum(min((count / 10) * 100, 100) for count in axis_counts.values()) / 5
    fairness_score = min(fairness_score * 2, 100)
    
    # Compute diversity index (Shannon entropy)
    total_reports = sum(axis_counts.values())
    if total_reports > 0:
        entropy = 0
        for count in axis_counts.values():
            if count > 0:
                p = count / total_reports
                entropy -= p * math.log(p + 1e-9)
        diversity_index = entropy / math.log(5) if math.log(5) > 0 else 0
    else:
        diversity_index = 0
    
    # Compute fairness ROI
    mean_original_merit = sum(item["app"].merit_score for item in top_10_original) / len(top_10_original)
    mean_optimized_merit = sum(item["app"].merit_score for item in top_10_optimized) / len(top_10_optimized)
    merit_delta = round(mean_original_merit - mean_optimized_merit, 2)
    fairness_delta = round(fairness_score - 50, 2)
    
    # Compute demographic breakdown
    def count_axis_in_list(items, axis):
        count = 0
        for item in items:
            if any(r.axis == axis for r in item["bias_reports"]):
                count += 1
        return (count / len(items)) * 100 if items else 0
    
    demographic_breakdown = [
        {"axis": "Gender", "before": count_axis_in_list(top_10_original, "gender"), "after": count_axis_in_list(top_10_optimized, "gender")},
        {"axis": "Caste", "before": count_axis_in_list(top_10_original, "caste"), "after": count_axis_in_list(top_10_optimized, "caste")},
        {"axis": "Region", "before": count_axis_in_list(top_10_original, "region"), "after": count_axis_in_list(top_10_optimized, "region")},
        {"axis": "Age", "before": count_axis_in_list(top_10_original, "age"), "after": count_axis_in_list(top_10_optimized, "age")},
        {"axis": "College Tier", "before": count_axis_in_list(top_10_original, "college_tier"), "after": count_axis_in_list(top_10_optimized, "college_tier")}
    ]
    
    # Save metric
    total_bias_reports = sum(len(item["bias_reports"]) for item in app_data)
    metric = FairnessMetric(
        jd_id=uuid.UUID(req.jd_id),
        diversity_index=diversity_index,
        hiring_quality_score=fairness_score,
        bias_cases_count=total_bias_reports,
        candidate_trust_score=fairness_score / 100
    )
    db.add(metric)
    db.commit()
    
    # Build response
    optimized_candidates = []
    for idx, item in enumerate(top_10_optimized):
        optimized_candidates.append({
            "candidate_number": idx + 1,
            "original_rank": item["original_rank"],
            "optimized_rank": item["optimized_rank"],
            "merit_score": round(item["app"].merit_score, 1),
            "fairness_adjustment": round(item["fairness_adjustment"], 2)
        })
    
    return {
        "shortlist_count": len(top_10_optimized),
        "fairness_score": round(fairness_score, 1),
        "diversity_index": round(diversity_index, 2),
        "fairness_roi": {"merit_delta": merit_delta, "fairness_delta": fairness_delta},
        "optimized_candidates": optimized_candidates,
        "demographic_breakdown": demographic_breakdown
    }

@app.get("/api/fairness/history")
def get_fairness_history(
    jd_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can view history")
    
    metrics = db.query(FairnessMetric).filter(
        FairnessMetric.jd_id == uuid.UUID(jd_id)
    ).order_by(FairnessMetric.created_at.desc()).all()
    
    history = []
    for metric in metrics:
        job = db.query(JobDescription).filter(JobDescription.id == metric.jd_id).first()
        recruiter = db.query(User).filter(User.id == job.recruiter_id).first() if job else None
        
        history.append({
            "run_at": str(metric.created_at),
            "recruiter_name": recruiter.name if recruiter else "Unknown",
            "job_title": job.title if job else "Unknown Job",
            "fairness_score": round(metric.hiring_quality_score, 1)
        })
    
    return history

@app.get("/api/fairness/my-report")
def get_my_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can view their report")
    
    candidate = db.query(Candidate).filter(Candidate.email == current_user.email).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    
    application = db.query(Application).filter(
        Application.candidate_id == candidate.id
    ).order_by(Application.created_at.desc()).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="No applications found")
    
    # Get all applications for this job
    all_apps = db.query(Application).filter(
        Application.jd_id == application.jd_id,
        Application.merit_score.isnot(None)
    ).order_by(Application.merit_score.desc()).all()
    
    # Find position
    position = next((idx for idx, app in enumerate(all_apps) if app.id == application.id), None)
    rank_percentile = round((1 - (position / len(all_apps))) * 100) if position is not None and len(all_apps) > 0 else 50
    
    # Get fairness metric
    fairness_metric = db.query(FairnessMetric).filter(
        FairnessMetric.jd_id == application.jd_id
    ).order_by(FairnessMetric.created_at.desc()).first()
    
    fairness_adjustment = (application.fairness_score - application.merit_score) if application.fairness_score else 0
    final_score = application.fairness_score if application.fairness_score else application.merit_score
    fairness_confidence = (fairness_metric.candidate_trust_score * 100) if fairness_metric else 72.0
    
    return {
        "merit_score": round(application.merit_score, 1),
        "fairness_adjustment": round(fairness_adjustment, 2),
        "final_score": round(final_score, 1),
        "rank_percentile": rank_percentile,
        "active_axes": ["Gender", "Caste", "Region", "Age", "College Tier"],
        "fairness_confidence": round(fairness_confidence, 1)
    }


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
    try:
        candidate_uuid = uuid.UUID(req.candidate_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid candidate_id format")

    if current_user.role == "candidate" and str(current_user.id) != str(candidate_uuid):
        raise HTTPException(status_code=403, detail="You can only run fairness checks for your own profile")

    candidate = db.query(Candidate).filter(Candidate.id == candidate_uuid).first()
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
