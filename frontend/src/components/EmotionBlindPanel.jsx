import { useState, useEffect, useCallback } from 'react';
import { analyzeEmotionBlind, checkEmotionBlindHealth } from '../api/emotionBlindApi';
import { emotionBlindDummyData } from '../config/emotionBlindDummyData';

export default function EmotionBlindPanel({ onBack, dummyData = emotionBlindDummyData }) {
  const fallbackData = dummyData || emotionBlindDummyData;
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [selectedJd, setSelectedJd] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [transcripts, setTranscripts] = useState({});
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDummyMode, setIsDummyMode] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showBanner, setShowBanner] = useState(true);

  const applyDummySeedData = useCallback(() => {
    setJobDescriptions(fallbackData.jobDescriptions || []);
    setSelectedJd(fallbackData.jobDescriptions?.[0]?.id || null);
    setCandidates(fallbackData.candidates || []);
    setTranscripts(fallbackData.transcripts || {});
    setIsDummyMode(true);
  }, [fallbackData]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await checkEmotionBlindHealth();
        applyDummySeedData();
      } catch {
        applyDummySeedData();
      }
    };
    initializeData();
  }, [applyDummySeedData]);

  const handleRunAnalysis = async () => {
    if (!selectedJd) {
      setError('Please select a job description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isDummyMode) {
        setExpandedRow(null);
        setResults(fallbackData.analysisResultsByJD?.[selectedJd] || []);
        return;
      }

      const candidatesData = candidates.map(c => ({
        application_id: c.id,
        transcript: transcripts[c.id] || ''
      }));

      const response = await analyzeEmotionBlind(selectedJd, candidatesData);
      const backendResults = response.results || [];
      if (backendResults.length === 0) {
        setIsDummyMode(true);
        setResults(fallbackData.analysisResultsByJD?.[selectedJd] || []);
      } else {
        setResults(backendResults);
      }
    } catch {
      setIsDummyMode(true);
      setError('Backend unavailable or empty. Showing demo values.');
      setResults(fallbackData.analysisResultsByJD?.[selectedJd] || []);
    } finally {
      setIsLoading(false);
    }
  };

  const getGapColor = (gapScore) => {
    if (gapScore > 0.20) return 'text-red-400';
    if (gapScore >= 0.10) return 'text-yellow-400';
    return 'text-green-400';
  };

  const biasCount = results.filter(r => r.bias_flagged).length;
  const avgGap = results.length > 0 
    ? (results.reduce((sum, r) => sum + r.gap_score, 0) / results.length).toFixed(4)
    : 0;

  const CircularProgress = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score * circumference);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={score > 0.7 ? '#10B981' : score > 0.4 ? '#F59E0B' : '#EF4444'}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{(score * 100).toFixed(1)}%</p>
          <p style={{ fontSize: '0.85rem', color: '#B8A9D9' }}>{label}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div style={{ marginBottom: '24px' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{ color: '#B8A9D9', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '16px' }}
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {showBanner && isDummyMode && (
        <div style={{ padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#FCD34D', fontSize: '0.9rem' }}>Demo Mode — Using sample data. Connect your database to analyze real candidates.</p>
          <button
            onClick={() => setShowBanner(false)}
            style={{ background: 'none', border: 'none', color: '#FCD34D', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ×
          </button>
        </div>
      )}

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>EmotionBlind AI Analysis</h2>
      <p style={{ color: '#B8A9D9', marginBottom: '24px', fontSize: '0.95rem' }}>Evaluate candidates on semantic reasoning quality, free from emotional bias</p>

      <div style={{ marginBottom: '24px' }}>
        <select
          value={selectedJd || ''}
          onChange={(e) => setSelectedJd(e.target.value)}
          style={{
            padding: '10px 16px',
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: 'white',
            width: '100%',
            marginBottom: '20px'
          }}
        >
          <option value="">Select Job Description</option>
          {jobDescriptions.map(jd => (
            <option key={jd.id} value={jd.id}>{jd.title} — {jd.company}</option>
          ))}
        </select>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {candidates.map(candidate => (
            <div key={candidate.id} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#B8A9D9' }}>
                {candidate.blind_id}
              </label>
              <textarea
                value={transcripts[candidate.id] || ''}
                onChange={(e) => setTranscripts(prev => ({ ...prev, [candidate.id]: e.target.value }))}
                placeholder="Enter interview response transcript"
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: 'white',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            background: isLoading ? 'rgba(123, 47, 255, 0.5)' : 'linear-gradient(135deg, #7B2FFF, #E91E8C)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%'
          }}
        >
          {isLoading && <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>}
          {isLoading ? 'Analyzing...' : 'Run EmotionBlind Analysis'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#FCA5A5', marginBottom: '20px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>Candidate</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>Emotional Score</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>Semantic Score</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>Gap Score</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>Bias Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, color: '#B8A9D9' }}>Fair Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer' }}
                    onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                  >
                    <td style={{ padding: '12px' }}>{result.blind_id}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${result.emotional_score * 100}%`, height: '100%', background: '#F59E0B' }}></div>
                        </div>
                        <span>{(result.emotional_score * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${result.semantic_score * 100}%`, height: '100%', background: '#7B2FFF' }}></div>
                        </div>
                        <span>{(result.semantic_score * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      <span style={{ color: getGapColor(result.gap_score) }}>
                        {result.gap_score.toFixed(4)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', background: result.bias_flagged ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: result.bias_flagged ? '#FCA5A5' : '#86EFAC' }}>
                        {result.bias_flagged ? 'Bias Detected' : 'Fair'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700, fontSize: '1.1rem' }}>
                      {(result.semantic_score * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p style={{ fontSize: '0.85rem', color: '#B8A9D9', marginBottom: '8px' }}>Candidates Analyzed</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{results.length}</p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p style={{ fontSize: '0.85rem', color: '#B8A9D9', marginBottom: '8px' }}>Bias Flags Raised</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FCA5A5' }}>{biasCount}</p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p style={{ fontSize: '0.85rem', color: '#B8A9D9', marginBottom: '8px' }}>Average Gap Score</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{avgGap}</p>
            </div>
          </div>

          {expandedRow !== null && results[expandedRow] && (
            <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Evaluation Comparison — {results[expandedRow].blind_id}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px', color: '#F59E0B' }}>Emotional Evaluation</p>
                  <CircularProgress score={results[expandedRow].emotional_score} label="VADER Sentiment Score" />
                  <p style={{ fontSize: '0.85rem', color: '#B8A9D9', marginTop: '12px', textAlign: 'center' }}>This score reflects tone, confidence, and enthusiasm</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px', color: '#7B2FFF' }}>Semantic Evaluation (Fair)</p>
                  <CircularProgress score={results[expandedRow].semantic_score} label="GPT-4 Reasoning Score" />
                  <p style={{ fontSize: '0.85rem', color: '#B8A9D9', marginTop: '12px', textAlign: 'center' }}>Recommended for hiring decisions</p>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#B8A9D9' }}>Interview Response Analyzed</p>
                <div style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#B8A9D9', lineHeight: '1.6', maxHeight: '200px', overflowY: 'auto' }}>
                  {results[expandedRow].transcript}
                </div>
              </div>
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
