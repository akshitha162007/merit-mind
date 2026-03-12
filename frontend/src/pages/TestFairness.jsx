import { useState } from 'react';
import useAuth from '../hooks/useAuth';

export default function TestFairness() {
  const { user } = useAuth();
  const token = user?.token;

  const [candidateId, setCandidateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const runTest = async () => {
    if (!candidateId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await fetch('http://localhost:8000/api/fairness/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ candidate_id: candidateId })
      });
      if (!resp.ok) throw new Error('Fairness check failed');
      const data = await resp.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // convenience derived values if result exists
  const candidate = result
    ? { name: result.candidate_id, /* placeholder since backend doesn't send name */ }
    : null;

  const generatedVariants = result ? Object.keys(result.variant_scores).length : 0;
  const scores = result ? result.variant_scores : {};
  const biasDelta = result ? result.bias_delta : 0;
  const threshold = 1.0;
  const biasDetected = biasDelta > threshold;
  const correctedScore = result ? result.corrected_score : 0;

  return (
    <div style={{ color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Counterfactual Fairness Test</h2>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#B8A9D9', marginBottom: '8px' }}>
          Candidate ID
        </label>
        <input
          type="text"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          placeholder="Enter candidate UUID"
          style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '0.875rem' }}
        />
        <button onClick={runTest} disabled={!candidateId || loading} className="btn-gradient" style={{ marginTop: '16px' }}>
          {loading ? 'Running...' : 'Run Fairness Check'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#FCA5A5', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {result && (
        <>
          <section className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3>Candidate Profile</h3>
            <p><strong>ID:</strong> {result.candidate_id}</p>
            {/* other profile fields can be added when backend returns them */}
          </section>

          <section className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3>Generated Variants</h3>
            <p>{generatedVariants} profile variants generated</p>
          </section>

          <section className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3>Scores</h3>
            <ul>
              {Object.entries(scores).map(([name, score]) => (
                <li key={name}>{name}: {score.toFixed(1)}</li>
              ))}
            </ul>
          </section>

          <section className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3>Bias Analysis</h3>
            <p><strong>Bias Delta:</strong> {biasDelta.toFixed(1)}</p>
            <p><strong>Threshold:</strong> {threshold}</p>
            <p><strong>Bias Detected:</strong> {biasDetected ? 'Yes' : 'No'}</p>
          </section>

          <section className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3>Correction</h3>
            <p><strong>Original Score:</strong> {result.original_score.toFixed(1)}</p>
            <p><strong>Corrected Score:</strong> {correctedScore.toFixed(1)}</p>
            <p><strong>Adjustment:</strong> {(correctedScore - result.original_score).toFixed(1)}</p>
          </section>
        </>
      )}
    </div>
  );
}
      