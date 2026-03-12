import networkx as nx
from typing import List, Dict, Tuple

# Build skill graph with relationships
def build_skill_graph() -> nx.Graph:
    """Build a graph representing skill relationships."""
    G = nx.Graph()
    
    # Define skill relationships (bidirectional edges)
    skill_relationships = [
        # Data & Analytics
        ("Business Analytics", "Data Analysis"),
        ("Data Analysis", "Statistical Modeling"),
        ("Statistical Modeling", "Python Analytics"),
        ("Python Analytics", "Machine Learning"),
        ("Data Analysis", "Data Science"),
        ("Data Science", "Machine Learning"),
        
        # Programming
        ("Python", "Python Analytics"),
        ("Python", "Machine Learning"),
        ("Python", "Data Science"),
        ("JavaScript", "Frontend Development"),
        ("JavaScript", "React"),
        ("React", "Frontend Development"),
        ("Node.js", "Backend Development"),
        ("FastAPI", "Backend Development"),
        ("Django", "Backend Development"),
        
        # Database
        ("SQL", "Database Management"),
        ("PostgreSQL", "SQL"),
        ("MySQL", "SQL"),
        ("MongoDB", "NoSQL"),
        ("Database Management", "Data Engineering"),
        
        # Cloud & DevOps
        ("AWS", "Cloud Computing"),
        ("Azure", "Cloud Computing"),
        ("Docker", "DevOps"),
        ("Kubernetes", "DevOps"),
        ("CI/CD", "DevOps"),
        
        # Business & Management
        ("Project Management", "Agile"),
        ("Agile", "Scrum"),
        ("Business Analytics", "Excel"),
        ("Excel", "Data Analysis"),
        
        # Design
        ("UI/UX", "Frontend Development"),
        ("Figma", "UI/UX"),
        ("Adobe XD", "UI/UX"),
    ]
    
    # Add edges to graph
    for skill1, skill2 in skill_relationships:
        G.add_edge(skill1.lower(), skill2.lower())
    
    return G


def calculate_skill_similarity(candidate_skill: str, job_skill: str, graph: nx.Graph) -> float:
    """Calculate similarity between two skills using graph distance."""
    candidate_skill = candidate_skill.lower()
    job_skill = job_skill.lower()
    
    # Exact match
    if candidate_skill == job_skill:
        return 1.0
    
    # Check if both skills exist in graph
    if candidate_skill not in graph or job_skill not in graph:
        # Partial string match fallback
        if candidate_skill in job_skill or job_skill in candidate_skill:
            return 0.7
        return 0.0
    
    # Calculate shortest path distance
    try:
        distance = nx.shortest_path_length(graph, candidate_skill, job_skill)
        
        # Score based on hop distance
        if distance == 1:
            return 0.85
        elif distance == 2:
            return 0.70
        elif distance == 3:
            return 0.55
        else:
            return 0.3
    except nx.NetworkXNoPath:
        return 0.0


def extract_candidate_skills(candidate_data: Dict) -> List[str]:
    """Extract skills from candidate data."""
    skills = []
    
    # From direct skills field
    if "skills" in candidate_data and candidate_data["skills"]:
        skills.extend(candidate_data["skills"])
    
    # From parsed resume JSON
    if "parsed_json" in candidate_data and candidate_data["parsed_json"]:
        parsed = candidate_data["parsed_json"]
        if isinstance(parsed, dict) and "skills" in parsed:
            skills.extend(parsed["skills"])
    
    return list(set(skills))  # Remove duplicates


def extract_job_requirements(job_data: Dict) -> List[str]:
    """Extract required skills from job description."""
    skills = []
    
    if "required_skills" in job_data and job_data["required_skills"]:
        if isinstance(job_data["required_skills"], list):
            skills.extend(job_data["required_skills"])
        elif isinstance(job_data["required_skills"], dict):
            skills.extend(job_data["required_skills"].get("skills", []))
    
    return skills


def evaluate_skill_match(candidate_skills: List[str], job_skills: List[str]) -> Dict:
    """Evaluate skill match between candidate and job requirements."""
    graph = build_skill_graph()
    
    matched_skills = []
    similarity_scores = []
    skill_details = []
    
    for job_skill in job_skills:
        best_match = None
        best_score = 0.0
        
        for candidate_skill in candidate_skills:
            score = calculate_skill_similarity(candidate_skill, job_skill, graph)
            
            if score > best_score:
                best_score = score
                best_match = candidate_skill
        
        if best_score > 0.0:
            matched_skills.append(best_match)
            similarity_scores.append(best_score)
            skill_details.append({
                "job_skill": job_skill,
                "candidate_skill": best_match,
                "similarity": best_score
            })
    
    # Calculate final score
    if similarity_scores:
        final_score = sum(similarity_scores) / len(job_skills)
    else:
        final_score = 0.0
    
    return {
        "skill_score": round(final_score, 3),
        "matched_skills": matched_skills,
        "skill_details": skill_details,
        "total_job_skills": len(job_skills),
        "matched_count": len(matched_skills)
    }


def save_skill_match_result(db, candidate_id: str, job_id: str, result: Dict):
    """Save skill match result to database."""
    from models import SkillGraphMatch
    from datetime import datetime
    import uuid
    
    match_record = SkillGraphMatch(
        candidate_id=uuid.UUID(candidate_id),
        jd_id=uuid.UUID(job_id),
        match_percentage=result["skill_score"] * 100,
        transferable_skills_json={
            "matched_skills": result["matched_skills"],
            "skill_details": result["skill_details"],
            "matched_count": result["matched_count"],
            "total_required": result["total_job_skills"]
        },
        cosine_similarity=result["skill_score"]
    )
    
    db.add(match_record)
    db.commit()
    return match_record
