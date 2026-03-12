import sys
sys.path.append('.')

from agents.counterfactual_agent import (
    generate_counterfactual_profiles,
    evaluate_variants,
    calculate_bias_delta,
    apply_bias_correction,
    BIAS_THRESHOLD
)

def test_counterfactual_agent():
    print("=" * 60)
    print("Testing Counterfactual Fairness Agent")
    print("=" * 60)
    
    # Test candidate profile
    candidate_profile = {
        "name": "Priya",
        "skills": ["Python", "SQL", "FastAPI"],
        "experience": 3,
        "education": "B.Tech Computer Science",
        "college": "NIT Trichy",
        "location": "Bangalore"
    }
    
    print("\n1. Original Candidate Profile:")
    print(f"   Name: {candidate_profile['name']}")
    print(f"   Skills: {', '.join(candidate_profile['skills'])}")
    print(f"   Experience: {candidate_profile['experience']} years")
    print(f"   College: {candidate_profile['college']}")
    
    # Generate counterfactual profiles
    print("\n2. Generating Counterfactual Profiles...")
    profiles = generate_counterfactual_profiles(candidate_profile)
    print(f"   Generated {len(profiles)} profile variants")
    
    # Evaluate variants
    print("\n3. Evaluating Variants...")
    scores = evaluate_variants(profiles)
    print("   Scores:")
    for name, score in scores.items():
        print(f"   - {name}: {score:.1f}")
    
    # Calculate bias delta
    print("\n4. Calculating Bias Delta...")
    bias_delta = calculate_bias_delta(scores)
    print(f"   Bias Delta: {bias_delta:.1f}")
    print(f"   Threshold: {BIAS_THRESHOLD}")
    print(f"   Bias Detected: {bias_delta > BIAS_THRESHOLD}")
    
    # Apply correction
    print("\n5. Applying Bias Correction...")
    original_score = scores.get(candidate_profile['name'], 62.0)
    corrected_score = apply_bias_correction(original_score, scores)
    print(f"   Original Score: {original_score:.1f}")
    print(f"   Corrected Score: {corrected_score:.1f}")
    print(f"   Adjustment: {corrected_score - original_score:+.1f}")
    
    print("\n" + "=" * 60)
    print("Test Complete!")
    print("=" * 60)

if __name__ == "__main__":
    test_counterfactual_agent()
