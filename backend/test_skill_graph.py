import sys
sys.path.append('.')

from agents.skill_graph_agent import (
    build_skill_graph,
    calculate_skill_similarity,
    evaluate_skill_match
)

def test_skill_graph_agent():
    print("=" * 70)
    print("Testing Skill Graph Intelligence Agent")
    print("=" * 70)
    
    # Build graph
    print("\n1. Building Skill Graph...")
    graph = build_skill_graph()
    print(f"   Graph nodes: {graph.number_of_nodes()}")
    print(f"   Graph edges: {graph.number_of_edges()}")
    
    # Test similarity calculations
    print("\n2. Testing Skill Similarity Calculations...")
    
    test_cases = [
        ("SQL", "SQL"),
        ("Business Analytics", "Data Analysis"),
        ("Python", "Machine Learning"),
        ("Excel", "Data Analysis"),
        ("React", "Frontend Development"),
    ]
    
    for skill1, skill2 in test_cases:
        similarity = calculate_skill_similarity(skill1, skill2, graph)
        print(f"   {skill1} ↔ {skill2}: {similarity:.2f}")
    
    # Test full evaluation
    print("\n3. Testing Full Skill Match Evaluation...")
    
    candidate_skills = ["Python", "SQL", "Business Analytics", "Excel"]
    job_skills = ["Data Analysis", "SQL", "Python"]
    
    print(f"\n   Candidate Skills: {', '.join(candidate_skills)}")
    print(f"   Job Requirements: {', '.join(job_skills)}")
    
    result = evaluate_skill_match(candidate_skills, job_skills)
    
    print(f"\n   Skill Match Score: {result['skill_score']:.3f} ({result['skill_score']*100:.1f}%)")
    print(f"   Matched Skills: {result['matched_count']}/{result['total_job_skills']}")
    print(f"   Matched: {', '.join(result['matched_skills'])}")
    
    print("\n4. Detailed Skill Mapping:")
    for detail in result['skill_details']:
        print(f"   {detail['job_skill']} ← {detail['candidate_skill']} ({detail['similarity']:.2f})")
    
    print("\n" + "=" * 70)
    print("Test Complete!")
    print("=" * 70)

if __name__ == "__main__":
    test_skill_graph_agent()
