const API_BASE_URL = 'http://localhost:8000';

export const fairnessAPI = {
  checkFairness: async (candidateId) => {
    const response = await fetch(`${API_BASE_URL}/api/fairness/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate_id: candidateId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to check fairness');
    }
    
    return response.json();
  }
};
