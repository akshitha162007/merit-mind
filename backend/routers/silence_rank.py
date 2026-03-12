from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Application, Resume, Candidate, JobDescription, SilenceRankResult
from agents.silence_rank import run_silence_rank
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/silence-rank", tags=["silence-rank"])

class SilenceRankRequest(BaseModel):
    jd_id: str
    application_ids: list

@router.post("/run")
def run_silence_rank_analysis(request: SilenceRankRequest, db: Session = Depends(get_db)):
    try:
        jd_id = request.jd_id
        application_ids = request.application_ids
        
        jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
        if not jd:
            raise HTTPException(status_code=404, detail="Job description not found")
        
        jd_text = jd.raw_text or ""
        
        candidates = []
        for app_id in application_ids:
            app = db.query(Application).filter(Application.id == app_id).first()
            if not app:
                continue
            
            resume = db.query(Resume).filter(Resume.id == app.resume_id).first()
            candidate = db.query(Candidate).filter(Candidate.id == app.candidate_id).first()
            
            if resume and candidate:
                candidates.append({
                    "id": candidate.id,
                    "application_id": app.id,
                    "name": candidate.name,
                    "resume_text": resume.raw_text or ""
                })
        
        if not candidates:
            raise HTTPException(status_code=400, detail="No valid candidates found")
        
        results = run_silence_rank(jd_text, candidates)
        
        for result in results:
            existing = db.query(SilenceRankResult).filter(
                SilenceRankResult.application_id == result["application_id"]
            ).first()
            
            if existing:
                existing.silence_rank = result["silence_rank"]
                existing.language_rank = result["language_rank"]
                existing.lir_score = result["lir"]
                existing.shift_reason = result["shift_reason"]
                existing.skill_similarity = result["silence_score"]
            else:
                new_result = SilenceRankResult(
                    id=str(uuid.uuid4()),
                    application_id=result["application_id"],
                    silence_rank=result["silence_rank"],
                    language_rank=result["language_rank"],
                    lir_score=result["lir"],
                    shift_reason=result["shift_reason"],
                    skill_similarity=result["silence_score"],
                    created_at=datetime.utcnow()
                )
                db.add(new_result)
            
            app = db.query(Application).filter(Application.id == result["application_id"]).first()
            if app:
                app.merit_score = result["silence_score"]
                app.fairness_score = result["silence_score"]
        
        db.commit()
        
        return {
            "status": "success",
            "jd_id": jd_id,
            "results": results
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/results/{jd_id}")
def get_silence_rank_results(jd_id: str, db: Session = Depends(get_db)):
    try:
        applications = db.query(Application).filter(Application.jd_id == jd_id).all()
        
        if not applications:
            raise HTTPException(status_code=404, detail="No applications found for this job description")
        
        results = []
        for app in applications:
            sr = db.query(SilenceRankResult).filter(SilenceRankResult.application_id == app.id).first()
            candidate = db.query(Candidate).filter(Candidate.id == app.candidate_id).first()
            resume = db.query(Resume).filter(Resume.id == app.resume_id).first()
            
            if sr and candidate:
                results.append({
                    "application_id": app.id,
                    "candidate_id": candidate.id,
                    "blind_id": candidate.blind_id,
                    "name": candidate.name,
                    "silence_rank": sr.silence_rank,
                    "language_rank": sr.language_rank,
                    "lir_score": sr.lir_score,
                    "shift_reason": sr.shift_reason,
                    "skill_similarity": sr.skill_similarity,
                    "skills": resume.skill_graph_json if resume else {}
                })
        
        return {
            "status": "success",
            "jd_id": jd_id,
            "results": results
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
