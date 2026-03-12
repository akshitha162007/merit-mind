from sqlalchemy import Column, String, Float, Integer, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.sql import func
from database import Base
import uuid

# ─── AUTH & USERS ───────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    password_hash = Column(String(500), nullable=False)
    role = Column(String(50), default="recruiter")  # recruiter / admin / candidate
    created_at = Column(DateTime, server_default=func.now())

class Session(Base):
    __tablename__ = "sessions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    token = Column(String(500), unique=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

# ─── RECRUITMENT CORE ───────────────────────────────────────

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recruiter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String(300))
    raw_text = Column(Text)
    inclusive_text = Column(Text)
    bias_score = Column(Float)
    required_skills = Column(JSONB)
    nice_to_have_skills = Column(JSONB)
    created_at = Column(DateTime, server_default=func.now())

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200))
    email = Column(String(200))
    resume_url = Column(String(500))
    blind_id = Column(UUID(as_uuid=True), default=uuid.uuid4)
    created_at = Column(DateTime, server_default=func.now())

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"))
    raw_text = Column(Text)
    parsed_json = Column(JSONB)   # skills, education, experience
    skill_graph_json = Column(JSONB)
    created_at = Column(DateTime, server_default=func.now())

class Application(Base):
    __tablename__ = "applications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"))
    jd_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id"))
    status = Column(String(100), default="pending")
    merit_score = Column(Float)
    fairness_score = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

# ─── BIAS DETECTION ─────────────────────────────────────────

class BiasReport(Base):
    __tablename__ = "bias_reports"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    jd_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id"), nullable=True)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=True)
    bias_type = Column(String(200))
    trigger_phrase = Column(Text)
    severity = Column(Float)
    axis = Column(String(100))   # gender / caste / region / age / college_tier
    intersectional_axes = Column(JSONB)
    created_at = Column(DateTime, server_default=func.now())

class IntersectionalBiasMatrix(Base):
    __tablename__ = "intersectional_bias_matrix"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("bias_reports.id"))
    axis_row = Column(String(100))
    axis_col = Column(String(100))
    score = Column(Float)
    trigger = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

# ─── AGENT RESULTS ──────────────────────────────────────────

class CounterfactualSimulation(Base):
    __tablename__ = "counterfactual_simulations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"))
    original_score = Column(Float)
    twin_scores_json = Column(JSONB)
    bias_coefficient = Column(Float)
    phantom_bias_detected = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

class SilenceRankResult(Base):
    __tablename__ = "silence_rank_results"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"))
    silence_rank = Column(Integer)
    language_rank = Column(Integer)
    lir_score = Column(Float)
    shifted_reason = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class EmotionBlindScore(Base):
    __tablename__ = "emotion_blind_scores"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"))
    emotional_score = Column(Float)
    semantic_score = Column(Float)
    gap_score = Column(Float)
    bias_flagged = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

class ReverseBiasSimulation(Base):
    __tablename__ = "reverse_bias_simulations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    jd_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id"))
    synthetic_profiles_count = Column(Integer)
    demographic_parity = Column(Float)
    disparate_impact_ratio = Column(Float)
    bias_risk_score = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())

class SkillGraphMatch(Base):
    __tablename__ = "skill_graph_matches"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"))
    jd_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id"))
    cosine_similarity = Column(Float)
    transferable_skills_json = Column(JSONB)
    match_percentage = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

# ─── FAIRNESS & EXPLAINABILITY ───────────────────────────────

class FairnessMetric(Base):
    __tablename__ = "fairness_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    jd_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id"))
    diversity_index = Column(Float)
    hiring_quality_score = Column(Float)
    bias_cases_count = Column(Integer)
    candidate_trust_score = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

class Explanation(Base):
    __tablename__ = "explanations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"))
    narrative_text = Column(Text)
    shap_values_json = Column(JSONB)
    lime_values_json = Column(JSONB)
    decision_reason = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class BiasHeatmapData(Base):
    __tablename__ = "bias_heatmap_data"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    jd_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id"))
    stage = Column(String(100))  # resume / technical / hr
    bias_risk_level = Column(String(50))  # high / medium / low
    created_at = Column(DateTime, server_default=func.now())

# ─── LEARNING LOOP ───────────────────────────────────────────

class RecruiterOverride(Base):
    __tablename__ = "recruiter_overrides"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recruiter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"))
    original_decision = Column(String(100))
    overridden_decision = Column(String(100))
    reason = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class FairnessAuditLog(Base):
    __tablename__ = "fairness_audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"))
    original_score = Column(Float)
    corrected_score = Column(Float)
    bias_delta = Column(Float)
    timestamp = Column(DateTime, server_default=func.now())