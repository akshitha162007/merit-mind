from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Header
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from database import get_db
from models import Resume, Candidate, User, Session as UserSession
from utils.resume_extractor import extract_from_text, extract_from_pdf, extract_from_image
import uuid
from datetime import datetime
import json

router = APIRouter()


class SubmitTextRequest(BaseModel):
    candidate_id: str
    text: str


def get_user_from_token(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Extract user from JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.replace("Bearer ", "")
    session = db.query(UserSession).filter(UserSession.token == token).first()
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


def get_or_create_candidate(candidate_id: str, db: Session):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if candidate:
        return candidate

    user = db.query(User).filter(User.id == candidate_id).first()
    if not user or user.role != "candidate":
        return None

    candidate = Candidate(id=user.id, name=user.name, email=user.email)
    db.add(candidate)
    db.flush()
    return candidate


@router.post("/api/resume/submit-text")
def submit_text(req: SubmitTextRequest, db: Session = Depends(get_db)):
    """Submit resume as plain text"""
    try:
        if not req.text or not req.text.strip():
            raise HTTPException(status_code=400, detail="Resume text cannot be empty")

        candidate = get_or_create_candidate(req.candidate_id, db)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        extracted = extract_from_text(req.text)
        raw_text = extracted["raw_text"]
        parsed_json = extracted["parsed_json"]
        blind_text = extracted["blind_text"]
        
        # Check if resume exists
        existing = db.query(Resume).filter(Resume.candidate_id == req.candidate_id).first()
        
        if existing:
            # Update existing
            existing.raw_text = raw_text
            existing.parsed_json = parsed_json
            existing.blind_text = blind_text
            existing.created_at = datetime.utcnow()
            db.commit()
            resume_id = existing.id
        else:
            # Create new
            resume = Resume(
                id=str(uuid.uuid4()),
                candidate_id=req.candidate_id,
                raw_text=raw_text,
                parsed_json=parsed_json,
                blind_text=blind_text,
                created_at=datetime.utcnow()
            )
            db.add(resume)
            db.commit()
            resume_id = resume.id
        
        skills = parsed_json.get("skills", [])
        return {
            "success": True,
            "resume_id": str(resume_id),
            "message": "Resume submitted successfully",
            "skills_found": skills,
            "skills_count": len(skills)
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit resume: {str(e)}")


@router.post("/api/resume/submit-pdf")
async def submit_pdf(candidate_id: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Submit resume as PDF"""
    try:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files accepted")

        candidate = get_or_create_candidate(candidate_id, db)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        file_bytes = await file.read()
        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large. Max 5MB")
        
        extracted = extract_from_pdf(file_bytes)
        raw_text = extracted["raw_text"]
        parsed_json = extracted["parsed_json"]
        blind_text = extracted["blind_text"]
        
        # Check if resume exists
        existing = db.query(Resume).filter(Resume.candidate_id == candidate_id).first()
        
        if existing:
            # Update existing
            existing.raw_text = raw_text
            existing.parsed_json = parsed_json
            existing.blind_text = blind_text
            existing.created_at = datetime.utcnow()
            db.commit()
            resume_id = existing.id
        else:
            # Create new
            resume = Resume(
                id=str(uuid.uuid4()),
                candidate_id=candidate_id,
                raw_text=raw_text,
                parsed_json=parsed_json,
                blind_text=blind_text,
                created_at=datetime.utcnow()
            )
            db.add(resume)
            db.commit()
            resume_id = resume.id
        
        skills = parsed_json.get("skills", [])
        return {
            "success": True,
            "resume_id": str(resume_id),
            "message": "Resume submitted successfully",
            "skills_found": skills,
            "skills_count": len(skills)
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit resume: {str(e)}")


@router.post("/api/resume/submit-image")
async def submit_image(candidate_id: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Submit resume as image (JPG/PNG)"""
    try:
        if file.content_type not in ["image/jpeg", "image/jpg", "image/png"]:
            raise HTTPException(status_code=400, detail="Only JPG/PNG images accepted")

        candidate = get_or_create_candidate(candidate_id, db)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        file_bytes = await file.read()
        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large. Max 5MB")
        
        extracted = extract_from_image(file_bytes)
        raw_text = extracted["raw_text"]
        parsed_json = extracted["parsed_json"]
        blind_text = extracted["blind_text"]
        
        # Check if resume exists
        existing = db.query(Resume).filter(Resume.candidate_id == candidate_id).first()
        
        if existing:
            # Update existing
            existing.raw_text = raw_text
            existing.parsed_json = parsed_json
            existing.blind_text = blind_text
            existing.created_at = datetime.utcnow()
            db.commit()
            resume_id = existing.id
        else:
            # Create new
            resume = Resume(
                id=str(uuid.uuid4()),
                candidate_id=candidate_id,
                raw_text=raw_text,
                parsed_json=parsed_json,
                blind_text=blind_text,
                created_at=datetime.utcnow()
            )
            db.add(resume)
            db.commit()
            resume_id = resume.id
        
        skills = parsed_json.get("skills", [])
        return {
            "success": True,
            "resume_id": str(resume_id),
            "message": "Resume submitted successfully",
            "skills_found": skills,
            "skills_count": len(skills)
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit resume: {str(e)}")


@router.get("/api/resume/candidate/{candidate_id}")
def get_candidate_resume(candidate_id: str, db: Session = Depends(get_db)):
    """Get candidate's resume status (candidate view - no parsed data)"""
    try:
        resume = db.query(Resume).filter(Resume.candidate_id == candidate_id).order_by(desc(Resume.created_at)).first()
        
        if not resume:
            return {"has_resume": False}
        
        parsed_json = resume.parsed_json if isinstance(resume.parsed_json, dict) else json.loads(resume.parsed_json) if resume.parsed_json else {}
        skills_count = len(parsed_json.get("skills", []))
        
        return {
            "has_resume": True,
            "resume_id": str(resume.id),
            "submitted_at": resume.created_at.isoformat() if resume.created_at else None,
            "skills_count": skills_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch resume status: {str(e)}")


@router.get("/api/resume/all")
def get_all_resumes(user: User = Depends(get_user_from_token), db: Session = Depends(get_db)):
    """Get all resumes (recruiter only)"""
    try:
        if user.role not in ["recruiter", "admin"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        resumes = db.query(Resume).join(Candidate).order_by(desc(Resume.created_at)).all()
        
        result = []
        for resume in resumes:
            candidate = db.query(Candidate).filter(Candidate.id == resume.candidate_id).first()
            parsed_json = resume.parsed_json if isinstance(resume.parsed_json, dict) else json.loads(resume.parsed_json) if resume.parsed_json else {}
            
            result.append({
                "resume_id": str(resume.id),
                "candidate_id": str(resume.candidate_id),
                "candidate_name": candidate.name if candidate else "Unknown",
                "candidate_blind_id": str(candidate.blind_id) if candidate else None,
                "skills": parsed_json.get("skills", []),
                "education": parsed_json.get("education", []),
                "experience": parsed_json.get("experience", []),
                "raw_text_preview": resume.raw_text[:200] if resume.raw_text else "",
                "submitted_at": resume.created_at.isoformat() if resume.created_at else None
            })
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch resumes: {str(e)}")


@router.get("/api/resume/detail/{resume_id}")
def get_resume_detail(resume_id: str, user: User = Depends(get_user_from_token), db: Session = Depends(get_db)):
    """Get full resume details (recruiter only)"""
    try:
        if user.role not in ["recruiter", "admin"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        candidate = db.query(Candidate).filter(Candidate.id == resume.candidate_id).first()
        parsed_json = resume.parsed_json if isinstance(resume.parsed_json, dict) else json.loads(resume.parsed_json) if resume.parsed_json else {}
        
        return {
            "resume_id": str(resume.id),
            "candidate_id": str(resume.candidate_id),
            "candidate_name": candidate.name if candidate else "Unknown",
            "candidate_blind_id": str(candidate.blind_id) if candidate else None,
            "raw_text": resume.raw_text,
            "blind_text": resume.blind_text,
            "parsed_json": parsed_json,
            "submitted_at": resume.created_at.isoformat() if resume.created_at else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch resume: {str(e)}")
