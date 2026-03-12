from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import openai
import os

analyzer = SentimentIntensityAnalyzer()

def compute_emotional_score(transcript: str) -> float:
    """Compute emotional score using VADER sentiment analysis."""
    if not transcript:
        return 0.0
    
    scores = analyzer.polarity_scores(transcript)
    compound = scores['compound']
    normalized = (compound + 1) / 2
    return round(normalized, 4)

def compute_semantic_score(transcript: str, jd_text: str) -> float:
    """Compute semantic score using GPT-4 API."""
    if not transcript or not jd_text:
        return 0.0
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        fallback_score = min(len(set(transcript.lower().split())) / 100, 1.0)
        return round(fallback_score, 4)
    
    try:
        client = openai.OpenAI(api_key=api_key)
        
        system_prompt = """You are an expert hiring evaluator. Evaluate the following interview
response ONLY on semantic content — reasoning depth, answer relevance
to the job description, and logical coherence. Completely ignore tone,
confidence, enthusiasm, and emotional language. Return ONLY a single
float number between 0.0 and 1.0 representing the semantic quality score.
No explanation, just the number."""
        
        user_message = f"Job Description: {jd_text}\n\nInterview Response: {transcript}"
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3,
            max_tokens=10
        )
        
        score_text = response.choices[0].message.content.strip()
        score = float(score_text)
        score = max(0.0, min(1.0, score))
        return round(score, 4)
    
    except Exception as e:
        fallback_score = min(len(set(transcript.lower().split())) / 100, 1.0)
        return round(fallback_score, 4)

def run_emotion_blind_analysis(candidates_data: list) -> list:
    """Run EmotionBlind analysis on candidates."""
    if not candidates_data:
        return []
    
    results = []
    
    for candidate in candidates_data:
        transcript = candidate.get("transcript", "")
        jd_text = candidate.get("jd_text", "")
        
        emotional_score = compute_emotional_score(transcript)
        semantic_score = compute_semantic_score(transcript, jd_text)
        
        gap_score = round(abs(semantic_score - emotional_score), 4)
        bias_flagged = gap_score > 0.20
        flag_reason = "Emotional tone is significantly influencing evaluation" if bias_flagged else "Evaluation is semantically consistent"
        
        results.append({
            "application_id": candidate.get("application_id"),
            "blind_id": candidate.get("blind_id"),
            "transcript": transcript,
            "emotional_score": emotional_score,
            "semantic_score": semantic_score,
            "gap_score": gap_score,
            "bias_flagged": bias_flagged,
            "flag_reason": flag_reason
        })
    
    return results
