import { useState, useEffect } from 'react';
import { Shield, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function FairnessOptimizerPanel() {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [constraints, setConstraints] = useState({ gender: 20, caste: 20, region: 20, age: 20, college_tier: 20 });
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [candidateReport, setCandidateReport] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    if (userRole === 'recruiter') {
      fetchJobs();
    } else if (userRole === 'candidate') {
      fetchCandidateReport();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/fairness/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
      if (res.data.length > 0) setSelectedJob(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCandidateReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/fairness/my-report', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidateReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8000/api/fairness/optimize', {
        jd_id: selectedJob,
        constraints
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8000/api/fairness/history?jd_id=${selectedJob}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    if (!results) return;
    const csv = [
      ['Candidate', 'Original Rank', 'Optimized Rank', 'Merit Score', 'Fairness Adjustment'],
      ...results.optimized_candidates.map(c => [
        `Candidate ${c.candidate_number}`,
        c.original_rank,
        c.optimized_rank,
        c.merit_score,
        c.fairness_adjustment
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fairness_optimization.csv';
    a.click();
  };

  const constraintSum = Object.values(constraints).reduce((a, b) => a + b, 0);

  if (role === 'candidate') {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid rgba(233,30,140,0.3)', borderTop: '4px solid #E91E8C', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : candidateReport ? (
          <>
            <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Fairness Report</h2>
              <p style={{ color: '#B8A9D9', fontSize: '14px' }}>AI-powered fairness evaluation with full transparency</p>
            </div>

            <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <p style={{ color: '#B8A9D9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Score Breakdown</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <p style={{ color: '#B8A9D9', fontSize: '12px', marginBottom: '4px' }}>Merit Score</p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{candidateReport.merit_score}</p>
                </div>
                <div>
                  <p style={{ color: '#B8A9D9', fontSize: '12px', marginBottom: '4px' }}>Adjustment</p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: '#00D4FF' }}>+{candidateReport.fairness_adjustment}</p>
                </div>
                <div>
                  <p style={{ color: '#B8A9D9', fontSize: '12px', marginBottom: '4px' }}>Final Score</p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{candidateReport.final_score}</p>
                </div>
              </div>
              <div style={{ background: 'rgba(123,47,255,0.1)', border: '1px solid rgba(123,47,255,0.3)', borderRadius: '8px', padding: '12px' }}>
                <p style={{ color: '#B8A9D9', fontSize: '13px' }}>
                  <span style={{ color: 'white', fontWeight: 600 }}>Formula:</span> Final = Merit × Adaptive Weight + Fairness Adjustment
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <p style={{ color: '#B8A9D9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Rank Percentile</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${candidateReport.rank_percentile}%`, height: '100%', background: 'linear-gradient(90deg, #7B2FFF, #E91E8C)' }}></div>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{candidateReport.rank_percentile}%</p>
              </div>
            </div>

            <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <p style={{ color: '#B8A9D9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Active Fairness Axes</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {candidateReport.active_axes.map(axis => (
                  <span key={axis} style={{ padding: '8px 16px', background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.3)', borderRadius: '20px', color: '#E91E8C', fontSize: '13px', fontWeight: 600 }}>{axis}</span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Shield size={24} color="#00D4FF" />
                <p style={{ color: '#B8A9D9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trust Indicator</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${candidateReport.fairness_confidence}%`, height: '100%', background: '#00D4FF' }}></div>
                </div>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00D4FF' }}>{candidateReport.fairness_confidence}%</p>
              </div>
            </div>
          </>
        ) : (
          <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <p style={{ color: '#B8A9D9' }}>No report available</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fairness Optimizer</h2>
          <p style={{ color: '#B8A9D9', fontSize: '14px' }}>Dynamic constraint-based fairness optimization</p>
        </div>
        <select style={{ padding: '10px 16px', background: 'rgba(26,21,53,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: 600 }} onChange={(e) => {
          const presets = {
            eeoc: { gender: 25, caste: 25, region: 15, age: 20, college_tier: 15 },
            diversity: { gender: 30, caste: 30, region: 20, age: 10, college_tier: 10 },
            merit: { gender: 15, caste: 15, region: 15, age: 15, college_tier: 40 }
          };
          if (e.target.value && presets[e.target.value]) setConstraints(presets[e.target.value]);
        }}>
          <option value="">Select Preset</option>
          <option value="eeoc">EEOC Compliant</option>
          <option value="diversity">Maximum Diversity</option>
          <option value="merit">Merit-First Balanced</option>
        </select>
      </div>

      <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
        <label style={{ display: 'block', color: '#B8A9D9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Select Job</label>
        <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(13,11,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'white', fontSize: '14px' }}>
          {jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
        </select>
      </div>

      <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
        <p style={{ color: '#B8A9D9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>Fairness Constraints</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {Object.entries(constraints).map(([key, value]) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ color: 'white', fontSize: '14px', fontWeight: 600, textTransform: 'capitalize' }}>{key.replace('_', ' ')}</label>
                <span style={{ color: '#E91E8C', fontSize: '14px', fontWeight: 700 }}>{value}%</span>
              </div>
              <input type="range" min="0" max="50" value={value} onChange={(e) => setConstraints({ ...constraints, [key]: parseInt(e.target.value) })} style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', outline: 'none', appearance: 'none', WebkitAppearance: 'none' }} />
            </div>
          ))}
        </div>
        {constraintSum > 150 && (
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.3)', borderRadius: '8px' }}>
            <p style={{ color: '#E91E8C', fontSize: '13px' }}>Warning: Total constraints exceed 150% ({constraintSum}%)</p>
          </div>
        )}
      </div>

      <button onClick={handleOptimize} disabled={loading || !selectedJob} style={{ width: '100%', padding: '16px', background: loading ? 'rgba(123,47,255,0.3)' : 'linear-gradient(135deg, #7B2FFF, #E91E8C)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {loading ? 'Optimizing...' : 'Run Optimization'}
      </button>

      {results && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Shortlist Count', value: results.shortlist_count, color: '#7B2FFF' },
              { label: 'Fairness Score', value: `${results.fairness_score}%`, color: '#E91E8C' },
              { label: 'Diversity Index', value: results.diversity_index, color: '#00D4FF' },
              { label: 'Merit Delta', value: results.fairness_roi.merit_delta, color: '#B8A9D9' }
            ].map(stat => (
              <div key={stat.label} style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                <p style={{ color: '#B8A9D9', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{stat.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ color: '#B8A9D9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rank Comparison</p>
              <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(123,47,255,0.2)', border: '1px solid rgba(123,47,255,0.4)', borderRadius: '8px', color: '#7B2FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                <Download size={16} /> Export CSV
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Candidate', 'Original Rank', 'Optimized Rank', 'Merit Score', 'Adjustment'].map(h => (
                      <th key={h} style={{ padding: '12px', textAlign: 'left', color: '#B8A9D9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.optimized_candidates.map(c => (
                    <tr key={c.candidate_number} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', color: 'white', fontSize: '14px' }}>Candidate {c.candidate_number}</td>
                      <td style={{ padding: '12px', color: 'white', fontSize: '14px' }}>{c.original_rank}</td>
                      <td style={{ padding: '12px', color: '#E91E8C', fontSize: '14px', fontWeight: 700 }}>{c.optimized_rank}</td>
                      <td style={{ padding: '12px', color: 'white', fontSize: '14px' }}>{c.merit_score}</td>
                      <td style={{ padding: '12px', color: '#00D4FF', fontSize: '14px' }}>+{c.fairness_adjustment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
            <p style={{ color: '#B8A9D9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Demographic Breakdown</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.demographic_breakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="axis" stroke="#B8A9D9" style={{ fontSize: '12px' }} />
                <YAxis stroke="#B8A9D9" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ background: 'rgba(26,21,53,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'white' }} />
                <Legend wrapperStyle={{ color: '#B8A9D9', fontSize: '12px' }} />
                <Bar dataKey="before" fill="#7B2FFF" name="Before" />
                <Bar dataKey="after" fill="#E91E8C" name="After" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <div onClick={() => { setHistoryOpen(!historyOpen); if (!historyOpen && history.length === 0) fetchHistory(); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <p style={{ color: '#B8A9D9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Optimization History</p>
              {historyOpen ? <ChevronUp size={20} color="#B8A9D9" /> : <ChevronDown size={20} color="#B8A9D9" />}
            </div>
            {historyOpen && (
              <div style={{ marginTop: '16px' }}>
                {history.length > 0 ? history.map((h, i) => (
                  <div key={i} style={{ padding: '12px', background: 'rgba(13,11,30,0.5)', borderRadius: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ color: 'white', fontSize: '14px' }}>{h.job_title}</p>
                      <p style={{ color: '#E91E8C', fontSize: '14px', fontWeight: 700 }}>{h.fairness_score}%</p>
                    </div>
                    <p style={{ color: '#B8A9D9', fontSize: '12px', marginTop: '4px' }}>{new Date(h.run_at).toLocaleString()}</p>
                  </div>
                )) : <p style={{ color: '#B8A9D9', fontSize: '14px' }}>No history available</p>}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
