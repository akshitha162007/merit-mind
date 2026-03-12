from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, Session as UserSession
import random
from datetime import datetime, timedelta

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

router = APIRouter(prefix="/api/simulator", tags=["simulator"])

class SimulatorRunRequest(BaseModel):
    jd_id: str
    profile_count: int = 100
    axes: list = ["gender", "college_tier", "career_gap", "region", "age"]

@router.post("/run")
def run_bias_simulation(request: SimulatorRunRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Generate mock simulation results
        bias_axes = {}
        for axis in request.axes:
            if axis == "gender":
                bias_axes[axis] = {
                    "male": random.uniform(0.6, 0.8),
                    "female": random.uniform(0.4, 0.6),
                    "non_binary": random.uniform(0.3, 0.5)
                }
            elif axis == "college_tier":
                bias_axes[axis] = {
                    "tier1": random.uniform(0.8, 0.95),
                    "tier2": random.uniform(0.5, 0.75),
                    "tier3": random.uniform(0.2, 0.45)
                }
            elif axis == "region":
                bias_axes[axis] = {
                    "metro": random.uniform(0.7, 0.9),
                    "urban": random.uniform(0.5, 0.75),
                    "rural": random.uniform(0.2, 0.45)
                }
            elif axis == "age":
                bias_axes[axis] = {
                    "22-25": random.uniform(0.8, 0.95),
                    "26-30": random.uniform(0.6, 0.8),
                    "31-35": random.uniform(0.4, 0.6),
                    "35+": random.uniform(0.2, 0.4)
                }
            elif axis == "career_gap":
                bias_axes[axis] = {
                    "no_gap": random.uniform(0.8, 0.95),
                    "short_gap": random.uniform(0.5, 0.7),
                    "long_gap": random.uniform(0.2, 0.4)
                }
        
        return {
            "simulation_id": str(random.randint(1000, 9999)),
            "jd_id": request.jd_id,
            "profile_count": request.profile_count,
            "bias_analysis": bias_axes,
            "overall_bias_score": random.uniform(0.3, 0.7),
            "simulation_date": datetime.now().isoformat(),
            "recommendations": [
                "Consider removing college name from initial screening",
                "Use blind resume review process",
                "Implement structured scoring rubric"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
def get_simulation_history(jd_id: str = None, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Mock simulation history
        history = []
        for i in range(3):
            history.append({
                "simulation_id": str(random.randint(1000, 9999)),
                "jd_id": jd_id or str(random.randint(1, 5)),
                "date": (datetime.now() - timedelta(days=i*2)).isoformat(),
                "bias_score": random.uniform(0.3, 0.8),
                "status": "completed"
            })
        
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-pipeline-status")
def get_my_pipeline_status(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Mock pipeline status for candidates
        stages = ["applied", "screening", "interview", "final_review", "decision"]
        
        pipeline_data = []
        for stage in stages:
            pipeline_data.append({
                "stage": stage,
                "bias_probability": random.uniform(0.1, 0.6),
                "fairness_score": random.uniform(0.4, 0.9),
                "candidates_affected": random.randint(10, 100)
            })
        
        return {
            "candidate_id": str(current_user.id),
            "pipeline_stages": pipeline_data,
            "overall_fairness": random.uniform(0.6, 0.85),
            "status": "active"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))