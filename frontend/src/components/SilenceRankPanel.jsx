import { useState } from 'react';
import { runSilenceRank } from '../api/silenceRankApi';

export default function SilenceRankPanel({
  jobDescriptions = [],
  applications = [],
  dummyResultsByJD = null
}) {
  const [selectedJD, setSelectedJD] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const isDummyMode = Boolean(dummyResultsByJD);

  const handleRunAnalysis = async () => {
    if (!selectedJD) {
      setError('Please select a job description');
      return;
    }

    if (isDummyMode) {
      setError('');
      setExpandedRow(null);
      setResults(dummyResultsByJD[selectedJD] || []);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const appIds = applications.map(app => app.id);
      if (appIds.length === 0) {
        setError('No applications found for analysis');
        setLoading(false);
        return;
      }

      const response = await runSilenceRank(selectedJD, appIds);
      setResults(response.results || []);
    } catch (err) {
      setError('Analysis failed. Please ensure resumes are uploaded for selected candidates.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (lirScore) => {
    if (lirScore > 0.15) {
      return { text: 'Bias Detected', background: 'rgba(239, 68, 68, 0.18)', color: '#FCA5A5', icon: '⚠️' };
    }
    return { text: 'Fair', background: 'rgba(34, 197, 94, 0.2)', color: '#86EFAC', icon: '✓' };
  };

  const getLIRColor = (lirScore) => {
    if (lirScore > 0.15) return 'text-red-400';
    if (lirScore >= 0.05) return 'text-yellow-400';
    return 'text-green-400';
  };

  const biasCount = results.filter(r => r.lir_score > 0.15).length;
  const avgLIR = results.length > 0 
    ? (results.reduce((sum, r) => sum + r.lir_score, 0) / results.length).toFixed(3)
    : 0;

  return (
    <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>SilenceRank AI Analysis</h2>
      {isDummyMode && (
        <p style={{ marginTop: '-12px', marginBottom: '16px', fontSize: '0.85rem', color: '#B8A9D9' }}>
          Demo mode is active. Update dummy values in frontend/src/config/silenceRankDummyData.js.
        </p>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <select
          value={selectedJD}
          onChange={(e) => setSelectedJD(e.target.value)}
          style={{
            padding: '10px 16px',
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: 'white',
            flex: 1,
            minWidth: '200px'
          }}
        >
          <option value="">Select Job Description</option>
          {jobDescriptions.map(jd => (
            <option key={jd.id} value={jd.id}>{jd.title || jd.id}</option>
          ))}
        </select>

        <button
          onClick={handleRunAnalysis}
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: loading ? 'rgba(123, 47, 255, 0.5)' : 'linear-gradient(135deg, #7B2FFF, #E91E8C)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loading && <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>}
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#FCA5A5', marginBottom: '20px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>Candidate</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>Skills Matched</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>SilenceRank</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>Language Rank</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>LIR Score</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => {
                  const status = getStatusBadge(result.lir_score);
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer' }} onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}>
                      <td style={{ padding: '12px' }}>{result.blind_id || `Candidate ${idx + 1}`}</td>
                      <td style={{ padding: '12px' }}>{(result.skill_similarity * 100).toFixed(1)}%</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ background: 'rgba(123, 47, 255, 0.2)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem' }}>
                          #{result.silence_rank}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>#{result.language_rank}</td>
                      <td style={{ padding: '12px', fontWeight: 600, className: getLIRColor(result.lir_score) }}>
                        <span style={{ color: getLIRColor(result.lir_score) }}>
                          {result.lir_score > 0.15 && '⚠️ '}
                          {result.lir_score >= 0.05 && result.lir_score <= 0.15 && '◐ '}
                          {result.lir_score < 0.05 && '✓ '}
                          {result.lir_score.toFixed(3)}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', background: status.background, color: status.color }}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p style={{ fontSize: '0.85rem', color: '#B8A9D9', marginBottom: '8px' }}>Total Candidates</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{results.length}</p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p style={{ fontSize: '0.85rem', color: '#B8A9D9', marginBottom: '8px' }}>Bias Flags Raised</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FCA5A5' }}>{biasCount}</p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p style={{ fontSize: '0.85rem', color: '#B8A9D9', marginBottom: '8px' }}>Average LIR Score</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{avgLIR}</p>
            </div>
          </div>

          {/* Expanded Comparison */}
          {expandedRow !== null && results[expandedRow] && (
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Skill Comparison - {results[expandedRow].blind_id}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#7B2FFF' }}>SilenceRank View (Stripped)</p>
                  <div style={{ fontSize: '0.85rem', color: '#B8A9D9', lineHeight: '1.6' }}>
                    {results[expandedRow].silence_skills?.length > 0 
                      ? results[expandedRow].silence_skills.join(', ')
                      : 'No skills detected'}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#E91E8C' }}>Language View (Full Resume)</p>
                  <div style={{ fontSize: '0.85rem', color: '#B8A9D9', lineHeight: '1.6' }}>
                    {results[expandedRow].language_skills?.length > 0 
                      ? results[expandedRow].language_skills.join(', ')
                      : 'No skills detected'}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#FCA5A5', marginTop: '12px' }}>
                Reason: {results[expandedRow].shift_reason}
              </p>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
