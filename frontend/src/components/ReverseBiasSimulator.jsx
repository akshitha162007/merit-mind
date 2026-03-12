import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, BarChart2, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LineChart, Line, ReferenceLine } from 'recharts';
import axios from 'axios';

export default function ReverseBiasSimulator() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [profileCount, setProfileCount] = useState(100);
  const [selectedAxes, setSelectedAxes] = useState(['gender', 'college_tier', 'career_gap', 'region', 'age']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [pipelineData, setPipelineData] = useState(null);
  const [candLoading, setCandLoading] = useState(true);
  const [candError, setCandError] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8000/api/fairness/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
    }
  }, [token]);

  useEffect(() => {
    if (!results || historyLoaded) return;
    axios.get(`http://localhost:8000/api/simulator/history?jd_id=${selectedJobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => {
      setHistory(r.data);
      setHistoryLoaded(true);
    })
    .catch(() => {});
  }, [results, historyLoaded, selectedJobId, token]);

  useEffect(() => {
    if (role !== 'candidate') return;
    axios.get('http://localhost:8000/api/simulator/my-pipeline-status', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => {
      setPipelineData(r.data);
      setCandLoading(false);
    })
    .catch(err => {
      setCandError(err.response?.status === 404 ? 'not-found' : 'failed');
      setCandLoading(false);
    });
  }, [role, token]);

  if (role === 'candidate') {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .skeleton {
            background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
            background-size: 1000px 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 12px;
          }
          .gradient-text {
            background: linear-gradient(135deg, #7B2FFF 0%, #E91E8C 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px', background: '#0D0B1E', minHeight: '100vh' }}>
          {candLoading && (
            <>
              <div className="skeleton" style={{ height: '100px', marginBottom: '20px' }}></div>
              <div className="skeleton" style={{ height: '80px', marginBottom: '20px' }}></div>
              <div className="skeleton" style={{ height: '160px', marginBottom: '20px' }}></div>
            </>
          )}

          {candError === 'not-found' && (
            <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
              <Shield size={48} color="rgba(123,47,255,0.4)" style={{ display: 'block', margin: '0 auto 16px' }} />
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '12px' }}>No Pipeline Report Yet</h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#B8A9D9' }}>Apply to a role to see your pipeline fairness report here.</p>
            </div>
          )}

          {pipelineData && (
            <>
              {/* Card 1 - Header */}
              <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '20px', borderTop: '2px solid #E91E8C' }}>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, color: 'white', margin: '0 0 10px' }}>Pipeline Fairness Report</h1>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#B8A9D9', lineHeight: 1.7 }}>The hiring pipeline for {pipelineData.job_title} was pre-tested for bias before your application was accepted.</p>
                {pipelineData.was_tested ? (
                  <span style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.3)', color: '#00C864', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', padding: '6px 14px', borderRadius: '20px', display: 'inline-block', marginTop: '12px' }}>Pre-Deployment Tested</span>
                ) : (
                  <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#B8A9D9', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', padding: '6px 14px', borderRadius: '20px', display: 'inline-block', marginTop: '12px' }}>Testing Pending</span>
                )}
              </div>

              {/* Card 2 - BRS Result */}
              <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '20px', display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', textTransform: 'uppercase', color: '#B8A9D9', letterSpacing: '1px', marginBottom: '8px' }}>Pipeline Bias Risk Score</div>
                  <div className="gradient-text" style={{ fontFamily: 'Syne, sans-serif', fontSize: '56px', fontWeight: 800 }}>{pipelineData.bias_risk_score}</div>
                  {(() => {
                    const brsColor = pipelineData.bias_risk_score <= 20 ? '#00C864' : pipelineData.bias_risk_score <= 50 ? '#FFAA00' : pipelineData.bias_risk_score <= 80 ? '#FF6B00' : '#E91E8C';
                    return (
                      <span style={{ padding: '6px 16px', borderRadius: '20px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, background: `${brsColor}26`, color: brsColor, display: 'inline-block', marginTop: '8px' }}>{pipelineData.risk_level.toUpperCase()}</span>
                    );
                  })()}
                </div>
                <div>
                  <div style={{ width: '16px', height: '140px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', borderRadius: '8px', background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)', height: `${pipelineData.bias_risk_score}%`, transition: 'height 1s ease' }}></div>
                  </div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#B8A9D9', textAlign: 'center', marginTop: '8px' }}>Risk</div>
                </div>
              </div>

              {/* Card 3 - Application Journey */}
              <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>Your Application Journey</h3>
                {(() => {
                  const steps = ['Applied', 'Resume Review', 'Skill Assessment', 'Final Decision'];
                  const stageMap = { 'pending': 0, 'reviewing': 1, 'assessed': 2, 'decided': 3 };
                  const activeIndex = stageMap[pipelineData.current_stage] ?? 0;
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {steps.map((step, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', flex: index < steps.length - 1 ? 1 : 'initial' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, background: index <= activeIndex ? 'linear-gradient(135deg, #7B2FFF, #E91E8C)' : 'rgba(255,255,255,0.08)', color: index <= activeIndex ? 'white' : '#B8A9D9' }}>
                              {index + 1}
                            </div>
                            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: index <= activeIndex ? 'white' : '#B8A9D9' }}>{step}</div>
                          </div>
                          {index < steps.length - 1 && (
                            <div style={{ flex: 1, height: '2px', margin: '0 8px', marginBottom: '20px', background: index < activeIndex ? 'linear-gradient(135deg, #7B2FFF, #E91E8C)' : 'rgba(255,255,255,0.08)' }}></div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Card 4 - What Was Tested */}
              <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>What Was Tested Before You Applied</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#B8A9D9', lineHeight: 1.7, marginBottom: '16px' }}>{pipelineData.profiles_tested} synthetic candidate profiles were run through this pipeline to detect bias before going live. The following demographic dimensions were stress-tested:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {pipelineData.tested_axes.map((axis, i) => (
                    <span key={i} style={{ border: '1px solid rgba(123,47,255,0.4)', background: 'rgba(123,47,255,0.1)', borderRadius: '20px', padding: '6px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'white' }}>{axis}</span>
                  ))}
                </div>
              </div>

              {/* Card 5 - Fairness Assurance */}
              <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Shield size={20} color="#00C864" />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'white' }}>Bias Pre-Tested Pipeline</span>
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#B8A9D9', lineHeight: 1.7 }}>Your application was evaluated through a pipeline that passed a synthetic stress test before accepting any real applications. This process checks for systematic disadvantages based on demographic attributes — not individual scores.</p>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  if (role !== 'recruiter') return null;

  const handleRunSimulation = () => {
    if (!selectedJobId) {
      setError('Please select a job role before running.');
      return;
    }
    setError('');
    setResults(null);
    setLoading(true);
    
    axios.post('http://localhost:8000/api/simulator/run', {
      jd_id: selectedJobId,
      profile_count: profileCount,
      axes: selectedAxes
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setResults(res.data);
      setLoading(false);
      setTimeout(() => document.getElementById('rbs-results')?.scrollIntoView({ behavior: 'smooth' }), 150);
    })
    .catch(err => {
      setError(err.response?.data?.detail || 'Simulation failed.');
      setLoading(false);
    });
  };

  const toggleAxis = (axisKey) => {
    if (selectedAxes.includes(axisKey) && selectedAxes.length > 1) {
      setSelectedAxes(prev => prev.filter(a => a !== axisKey));
    } else if (!selectedAxes.includes(axisKey)) {
      setSelectedAxes(prev => [...prev, axisKey]);
    }
  };

  const riskLegend = [
    { color: '#00C864', label: 'Low Risk (0–20)' },
    { color: '#FFAA00', label: 'Medium (21–50)' },
    { color: '#FF6B00', label: 'High (51–80)' },
    { color: '#E91E8C', label: 'Critical (81–100)' }
  ];

  const axesOptions = [
    { key: 'gender', label: 'Gender' },
    { key: 'college_tier', label: 'College Tier' },
    { key: 'career_gap', label: 'Career Gap' },
    { key: 'region', label: 'Region' },
    { key: 'age', label: 'Age' }
  ];

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 1000px 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #7B2FFF 0%, #E91E8C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .result-appear {
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ padding: '32px', background: '#0D0B1E', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: 'white', margin: 0 }}>
              Reverse Bias Simulator
            </h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#B8A9D9', lineHeight: 1.6, marginTop: '8px' }}>
              Stress-test your hiring pipeline on synthetic profiles before a single real applicant is affected.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {riskLegend.map(item => (
              <div key={item.color} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#B8A9D9' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Card */}
        <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: 'white', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '20px', margin: 0 }}>
            Simulation Configuration
          </h3>

          {/* Job Selector */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#B8A9D9', marginBottom: '8px' }}>
              TARGET JOB ROLE
            </div>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', padding: '12px 16px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}
            >
              <option value="" disabled>— Select a job role —</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>

          {/* Profile Count */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#B8A9D9', marginBottom: '8px' }}>
              SYNTHETIC PROFILES TO GENERATE
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[50, 100, 200].map(n => (
                <button
                  key={n}
                  onClick={() => setProfileCount(n)}
                  style={{
                    background: profileCount === n ? 'linear-gradient(135deg, #7B2FFF, #E91E8C)' : 'rgba(255,255,255,0.05)',
                    color: profileCount === n ? 'white' : '#B8A9D9',
                    border: profileCount === n ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px'
                  }}
                >
                  {n} Profiles
                </button>
              ))}
            </div>
          </div>

          {/* Axes Selection */}
          <div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#B8A9D9', marginBottom: '8px' }}>
              DEMOGRAPHIC AXES TO TEST
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {axesOptions.map(axis => (
                <div
                  key={axis.key}
                  onClick={() => toggleAxis(axis.key)}
                  style={{
                    background: selectedAxes.includes(axis.key) ? 'rgba(123,47,255,0.15)' : 'rgba(255,255,255,0.04)',
                    border: selectedAxes.includes(axis.key) ? '1px solid rgba(123,47,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    color: selectedAxes.includes(axis.key) ? 'white' : '#B8A9D9',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px'
                  }}
                >
                  {axis.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Run Button */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleRunSimulation}
            disabled={loading}
            style={{
              width: '100%',
              height: '52px',
              background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontFamily: 'Syne, sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Running Simulation...' : 'Run Bias Simulation'}
          </button>
          {error && (
            <div style={{ background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.25)', borderRadius: '10px', padding: '14px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#E91E8C', marginTop: '12px' }}>
              {error}
            </div>
          )}
        </div>

        {/* Skeletons */}
        {loading && (
          <>
            <div className="skeleton" style={{ height: '120px', marginBottom: '20px' }}></div>
            <div className="skeleton" style={{ height: '300px', marginBottom: '20px' }}></div>
            <div className="skeleton" style={{ height: '200px', marginBottom: '20px' }}></div>
          </>
        )}

        {/* Results */}
        {results && !loading && (
          <div id="rbs-results" className="result-appear">
            {/* BRS Gauge Card */}
            <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '24px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: '#B8A9D9', margin: '0 0 24px' }}>Bias Risk Score</h3>
              {(() => {
                const brsColor = results.bias_risk_score <= 20 ? '#00C864' : results.bias_risk_score <= 50 ? '#FFAA00' : results.bias_risk_score <= 80 ? '#FF6B00' : '#E91E8C';
                const arcLength = 251;
                const dashOffset = arcLength - (arcLength * results.bias_risk_score / 100);
                return (
                  <>
                    <svg viewBox="0 0 200 120" style={{ width: '100%', maxWidth: 280, margin: '0 auto', display: 'block' }}>
                      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
                      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={brsColor} strokeWidth="12" strokeLinecap="round" strokeDasharray={arcLength} strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
                    </svg>
                    <div className="gradient-text" style={{ fontFamily: 'Syne, sans-serif', fontSize: '48px', fontWeight: 800, marginTop: '16px' }}>{results.bias_risk_score}</div>
                    <span style={{ padding: '6px 16px', borderRadius: '20px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, background: `${brsColor}26`, color: brsColor, marginTop: '8px', display: 'inline-block' }}>{results.risk_level.toUpperCase()}</span>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#B8A9D9', marginTop: '8px' }}>{results.profiles_tested} synthetic profiles tested</p>
                  </>
                );
              })()}
            </div>

            {/* 4 Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', borderTop: '2px solid #E91E8C' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', textTransform: 'uppercase', color: '#B8A9D9', letterSpacing: '1px' }}>Demographic Parity</div>
                  <Shield size={20} color="#E91E8C" />
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 800, color: 'white', marginTop: '8px' }}>{(results.demographic_parity * 100).toFixed(1)}%</div>
              </div>
              <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', borderTop: '2px solid #7B2FFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', textTransform: 'uppercase', color: '#B8A9D9', letterSpacing: '1px' }}>Disparate Impact Ratio</div>
                  <BarChart2 size={20} color="#7B2FFF" />
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 800, color: 'white', marginTop: '8px' }}>{results.disparate_impact_ratio.toFixed(3)}</div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: results.disparate_impact_ratio >= 0.8 ? '#00C864' : '#E91E8C' }}>{results.disparate_impact_ratio >= 0.8 ? 'Within legal threshold' : 'Below 4/5 rule'}</span>
              </div>
              <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', borderTop: '2px solid #FF6B00' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', textTransform: 'uppercase', color: '#B8A9D9', letterSpacing: '1px' }}>Axes Flagged</div>
                  <AlertTriangle size={20} color="#FF6B00" />
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 800, color: 'white', marginTop: '8px' }}>{results.axes_breakdown.filter(a => a.biased).length} / {results.axes_breakdown.length}</div>
              </div>
              <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', borderTop: '2px solid #00D4FF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', textTransform: 'uppercase', color: '#B8A9D9', letterSpacing: '1px' }}>Profiles Tested</div>
                  <TrendingUp size={20} color="#00D4FF" />
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 800, color: 'white', marginTop: '8px' }}>{results.profiles_tested}</div>
              </div>
            </div>

            {/* Selection Rate Chart */}
            <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: 'white', margin: '0 0 4px' }}>Selection Rate by Demographic Group</h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#B8A9D9', margin: '0 0 20px' }}>Gaps below 65% threshold indicate pipeline bias</p>
              {(() => {
                const chartData = results.axes_breakdown.flatMap(axis => Object.entries(axis.group_rates).map(([group, rate]) => ({ group, rate: parseFloat((rate * 100).toFixed(1)) })));
                return (
                  <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 44)}>
                    <BarChart layout="vertical" data={chartData} margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fill: '#B8A9D9', fontSize: 12, fontFamily: 'DM Sans' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                      <YAxis type="category" dataKey="group" width={110} tick={{ fill: '#B8A9D9', fontSize: 12, fontFamily: 'DM Sans' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                      <Tooltip contentStyle={{ background: 'rgba(13,11,30,0.95)', border: '1px solid rgba(233,30,140,0.3)', borderRadius: 8, fontFamily: 'DM Sans', color: '#fff' }} formatter={v => [`${v}%`, 'Selection Rate']} />
                      <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.rate < 50 ? '#E91E8C' : entry.rate < 65 ? '#FFAA00' : '#00C864'} />
                        ))}
                      </Bar>
                      <ReferenceLine x={65} stroke="rgba(255,255,255,0.4)" strokeDasharray="4 4" label={{ value: 'Threshold', position: 'insideTopRight', fill: '#B8A9D9', fontSize: 11 }} />
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
            </div>

            {/* Recommendations */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Redesign Recommendations</h3>
                <span style={{ background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.2)', color: '#E91E8C', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', borderRadius: '20px', padding: '4px 12px' }}>{results.recommendations.length} issues found</span>
              </div>
              {results.recommendations.map((rec, i) => {
                const severityColor = rec.severity === 'high' ? '#E91E8C' : rec.severity === 'medium' ? '#FFAA00' : '#00C864';
                return (
                  <div key={i} style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '12px', borderLeft: `4px solid ${severityColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, color: 'white' }}>{rec.axis}</span>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: `${severityColor}26`, color: severityColor }}>{rec.severity.toUpperCase()}</span>
                    </div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'white', margin: '8px 0 4px' }}>{rec.finding}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#B8A9D9', margin: 0 }}>{rec.action}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: severityColor, marginTop: '6px' }}>{rec.impact}</p>
                  </div>
                );
              })}
            </div>

            {/* BRS History Chart */}
            <div style={{ background: 'rgba(26,21,53,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: 'white', margin: '0 0 4px' }}>Bias Risk Score History</h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#B8A9D9', margin: '0 0 20px' }}>Track pipeline fairness over time</p>
              {history.length < 2 ? (
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#B8A9D9', textAlign: 'center', padding: '32px 0' }}>Run the simulator multiple times to track your pipeline's fairness trend.</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={history}>
                    <XAxis dataKey="run_at" tickFormatter={v => new Date(v).toLocaleDateString()} tick={{ fill: '#B8A9D9', fontSize: 11, fontFamily: 'DM Sans' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#B8A9D9', fontSize: 11, fontFamily: 'DM Sans' }} />
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <Line dataKey="bias_risk_score" stroke="#E91E8C" strokeWidth={2} dot={{ fill: '#E91E8C', r: 4 }} activeDot={{ r: 6 }} />
                    <Tooltip contentStyle={{ background: 'rgba(13,11,30,0.95)', border: '1px solid rgba(233,30,140,0.3)', borderRadius: 8, fontFamily: 'DM Sans', color: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Export Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
              <button
                onClick={() => {
                  const reportText = `MeritMind — Reverse Bias Simulator Audit Report\n\nDate: ${new Date().toLocaleDateString()}\nJob ID: ${selectedJobId}\nBias Risk Score: ${results.bias_risk_score}\nRisk Level: ${results.risk_level.toUpperCase()}\nProfiles Tested: ${results.profiles_tested}\n\nAxes Breakdown:\n${results.axes_breakdown.map(a => `- ${a.axis}: Disparate Impact Ratio ${a.disparate_impact_ratio.toFixed(3)}, ${a.biased ? 'BIASED' : 'OK'}`).join('\n')}\n\nRecommendations:\n${results.recommendations.map((r, i) => `${i + 1}. [${r.severity.toUpperCase()}] ${r.axis}\n   Finding: ${r.finding}\n   Action: ${r.action}\n   Impact: ${r.impact}`).join('\n\n')}`;
                  const blob = new Blob([reportText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'bias-audit-report.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
              >
                Export Audit Report
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
