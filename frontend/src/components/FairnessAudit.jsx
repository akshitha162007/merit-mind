import { useState } from 'react';

export default function FairnessAudit({ candidateId }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const checkFairness = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/fairness/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId })
      });
      
      if (!response.ok) throw new Error('Failed to check fairness');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fairness Audit</h2>
      
      <button
        onClick={checkFairness}
        disabled={loading}
        className="btn-gradient"
        style={{ marginBottom: '24px' }}
      >
        {loading ? 'Checking...' : 'Run Fairness Check'}
      </button>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#FCA5A5', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <p className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>Original Score</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{result.original_score.toFixed(1)}</p>
            </div>
            
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <p className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>Bias Corrected Score</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>{result.corrected_score.toFixed(1)}</p>
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '8px', background: result.bias_detected ? 'rgba(251, 191, 36, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: result.bias_detected ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>Bias Detected</p>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                  {result.bias_detected ? 'Yes' : 'No'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>Bias Delta</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: result.bias_detected ? '#FBBF24' : '#10B981' }}>{result.bias_delta.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {result.bias_detected && (
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
              <p style={{ fontSize: '0.875rem', color: '#93C5FD', lineHeight: '1.6' }}>
                <strong>ℹ️ Explanation:</strong> This score was adjusted because counterfactual identity testing 
                detected possible bias in the evaluation model. The system generated identity variants 
                with identical qualifications and found score variations exceeding the fairness threshold.
              </p>
            </div>
          )}

          <details style={{ marginTop: '16px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'white', padding: '8px 0' }}>
              View Variant Scores
            </summary>
            <div style={{ marginTop: '8px', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
              {Object.entries(result.variant_scores).map(([name, score]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
                  <span style={{ color: '#B8A9D9' }}>{name}</span>
                  <span style={{ fontWeight: 700, color: 'white' }}>{score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
