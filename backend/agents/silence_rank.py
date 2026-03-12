import re

TECH_SKILLS = [
    "Python", "JavaScript", "React", "FastAPI", "SQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Git",
    "Machine Learning", "NLP", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Java", "C++", "REST API",
    "Node.js", "TypeScript", "Kubernetes", "Redis", "GraphQL", "Data Analysis", "Deep Learning", "Computer Vision", "Statistics", "Excel",
    "Tableau", "PowerBI", "Figma", "UI/UX", "Agile", "Scrum", "Linux", "Bash", "Flutter", "Dart",
    "Swift", "Kotlin", "Go", "Rust", "C#", ".NET", "Spring Boot", "Django", "Flask", "Ruby",
    "Rails", "PHP", "Laravel", "Vue.js", "Angular", "Next.js", "Tailwind CSS", "Bootstrap", "Firebase", "Supabase"
]

def strip_language(text: str) -> str:
    """Strip common identity markers from resume text with lightweight regexes.

    This keeps the agent importable even when heavy NLP models are unavailable.
    """
    if not text:
        return ""

    cleaned_text = re.sub(r"\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b", "[NAME]", text)
    cleaned_text = re.sub(r"\b([\w.-]+@[\w.-]+\.[A-Za-z]{2,})\b", "[EMAIL]", cleaned_text)
    cleaned_text = re.sub(r"\b(\+?\d[\d\s\-]{8,}\d)\b", "[PHONE]", cleaned_text)

    return cleaned_text

def extract_skills(text: str) -> list:
    """Extract tech skills from text using keyword matching."""
    if not text:
        return []
    
    text_lower = text.lower()
    found_skills = []
    
    for skill in TECH_SKILLS:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    
    return list(set(found_skills))

def compute_similarity(skills_a: list, skills_b: list) -> float:
    """Compute lightweight overlap similarity between two skill lists."""
    if not skills_a or not skills_b:
        return 0.0

    set_a = {s.lower() for s in skills_a}
    set_b = {s.lower() for s in skills_b}
    intersection = len(set_a.intersection(set_b))
    union = len(set_a.union(set_b))
    return float(intersection / union) if union else 0.0

def run_silence_rank(jd_text: str, candidates: list) -> list:
    """Run SilenceRank analysis on candidates against job description."""
    if not jd_text or not candidates:
        return []
    
    jd_skills = extract_skills(jd_text)
    results = []
    
    for candidate in candidates:
        resume_text = candidate.get("resume_text", "")
        
        stripped_text = strip_language(resume_text)
        silence_skills = extract_skills(stripped_text)
        language_skills = extract_skills(resume_text)
        
        silence_score = compute_similarity(silence_skills, jd_skills)
        language_score = compute_similarity(language_skills, jd_skills)
        
        lir = round(abs(silence_score - language_score), 4)
        lir_flag = lir > 0.15
        shift_reason = "High language influence detected" if lir_flag else "Skill-driven ranking"
        
        results.append({
            "candidate_id": candidate.get("id"),
            "application_id": candidate.get("application_id"),
            "name": candidate.get("name"),
            "silence_score": round(silence_score, 4),
            "language_score": round(language_score, 4),
            "lir": lir,
            "lir_flag": lir_flag,
            "shift_reason": shift_reason,
            "silence_skills": silence_skills,
            "language_skills": language_skills
        })
    
    results_sorted_silence = sorted(results, key=lambda x: x["silence_score"], reverse=True)
    results_sorted_language = sorted(results, key=lambda x: x["language_score"], reverse=True)
    
    for idx, result in enumerate(results_sorted_silence):
        result["silence_rank"] = idx + 1
    
    for idx, result in enumerate(results_sorted_language):
        result["language_rank"] = idx + 1
    
    return results
