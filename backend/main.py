from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import bcrypt
from database import get_db
from models import User, Session as UserSession, JobDescription, BiasReport, IntersectionalBiasMatrix, BiasHeatmapData, Explanation, FairnessMetric
import uuid
import os
import json
import re
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any

app = FastAPI(title="Merit Mind API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",
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

# ── Health ────────────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Merit Mind backend is running!"}

# ── Bias Detection & JD Rewriting ─────────────────────────────

# Bias Detection Schemas
class BiasDetectionRequest(BaseModel):
    jd_text: str
    user_role: str  # recruiter | candidate
    user_id: str

class BiasAxis(BaseModel):
    axis: str
    detected: bool
    severity: int
    trigger_phrase: str

class CompoundIntersection(BaseModel):
    combination: str
    severity: int
    explanation: str

class BiasDetectionResponse(BaseModel):
    overall_score: int
    risk_level: str  # HIGH | MODERATE | LOW
    bias_axes: List[BiasAxis]
    compound_intersections: List[CompoundIntersection]
    plain_explanation: str

# JD Rewriter Schemas
class JDRewriteRequest(BaseModel):
    jd_text: str
    target_demographics: List[str]
    user_id: str

class DiffAnnotation(BaseModel):
    original_phrase: str
    rewritten_phrase: str
    bias_type: str
    reason: str

class AuditCertificate(BaseModel):
    original_bias_score: int
    rewritten_bias_score: int
    intersections_resolved: int
    compliant_with: List[str]
    certified_by: str
    date: str

class JDRewriteResponse(BaseModel):
    variants: Dict[str, str]  # conservative, balanced, inclusive_first
    diff_annotations: List[DiffAnnotation]
    attraction_score_before: int
    attraction_score_after: int
    predicted_outcome: str
    certificate: AuditCertificate

class BiasHistoryItem(BaseModel):
    id: str
    jd_text: str
    analysis_type: str  # 'detect' or 'rewrite'
    bias_score: int
    risk_level: str
    created_at: str

def call_claude_api(system_prompt: str, user_message: str) -> Optional[Dict[Any, Any]]:
    """Call Claude API if available, return None if not configured or fails"""
    try:
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            print("ANTHROPIC_API_KEY not found, using mock data")
            return None
            
        # TODO: Implement actual Claude API call when API key is available
        # For now, return None to use mock data
        # When implementing, make sure to use the user_message parameter which contains the actual jd_text
        return None
    except Exception as e:
        print(f"Claude API error: {e}")
        return None

def get_mock_bias_results(jd_text: str) -> Dict[Any, Any]:
    """Return mock bias results for empty or invalid input"""
    return {
        "overall_score": 0,
        "risk_level": "LOW",
        "bias_axes": [
            {"axis": "Gender", "detected": False, "severity": 0, "trigger_phrase": ""},
            {"axis": "College Tier", "detected": False, "severity": 0, "trigger_phrase": ""},
            {"axis": "Regional/Language", "detected": False, "severity": 0, "trigger_phrase": ""},
            {"axis": "Socioeconomic", "detected": False, "severity": 0, "trigger_phrase": ""},
            {"axis": "Caste Signal", "detected": False, "severity": 0, "trigger_phrase": ""},
            {"axis": "Matrimonial/Age", "detected": False, "severity": 0, "trigger_phrase": ""}
        ],
        "compound_intersections": [],
        "plain_explanation": "No job description text provided for analysis."
    }

def get_mock_rewrite_results(jd_text: str, target_demographics: List[str]) -> Dict[Any, Any]:
    """Return mock rewrite results for empty or invalid input"""
    return {
        "variants": {
            "conservative": "Please provide job description text to rewrite.",
            "balanced": "Please provide job description text to rewrite.",
            "inclusive_first": "Please provide job description text to rewrite."
        },
        "diff_annotations": [],
        "attraction_score_before": 50,
        "attraction_score_after": 50,
        "predicted_outcome": "No changes made - please provide job description text.",
        "certificate": {
            "original_bias_score": 0,
            "rewritten_bias_score": 0,
            "intersections_resolved": 0,
            "compliant_with": [],
            "certified_by": "Merit Mind Bias Analysis Engine v1.0",
            "date": datetime.now().strftime("%Y-%m-%d")
        }
    }

def analyze_jd_text_for_bias(jd_text: str) -> Dict[Any, Any]:
    """Analyze job description text for Indian-specific bias patterns"""
    if not jd_text or not jd_text.strip():
        return get_mock_bias_results("")
    
    jd_lower = jd_text.lower()
    bias_score = 0
    detected_axes = []
    compound_intersections = []
    
    # Enhanced Gender bias detection
    gender_triggers = [
        'he should', 'his responsibility', 'guys', 'brotherhood', 'manpower', 'chairman',
        'young and dynamic', 'aggressive targets', 'rockstar', 'ninja', 'guru',
        'extended hours expected', 'fast-paced hustle', 'energetic and on the go'
    ]
    gender_detected = any(trigger in jd_lower for trigger in gender_triggers)
    gender_severity = 0
    gender_phrase = ""
    if gender_detected:
        for trigger in gender_triggers:
            if trigger in jd_lower:
                gender_phrase = trigger
                gender_severity = 8 if trigger in ['guys', 'manpower', 'brotherhood'] else 6
                bias_score += 15 if gender_severity == 8 else 12
                break
    
    detected_axes.append({
        "axis": "Gender",
        "detected": gender_detected,
        "severity": gender_severity,
        "trigger_phrase": gender_phrase
    })
    
    # Enhanced College tier bias detection
    college_triggers = [
        'iit', 'nit', 'premier institute', 'top tier college', 'elite institution',
        'iit preferred', 'nit preferred', 'iit/nit only', 'high-performance pedigree',
        'prestigious background', 'top-tier college'
    ]
    college_detected = any(trigger in jd_lower for trigger in college_triggers)
    college_severity = 0
    college_phrase = ""
    if college_detected:
        for trigger in college_triggers:
            if trigger in jd_lower:
                college_phrase = trigger
                college_severity = 10 if 'iit' in trigger or 'nit' in trigger else 8
                bias_score += 25 if college_severity == 10 else 18
                break
    
    detected_axes.append({
        "axis": "College Tier",
        "detected": college_detected,
        "severity": college_severity,
        "trigger_phrase": college_phrase
    })
    
    # Enhanced Regional/Language bias detection
    language_triggers = [
        'hindi mandatory', 'hindi fluency', 'local language', 'regional language required',
        'hindi fluency mandatory', 'north india preferred', 'metro culture'
    ]
    language_detected = any(trigger in jd_lower for trigger in language_triggers)
    language_severity = 0
    language_phrase = ""
    if language_detected:
        for trigger in language_triggers:
            if trigger in jd_lower:
                language_phrase = trigger
                language_severity = 9 if 'mandatory' in trigger else 7
                bias_score += 20 if language_severity == 9 else 15
                break
    
    detected_axes.append({
        "axis": "Regional/Language",
        "detected": language_detected,
        "severity": language_severity,
        "trigger_phrase": language_phrase
    })
    
    # Enhanced Socioeconomic bias detection
    socio_triggers = [
        'excellent english', 'fluent english communication', 'premium background',
        'excellent english communication essential', 'high-class environment',
        'sophisticated communication'
    ]
    socio_detected = any(trigger in jd_lower for trigger in socio_triggers)
    socio_severity = 0
    socio_phrase = ""
    if socio_detected:
        for trigger in socio_triggers:
            if trigger in jd_lower:
                socio_phrase = trigger
                socio_severity = 8 if 'essential' in trigger else 6
                bias_score += 16 if socio_severity == 8 else 12
                break
    
    detected_axes.append({
        "axis": "Socioeconomic",
        "detected": socio_detected,
        "severity": socio_severity,
        "trigger_phrase": socio_phrase
    })
    
    # Enhanced Caste signal detection
    caste_triggers = [
        'cultural fit', 'cultural alignment', 'family background',
        'aligned with our values', 'elite network preferred', 'prestigious family',
        'high-class background'
    ]
    caste_detected = any(trigger in jd_lower for trigger in caste_triggers)
    caste_severity = 0
    caste_phrase = ""
    if caste_detected:
        for trigger in caste_triggers:
            if trigger in jd_lower:
                caste_phrase = trigger
                caste_severity = 8 if 'cultural fit' in trigger else 6
                bias_score += 18 if caste_severity == 8 else 12
                break
    
    detected_axes.append({
        "axis": "Caste Signal",
        "detected": caste_detected,
        "severity": caste_severity,
        "trigger_phrase": caste_phrase
    })
    
    # Enhanced Age/Matrimonial bias detection
    age_triggers = [
        'young and energetic', 'fresh graduate', 'unmarried preferred',
        'young and dynamic', 'no gaps in employment preferred',
        'continuous experience required', 'uninterrupted career path'
    ]
    age_detected = any(trigger in jd_lower for trigger in age_triggers)
    age_severity = 0
    age_phrase = ""
    if age_detected:
        for trigger in age_triggers:
            if trigger in jd_lower:
                age_phrase = trigger
                age_severity = 7 if 'unmarried' in trigger or 'gaps' in trigger else 5
                bias_score += 15 if age_severity == 7 else 10
                break
    
    detected_axes.append({
        "axis": "Matrimonial/Age",
        "detected": age_detected,
        "severity": age_severity,
        "trigger_phrase": age_phrase
    })
    
    # Enhanced Compound intersections with Indian-specific patterns
    if college_detected and language_detected:
        compound_intersections.append({
            "combination": "College Tier × Regional/Language",
            "severity": 10,
            "explanation": "IIT/NIT preference + Hindi requirement creates double exclusion for South Indian state college graduates"
        })
        bias_score += 15
    
    if gender_detected and age_detected:
        compound_intersections.append({
            "combination": "Gender × Age/Matrimonial",
            "severity": 9,
            "explanation": "Gender-coded language + age preferences disproportionately excludes women with career breaks"
        })
        bias_score += 12
    
    if caste_detected and college_detected:
        compound_intersections.append({
            "combination": "Caste Signal × College Tier",
            "severity": 9,
            "explanation": "Cultural fit requirements + premier institute preference reinforces upper-caste networks"
        })
        bias_score += 12
    
    if socio_detected and language_detected:
        compound_intersections.append({
            "combination": "Socioeconomic × Regional/Language",
            "severity": 8,
            "explanation": "English fluency emphasis + regional language bias excludes non-metro, non-English medium candidates"
        })
        bias_score += 10
    
    # Triple intersection - the most exclusionary
    if college_detected and language_detected and caste_detected:
        compound_intersections.append({
            "combination": "College Tier × Regional × Caste Signal",
            "severity": 10,
            "explanation": "IIT + Hindi + Cultural fit creates maximum exclusion - specifically targets upper-caste North Indian elite"
        })
        bias_score += 20
    
    # Determine risk level
    if bias_score >= 60:
        risk_level = "HIGH"
    elif bias_score >= 30:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"
    
    # Generate Indian-context explanation
    detected_count = len([x for x in detected_axes if x['detected']])
    if bias_score > 0:
        explanation = f"This job description contains {detected_count} bias signals with a total score of {bias_score}/100. "
        if compound_intersections:
            explanation += f"Critical finding: {len(compound_intersections)} compound intersections detected. "
            explanation += "These intersections don't just exclude groups separately - they create compounded barriers that specifically target multiple marginalized identities simultaneously. "
        explanation += "In the Indian hiring context, these patterns systematically exclude SC/ST candidates, women, Tier-2/3 city graduates, and regional minorities."
    else:
        explanation = "This job description shows minimal bias signals. The language appears skills-focused rather than demographic-coded, which is positive for inclusive hiring in the Indian context."
    
    return {
        "overall_score": min(bias_score, 100),  # Cap at 100
        "risk_level": risk_level,
        "bias_axes": detected_axes,
        "compound_intersections": compound_intersections,
        "plain_explanation": explanation
    }

def get_demographic_rules(target_demographics: List[str]) -> Dict[str, Any]:
    """Get rewriting rules for specific Indian demographics"""
    rules = {
        "remove_phrases": [],
        "add_elements": [],
        "reframe_patterns": [],
        "specific_changes": []
    }
    
    for demographic in target_demographics:
        if "Women in Technical Roles" in demographic:
            rules["remove_phrases"].extend([
                "young and dynamic", "aggressive targets", "rockstar", 
                "extended hours expected", "fast-paced hustle", "ninja", "guru"
            ])
            rules["add_elements"].extend([
                "hybrid/flexible work options", "output-based performance evaluation",
                "structured career growth path", "mentorship opportunities"
            ])
            rules["reframe_patterns"].extend([
                ("competitive", "collaborative"), ("aggressive", "proactive"),
                ("hustle", "dedication"), ("rockstar", "skilled professional")
            ])
            
        if "Candidates from Tier-2/3 Cities" in demographic:
            rules["remove_phrases"].extend([
                "metro culture", "willingness to relocate mandatory",
                "fast-paced startup environment"
            ])
            rules["add_elements"].extend([
                "remote/hybrid work flexibility", "relocation support provided",
                "structured onboarding program", "comprehensive training"
            ])
            rules["reframe_patterns"].extend([
                ("fast-paced startup", "structured, growing team"),
                ("metro experience", "professional experience")
            ])
            
        if "First-Generation Graduates" in demographic:
            rules["remove_phrases"].extend([
                "premier institute preferred", "IIT/NIT only", "IIT preferred",
                "high-performance pedigree", "strong fundamentals", "top-tier college"
            ])
            rules["add_elements"].extend([
                "mentorship and guidance provided", "structured learning path",
                "growth-oriented environment", "skill development opportunities"
            ])
            rules["reframe_patterns"].extend([
                ("you must already know", "you will learn and develop"),
                ("proven track record", "demonstrated potential"),
                ("extensive experience required", "relevant experience preferred")
            ])
            
        if "SC/ST Candidates" in demographic:
            rules["remove_phrases"].extend([
                "cultural fit", "aligned with our values", "elite network preferred",
                "prestigious background", "high-class environment"
            ])
            rules["add_elements"].extend([
                "merit-based evaluation process", "equal opportunity employer",
                "skills-first assessment", "capability-focused selection"
            ])
            rules["reframe_patterns"].extend([
                ("meritocracy", "capability and contribution"),
                ("cultural fit", "team collaboration"),
                ("elite", "skilled")
            ])
            
        if "South/East/Northeast India" in demographic:
            rules["remove_phrases"].extend([
                "Hindi fluency mandatory", "Hindi mandatory", "North India preferred",
                "local language required"
            ])
            rules["add_elements"].extend([
                "English as primary working language", "multilingual team environment",
                "regional diversity welcomed", "inclusive communication"
            ])
            rules["reframe_patterns"].extend([
                ("Hindi mandatory", "communication skills required"),
                ("local language", "effective communication")
            ])
            
        if "Persons with Disabilities" in demographic:
            rules["remove_phrases"].extend([
                "energetic and on the go", "physically demanding", "high mobility required"
            ])
            rules["add_elements"].extend([
                "accessibility support available", "flexible work arrangements",
                "inclusive evaluation process", "reasonable accommodations provided"
            ])
            rules["reframe_patterns"].extend([
                ("energetic", "motivated"), ("on the go", "adaptable"),
                ("physical requirements", "role requirements")
            ])
            
        if "Women Returning from Career Breaks" in demographic:
            rules["remove_phrases"].extend([
                "no gaps in employment preferred", "continuous experience required",
                "willingness to travel extensively", "uninterrupted career path"
            ])
            rules["add_elements"].extend([
                "returnship programs available", "flexible ramp-up period",
                "skills-based evaluation", "career restart support"
            ])
            rules["reframe_patterns"].extend([
                ("continuous experience", "relevant experience"),
                ("uninterrupted career", "professional background")
            ])
    
    return rules

def apply_demographic_rewriting(jd_text: str, target_demographics: List[str], variant_type: str) -> tuple:
    """Apply demographic-specific rewriting rules"""
    rules = get_demographic_rules(target_demographics)
    rewritten_text = jd_text
    diff_annotations = []
    
    # Remove biased phrases
    for phrase in rules["remove_phrases"]:
        if phrase.lower() in rewritten_text.lower():
            pattern = re.compile(re.escape(phrase), re.IGNORECASE)
            match = pattern.search(rewritten_text)
            if match:
                actual_phrase = match.group()
                rewritten_text = pattern.sub("", rewritten_text)
                diff_annotations.append({
                    "original_phrase": actual_phrase,
                    "rewritten_phrase": "removed",
                    "bias_type": "Exclusionary Language",
                    "reason": f"Removed phrase that deters {', '.join(target_demographics)}"
                })
    
    # Apply reframing patterns
    for old_pattern, new_pattern in rules["reframe_patterns"]:
        if old_pattern.lower() in rewritten_text.lower():
            pattern = re.compile(re.escape(old_pattern), re.IGNORECASE)
            match = pattern.search(rewritten_text)
            if match:
                actual_phrase = match.group()
                rewritten_text = pattern.sub(new_pattern, rewritten_text)
                diff_annotations.append({
                    "original_phrase": actual_phrase,
                    "rewritten_phrase": new_pattern,
                    "bias_type": "Inclusive Reframing",
                    "reason": f"Reframed to attract {', '.join(target_demographics)}"
                })
    
    # Add inclusive elements based on variant type
    additions = []
    if variant_type == "conservative":
        # Minimal additions
        if "mentorship" in str(rules["add_elements"]):
            additions.append("Mentorship opportunities available.")
    elif variant_type == "balanced":
        # Moderate additions
        additions.extend(rules["add_elements"][:2])  # First 2 elements
    elif variant_type == "inclusive_first":
        # Maximum additions
        additions.extend(rules["add_elements"])
    
    if additions:
        addition_text = "\n\n" + " ".join(additions)
        rewritten_text += addition_text
        diff_annotations.append({
            "original_phrase": "[end of JD]",
            "rewritten_phrase": addition_text.strip(),
            "bias_type": "Attraction Signals",
            "reason": f"Added elements to attract {', '.join(target_demographics)}"
        })
    
    return rewritten_text, diff_annotations

def calculate_attraction_score(target_demographics: List[str], original_bias_score: int, has_inclusive_elements: bool) -> tuple:
    """Calculate attraction scores before and after rewrite"""
    # Base attraction score (inverse of bias)
    base_before = max(20, 100 - original_bias_score)
    
    # Demographic-specific improvements
    improvement_factor = 1.0
    for demographic in target_demographics:
        if "Women" in demographic:
            improvement_factor += 0.25
        if "Tier-2/3" in demographic:
            improvement_factor += 0.20
        if "First-Generation" in demographic:
            improvement_factor += 0.30
        if "SC/ST" in demographic:
            improvement_factor += 0.35
        if "South/East/Northeast" in demographic:
            improvement_factor += 0.25
        if "Disabilities" in demographic:
            improvement_factor += 0.20
        if "Career Breaks" in demographic:
            improvement_factor += 0.30
    
    attraction_after = min(95, int(base_before * improvement_factor))
    if has_inclusive_elements:
        attraction_after = min(95, attraction_after + 10)
    
    return base_before, attraction_after

def analyze_jd_for_rewrite(jd_text: str, target_demographics: List[str]) -> Dict[Any, Any]:
    """Analyze and rewrite job description for target demographics using Indian hiring bias expertise"""
    if not jd_text or not jd_text.strip():
        return get_mock_rewrite_results("", target_demographics)
    
    # FEATURE 1: Get bias analysis first (feeds into Feature 2)
    bias_analysis = analyze_jd_text_for_bias(jd_text)
    original_score = bias_analysis["overall_score"]
    
    # Generate three variants with demographic-specific rules
    variants = {}
    all_diff_annotations = []
    
    for variant_type in ["conservative", "balanced", "inclusive_first"]:
        rewritten_text, diff_annotations = apply_demographic_rewriting(jd_text, target_demographics, variant_type)
        variants[variant_type] = rewritten_text
        if variant_type == "balanced":  # Use balanced for diff annotations
            all_diff_annotations = diff_annotations
    
    # CLOSED LOOP: Feature 2 feeds back into Feature 1 for re-verification
    new_analysis = analyze_jd_text_for_bias(variants["balanced"])
    new_score = new_analysis["overall_score"]
    
    # Calculate attraction scores
    has_inclusive_elements = len(all_diff_annotations) > 0
    attraction_before, attraction_after = calculate_attraction_score(target_demographics, original_score, has_inclusive_elements)
    
    # Generate predicted outcome
    improvement_pct = int(((attraction_after - attraction_before) / attraction_before) * 100) if attraction_before > 0 else 50
    predicted_outcome = f"Expected {improvement_pct}% increase in applications from {', '.join(target_demographics)}. Bias score reduced from {original_score} to {new_score}."
    
    return {
        "variants": variants,
        "diff_annotations": all_diff_annotations,
        "attraction_score_before": attraction_before,
        "attraction_score_after": attraction_after,
        "predicted_outcome": predicted_outcome,
        "certificate": {
            "original_bias_score": original_score,
            "rewritten_bias_score": new_score,
            "intersections_resolved": len(all_diff_annotations),
            "compliant_with": ["Equal Opportunity Employment", "Inclusive Hiring Practices", "Indian Employment Laws"],
            "certified_by": "Merit Mind Indian Bias Analysis Engine v2.0",
            "date": datetime.now().strftime("%Y-%m-%d")
        }
    }

@app.post("/api/bias/detect", response_model=BiasDetectionResponse)
def detect_bias(req: BiasDetectionRequest, db: Session = Depends(get_db)):
    """Detect bias in job description"""
    try:
        # Try Claude API first with the actual jd_text
        system_prompt = f"""You are an expert in Indian hiring discrimination. 
        Analyze this job description for bias across these axes: Gender, College Tier, 
        Caste Signal, Regional/Language, Socioeconomic, Matrimonial/Age — and their 
        compound intersections specific to Indian hiring. Return ONLY valid JSON, 
        no preamble, no markdown.
        
        Job Description to analyze:
        {req.jd_text}
        """
        
        result = call_claude_api(system_prompt, req.jd_text)
        
        # If Claude API fails or is not available, use actual analysis of the input
        if result is None:
            print(f"Analyzing JD text: {req.jd_text[:100]}...")  # Log first 100 chars
            result = analyze_jd_text_for_bias(req.jd_text)
        
        # Store in database (best effort)
        try:
            # Insert job description
            job_desc = JobDescription(
                recruiter_id=uuid.UUID(req.user_id) if req.user_role == 'recruiter' else None,
                raw_text=req.jd_text,
                bias_score=float(result["overall_score"]),
                created_at=datetime.utcnow()
            )
            db.add(job_desc)
            db.flush()
            
            # Insert bias report
            bias_report = BiasReport(
                jd_id=job_desc.id if req.user_role == 'recruiter' else None,
                bias_type="overall",
                severity=float(result["overall_score"]),
                axis="overall",
                created_at=datetime.utcnow()
            )
            db.add(bias_report)
            db.flush()
            
            # Insert intersectional bias data
            for intersection in result.get("compound_intersections", []):
                intersectional_bias = IntersectionalBiasMatrix(
                    report_id=bias_report.id,
                    axis_row=intersection["combination"].split(" x ")[0] if " x " in intersection["combination"] else intersection["combination"],
                    axis_col=intersection["combination"].split(" x ")[1] if " x " in intersection["combination"] else "",
                    score=float(intersection["severity"]),
                    trigger=intersection["explanation"],
                    created_at=datetime.utcnow()
                )
                db.add(intersectional_bias)
            
            # Insert bias heatmap data for each axis
            for axis in result.get("bias_axes", []):
                heatmap_data = BiasHeatmapData(
                    jd_id=job_desc.id,
                    stage=axis["axis"].lower().replace("/", "_").replace(" ", "_"),
                    bias_risk_level=result["risk_level"].lower(),
                    created_at=datetime.utcnow()
                )
                db.add(heatmap_data)
            
            db.commit()
        except Exception as db_error:
            print(f"Database error in bias detection: {db_error}")
            db.rollback()
            # Continue anyway - don't fail the API response due to DB issues
        
        return BiasDetectionResponse(**result)
        
    except Exception as e:
        print(f"Bias detection error: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze bias")

@app.post("/api/bias/rewrite", response_model=JDRewriteResponse)
def rewrite_jd(req: JDRewriteRequest, db: Session = Depends(get_db)):
    """Rewrite job description for inclusivity"""
    try:
        # Try Claude API first with the actual jd_text and target demographics
        system_prompt = f"""You are an expert in Indian inclusive hiring. 
        Rewrite the job description to attract the specified underrepresented 
        demographics using Indian-specific research. Return ONLY valid JSON, 
        no preamble, no markdown.
        
        Job Description to rewrite:
        {req.jd_text}
        
        Target Demographics: {', '.join(req.target_demographics)}
        """
        
        user_message = f"Job Description: {req.jd_text}\nTarget Demographics: {', '.join(req.target_demographics)}"
        result = call_claude_api(system_prompt, user_message)
        
        # If Claude API fails or is not available, use actual analysis of the input
        if result is None:
            print(f"Rewriting JD text for demographics: {req.target_demographics}")  # Log
            result = analyze_jd_for_rewrite(req.jd_text, req.target_demographics)
        
        # Store in database (best effort)
        try:
            # Find or create job description
            job_desc = JobDescription(
                recruiter_id=uuid.UUID(req.user_id),
                raw_text=req.jd_text,
                inclusive_text=result["variants"]["balanced"],
                bias_score=float(result["certificate"]["original_bias_score"]),
                created_at=datetime.utcnow()
            )
            db.add(job_desc)
            db.flush()
            
            # Insert fairness metrics
            fairness_metric = FairnessMetric(
                jd_id=job_desc.id,
                diversity_index=float(result["attraction_score_after"]),
                hiring_quality_score=float(result["attraction_score_after"]),
                bias_cases_count=len(result.get("diff_annotations", [])),
                candidate_trust_score=float(result["attraction_score_after"]),
                created_at=datetime.utcnow()
            )
            db.add(fairness_metric)
            
            # Insert explanations for diff annotations
            for annotation in result.get("diff_annotations", []):
                explanation = Explanation(
                    application_id=None,  # No application context for JD rewriting
                    narrative_text=annotation["reason"],
                    decision_reason=f"{annotation['bias_type']}: {annotation['original_phrase']} -> {annotation['rewritten_phrase']}",
                    created_at=datetime.utcnow()
                )
                db.add(explanation)
            
            db.commit()
        except Exception as db_error:
            print(f"Database error in JD rewrite: {db_error}")
            db.rollback()
            # Continue anyway - don't fail the API response due to DB issues
            
        return JDRewriteResponse(**result)
        
    except Exception as e:
        print(f"JD rewrite error: {e}")
        raise HTTPException(status_code=500, detail="Failed to rewrite job description")

@app.get("/api/bias/history")
def get_bias_history(user_id: str, db: Session = Depends(get_db)):
    """Get bias analysis history for a user"""
    try:
        # Query job descriptions created by the user (both bias detection and rewrites)
        job_descriptions = db.query(JobDescription).filter(
            JobDescription.recruiter_id == uuid.UUID(user_id)
        ).order_by(JobDescription.created_at.desc()).limit(10).all()
        
        results = []
        for job_desc in job_descriptions:
            # Determine analysis type based on whether inclusive_text exists
            analysis_type = "rewrite" if job_desc.inclusive_text else "detect"
            
            # Determine risk level based on bias_score
            if job_desc.bias_score >= 60:
                risk_level = "HIGH"
            elif job_desc.bias_score >= 30:
                risk_level = "MODERATE" 
            else:
                risk_level = "LOW"
                
            results.append({
                "id": str(job_desc.id),
                "jd_text": job_desc.raw_text or "",
                "analysis_type": analysis_type,
                "bias_score": int(job_desc.bias_score or 0),
                "risk_level": risk_level,
                "created_at": job_desc.created_at.isoformat()
            })
        
        return results
        
    except Exception as e:
        print(f"Bias history error: {e}")
        # Return empty array on error to prevent frontend breaking
        return []