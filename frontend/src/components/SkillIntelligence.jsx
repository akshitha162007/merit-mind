import { useState } from 'react';
import useAuth from '../hooks/useAuth';

export default function SkillIntelligence({ candidateId, jobId }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const evaluateSkills = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { user } = useAuth();
      const token = user?.token;
      const response = await fetch('http://localhost:8080/api/skills/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ 
          candidate_id: candidateId,
          job_id: jobId 
        })
      });
      
      if (!response.ok) throw new Error('Failed to evaluate skills');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Skill evaluation error:', err);
      // fallback dummy result for demo purposes if backend unavailable
      const dummy = {
        skill_score: 0.78,
        matched_skills: ['Python', 'SQL'],
        skill_details: [
          { job_skill: 'Data Analysis', candidate_skill: 'Business Analytics', similarity: 0.85 },
          { job_skill: 'SQL', candidate_skill: 'SQL', similarity: 1.0 }
        ],
        matched_count: 2,
        total_required: 5
      };
      setResult(dummy);
      // keep the error displayed as well so devs know
      setError('Using fallback data (backend unavailable)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Skill Intelligence
      </h2>
      
      <button
        onClick={evaluateSkills}
        disabled={loading || !candidateId || !jobId}
        className="btn-gradient"
        style={{ marginBottom: '24px' }}
      >
        {loading ? 'Analyzing...' : 'Evaluate Skill Match'}
      </button>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#FCA5A5', marginBottom: '16px' }}>
          Error: {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Skill Match Score */}
          <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.1), rgba(233, 30, 140, 0.1))', borderRadius: '12px', border: '1px solid rgba(123, 47, 255, 0.3)', textAlign: 'center' }}>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '8px' }}>Skill Match Score</p>
            <p style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {(result.skill_score * 100).toFixed(0)}%
            </p>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: '8px' }}>
              {result.matched_count} of {result.total_required} skills matched
            </p>
          </div>

          {/* Matched Skills */}
          <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Matched Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.matched_skills.map((skill, idx) => (
                <span 
                  key={idx}
                  style={{ 
                    padding: '6px 12px', 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    border: '1px solid rgba(16, 185, 129, 0.3)', 
                    borderRadius: '6px', 
                    color: '#10B981',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skill Details */}
          <details style={{ marginTop: '8px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'white', padding: '8px 0' }}>
              View Detailed Skill Mapping
            </summary>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.skill_details.map((detail, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    padding: '16px', 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    borderRadius: '8px',
                    borderLeft: `4px solid ${detail.similarity >= 0.85 ? '#10B981' : detail.similarity >= 0.7 ? '#FBBF24' : '#F59E0B'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#B8A9D9', marginBottom: '4px' }}>Required Skill</p>
                      <p style={{ fontWeight: 700, color: 'white' }}>{detail.job_skill}</p>
                    </div>
                    <div style={{ 
                      padding: '4px 12px', 
                      background: detail.similarity >= 0.85 ? 'rgba(16, 185, 129, 0.2)' : detail.similarity >= 0.7 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      borderRadius: '12px',
                      color: detail.similarity >= 0.85 ? '#10B981' : detail.similarity >= 0.7 ? '#FBBF24' : '#F59E0B',
                      fontWeight: 700,
                      fontSize: '0.875rem'
                    }}>
                      {(detail.similarity * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#7B2FFF', fontSize: '1.25rem' }}>↔</span>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#B8A9D9', marginBottom: '4px' }}>Candidate Skill</p>
                      <p style={{ fontWeight: 600, color: 'white' }}>{detail.candidate_skill}</p>
                    </div>
                  </div>
                  {detail.similarity === 1.0 && (
                    <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#10B981' }}>✓ Exact match</p>
                  )}
                  {detail.similarity === 0.85 && (
                    <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#FBBF24' }}>⚡ 1-hop connection (closely related)</p>
                  )}
                  {detail.similarity === 0.70 && (
                    <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#F59E0B' }}>🔗 2-hop connection (transferable skill)</p>
                  )}
                </div>
              ))}
            </div>
          </details>

          {/* Intelligence Insight */}
          <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
            <p style={{ fontSize: '0.875rem', color: '#93C5FD', lineHeight: '1.6' }}>
              <strong>🧠 Intelligence Insight:</strong> This evaluation uses graph-based skill mapping to identify 
              transferable skills and related competencies beyond exact keyword matches. Skills are connected 
              through a knowledge graph that understands relationships like "Business Analytics ≈ Data Analysis".
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
