import random
from typing import List, Dict, Any

BIAS_THRESHOLD = 10

NAMES = {
    "male": ["Rahul", "Amit", "Arjun", "Vikram", "Rohan"],
    "female": ["Priya", "Anjali", "Sneha", "Kavya", "Neha"],
    "neutral": ["Alex", "Jordan", "Taylor", "Morgan", "Casey"],
    "western": ["John", "Emily", "Michael", "Sarah", "David"]
}

COLLEGES = {
    "tier1": ["IIT Delhi", "IIT Bombay", "BITS Pilani"],
    "tier2": ["NIT Trichy", "IIIT Hyderabad", "VIT Vellore"],
    "tier3": ["Local Engineering College", "State University"]
}

LOCATIONS = ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Chennai", "Pune"]


def generate_counterfactual_profiles(candidate_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate identity variants while keeping qualifications unchanged."""
    profiles = [candidate_profile.copy()]
    
    base_profile = {
        "skills": candidate_profile.get("skills", []),
        "experience": candidate_profile.get("experience", 0),
        "education": candidate_profile.get("education", ""),
        "projects": candidate_profile.get("projects", [])
    }
    
    all_names = NAMES["male"] + NAMES["female"] + NAMES["western"]
    for name in random.sample(all_names, min(3, len(all_names))):
        variant = base_profile.copy()
        variant["name"] = name
        variant["college"] = candidate_profile.get("college", random.choice(COLLEGES["tier2"]))
        variant["location"] = candidate_profile.get("location", random.choice(LOCATIONS))
        profiles.append(variant)
    
    for tier_key, colleges in COLLEGES.items():
        variant = base_profile.copy()
        variant["name"] = candidate_profile.get("name", "Candidate")
        variant["college"] = random.choice(colleges)
        variant["location"] = candidate_profile.get("location", random.choice(LOCATIONS))
        profiles.append(variant)
    
    return profiles


def evaluate_variants(profiles: List[Dict[str, Any]]) -> Dict[str, float]:
    """Score each profile variant using the scoring model."""
    scores = {}
    
    for profile in profiles:
        name = profile.get("name", "Unknown")
        base_score = 50
        
        skills = profile.get("skills", [])
        base_score += len(skills) * 5
        
        experience = profile.get("experience", 0)
        base_score += experience * 3
        
        college = profile.get("college", "")
        if any(tier1 in college for tier1 in COLLEGES["tier1"]):
            base_score += 15
        elif any(tier2 in college for tier2 in COLLEGES["tier2"]):
            base_score += 8
        
        if name in NAMES["western"]:
            base_score += 12
        elif name in NAMES["male"]:
            base_score += 5
        
        scores[name] = min(100, base_score)
    
    return scores


def calculate_bias_delta(scores: Dict[str, float]) -> float:
    """Calculate bias delta as max - min score."""
    if not scores:
        return 0.0
    return max(scores.values()) - min(scores.values())


def apply_bias_correction(original_score: float, scores: Dict[str, float]) -> float:
    """Apply bias correction by using the highest variant score."""
    bias_delta = calculate_bias_delta(scores)
    
    if bias_delta > BIAS_THRESHOLD:
        return max(scores.values())
    
    return original_score


def log_fairness_audit(db, candidate_id: str, original_score: float, 
                       corrected_score: float, bias_delta: float):
    """Store fairness audit log in database."""
    from models import FairnessAuditLog
    from datetime import datetime
    
    audit_log = FairnessAuditLog(
        candidate_id=candidate_id,
        original_score=original_score,
        corrected_score=corrected_score,
        bias_delta=bias_delta,
        timestamp=datetime.utcnow()
    )
    db.add(audit_log)
    db.commit()
    return audit_log
