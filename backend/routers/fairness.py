from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, JobDescription, Application, Candidate, Session as UserSession
import uuid
from datetime import datetime, timedelta
import random

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Validate bearer token from Authorization header and return User."""
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
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user

router = APIRouter(prefix="/api/fairness", tags=["fairness"])

class FairnessCheckRequest(BaseModel):
    candidate_id: str

class FairnessOptimizeRequest(BaseModel):
    job_id: str
    constraints: dict

class SimulatorRunRequest(BaseModel):
    jd_id: str
    profile_count: int = 100
    axes: list = ["gender", "college_tier", "career_gap", "region", "age"]

@router.post("/check")
def check_fairness(request: FairnessCheckRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Mock fairness check response
        fairness_score = random.uniform(0.6, 0.95)
        
        return {
            "candidate_id": request.candidate_id,
            "overall_fairness_score": fairness_score,
            "bias_detected": fairness_score < 0.75,
            "bias_categories": {
                "gender": random.uniform(0.7, 0.95),
                "age": random.uniform(0.6, 0.9),
                "ethnicity": random.uniform(0.65, 0.92),
                "education": random.uniform(0.75, 0.95)
            },
            "recommendations": [
                "Consider reviewing screening criteria for potential gender bias",
                "Ensure age-neutral job descriptions",
                "Use structured interviews to reduce subjective bias"
            ] if fairness_score < 0.8 else [
                "Fairness standards are being met",
                "Continue monitoring for emerging bias patterns"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/jobs")
def get_jobs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Get jobs from database or return mock data
        jobs = db.query(JobDescription).all()
        if not jobs:
            # Return mock data if no jobs in database
            return [
                {"id": "1", "title": "Software Engineer", "company": "TechCorp", "status": "active"},
                {"id": "2", "title": "Data Scientist", "company": "DataCo", "status": "active"},
                {"id": "3", "title": "Product Manager", "company": "StartupXYZ", "status": "draft"}
            ]
        
        return [{"id": str(job.id), "title": job.title or "Untitled", "company": job.company or "Unknown", "status": "active"} for job in jobs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-report")
def get_my_report(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Mock candidate fairness report
        return {
            "candidate_id": str(current_user.id),
            "name": current_user.name,
            "applications": [
                {
                    "job_id": "1",
                    "job_title": "Software Engineer",
                    "company": "TechCorp",
                    "fairness_score": random.uniform(0.7, 0.95),
                    "status": "under_review",
                    "applied_date": "2024-03-10"
                },
                {
                    "job_id": "2", 
                    "job_title": "Data Scientist",
                    "company": "DataCo",
                    "fairness_score": random.uniform(0.6, 0.9),
                    "status": "rejected",
                    "applied_date": "2024-03-08"
                }
            ],
            "overall_fairness_exposure": random.uniform(0.75, 0.92),
            "bias_incidents": random.randint(0, 3)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/optimize")
def optimize_fairness(request: FairnessOptimizeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Mock optimization results
        return {
            "job_id": request.job_id,
            "optimization_results": {
                "before": {
                    "diversity_score": random.uniform(0.6, 0.75),
                    "bias_level": random.uniform(0.2, 0.4)
                },
                "after": {
                    "diversity_score": random.uniform(0.8, 0.95),
                    "bias_level": random.uniform(0.05, 0.15)
                }
            },
            "recommended_changes": [
                "Adjust screening criteria weights",
                "Include diverse interview panel",
                "Use structured evaluation rubric"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))