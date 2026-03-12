from agents.skill_graph_agent import evaluate_skill_match

candidate_skills=["Python","SQL","Business Analytics","Excel"]
job_skills=["Data Analysis","SQL","Python"]
print("result", evaluate_skill_match(candidate_skills, job_skills))
