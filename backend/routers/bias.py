from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, Session as UserSession
import random
from datetime import datetime, timedelta
import uuid

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

router = APIRouter(prefix="/api/bias", tags=["bias"])

class BiasDetectRequest(BaseModel):
    jd_text: str
    user_role: str = "recruiter"
    user_id: str

class BiasRewriteRequest(BaseModel):
    jd_text: str
    target_demographics: list = []
    user_id: str

@router.post("/detect")
def detect_bias(request: BiasDetectRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        jd_text = request.jd_text.strip()
        
        if not jd_text:
            raise HTTPException(status_code=400, detail="Job description text is required")
        
        # Mock bias detection analysis
        bias_indicators = []
        confidence_score = random.uniform(0.7, 0.95)
        
        # Check for common bias patterns
        if any(word in jd_text.lower() for word in ["young", "energetic", "ninja", "rockstar"]):
            bias_indicators.append({
                "type": "age_bias",
                "text": "young, energetic",
                "severity": "high",
                "suggestion": "Use 'motivated' or 'enthusiastic' instead"
            })
        
        if any(word in jd_text.lower() for word in ["he", "his", "him", "guys"]):
            bias_indicators.append({
                "type": "gender_bias", 
                "text": "masculine pronouns",
                "severity": "medium",
                "suggestion": "Use gender-neutral language"
            })
            
        if any(word in jd_text.lower() for word in ["native", "mother tongue"]):
            bias_indicators.append({
                "type": "language_bias",
                "text": "native speaker requirement", 
                "severity": "high",
                "suggestion": "Focus on communication skills rather than native language"
            })
        
        overall_bias_score = len(bias_indicators) * 0.2 if bias_indicators else 0.1
        
        return {
            "analysis_id": str(uuid.uuid4()),
            "jd_text": jd_text,
            "overall_bias_score": min(overall_bias_score, 1.0),
            "confidence_score": confidence_score,
            "bias_indicators": bias_indicators,
            "categories": {
                "gender_bias": random.uniform(0.1, 0.4),
                "age_bias": random.uniform(0.1, 0.3), 
                "racial_bias": random.uniform(0.05, 0.2),
                "educational_bias": random.uniform(0.1, 0.35),
                "socioeconomic_bias": random.uniform(0.05, 0.25)
            },
            "recommendations": [
                "Use inclusive language throughout the job description",
                "Focus on skills and qualifications rather than personal attributes",
                "Avoid culture-specific references",
                "Use gender-neutral pronouns and terms"
            ],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rewrite")
def rewrite_jd(request: BiasRewriteRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        original_text = request.jd_text.strip()
        
        if not original_text:
            raise HTTPException(status_code=400, detail="Job description text is required")
        
        # Mock JD rewriting with inclusive language
        rewrite_variants = []
        
        # Create 3 variants with different approaches
        for i in range(3):
            variant_text = original_text
            
            # Replace potentially biased terms
            replacements = {
                "guys": "team members",
                "ninja": "expert",
                "rockstar": "talented professional", 
                "young": "motivated",
                "energetic": "enthusiastic",
                "he/she": "they",
                "his/her": "their",
                "chairman": "chairperson",
                "manpower": "workforce"
            }
            
            for old, new in replacements.items():
                variant_text = variant_text.replace(old, new)
                variant_text = variant_text.replace(old.capitalize(), new.capitalize())
            
            rewrite_variants.append({
                "variant_id": f"v{i+1}",
                "title": f"Inclusive Variant {i+1}",
                "text": variant_text,
                "bias_reduction": random.uniform(0.6, 0.85),
                "inclusivity_score": random.uniform(0.8, 0.95),
                "changes_made": [
                    "Replaced gendered language with neutral terms",
                    "Removed age-specific requirements",
                    "Used inclusive pronouns"
                ]
            })
        
        return {
            "rewrite_id": str(uuid.uuid4()),
            "original_text": original_text,
            "variants": rewrite_variants,
            "overall_improvement": random.uniform(0.7, 0.9),
            "certificate": {
                "id": str(uuid.uuid4()),
                "issued_date": datetime.now().isoformat(),
                "validity": "1 year",
                "compliance_level": "AA"
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
def get_bias_history(user_id: str = None, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        target_user_id = user_id or str(current_user.id)
        
        # Mock bias analysis history
        history = []
        for i in range(5):
            history.append({
                "analysis_id": str(uuid.uuid4()),
                "type": random.choice(["detect", "rewrite"]),
                "timestamp": (datetime.now() - timedelta(days=i*2)).isoformat(),
                "bias_score": random.uniform(0.1, 0.8),
                "job_title": random.choice(["Software Engineer", "Marketing Manager", "Data Scientist", "Product Manager"]),
                "status": "completed"
            })
        
        return {
            "user_id": target_user_id,
            "total_analyses": len(history),
            "history": history,
            "summary": {
                "average_bias_score": sum(h["bias_score"] for h in history) / len(history),
                "most_common_bias": "gender_bias",
                "improvement_trend": "positive"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))