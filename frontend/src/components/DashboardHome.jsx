import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getBiasHistory } from '../api/bias';
import { useDashboard } from '../contexts/DashboardContext';

export default function DashboardHome({ user }) {
  const navigate = useNavigate();
  const dashboardContext = useDashboard();
  const refreshTrigger = dashboardContext?.refreshTrigger || 0;
  const [greeting, setGreeting] = useState('');
  const [analysisCount, setAnalysisCount] = useState(0);
  const [rewriteCount, setRewriteCount] = useState(0);
  const [lastBiasScore, setLastBiasScore] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.user_id) return;
      
      try {
        setLoading(true);
        console.log('Fetching history for user:', user.user_id);
        const history = await getBiasHistory(user.user_id);
        console.log('History received:', history);
        
        if (history && history.length > 0) {
          setAnalysisCount(history.length);
          
          const rewriteAnalyses = history.filter(item => item.analysis_type === 'rewrite');
          setRewriteCount(rewriteAnalyses.length);
          console.log('Rewrite count:', rewriteAnalyses.length);
          
          const sortedHistory = [...history].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          
          if (sortedHistory[0]?.bias_score !== undefined) {
            setLastBiasScore(sortedHistory[0].bias_score);
          }
          
          setRecentActivity(sortedHistory.slice(0, 3));
        } else {
          console.log('No history found');
          setAnalysisCount(0);
          setRewriteCount(0);
          setLastBiasScore(null);
          setRecentActivity([]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.user_id, refreshTrigger]);

  const getBiasScoreColor = (score) => {
    if (score >= 70) return '#EF4444';
    if (score >= 40) return '#F59E0B';
    return '#10B981';
  };

  const getBiasScoreLabel = (score) => {
    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MODERATE';
    return 'LOW';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <section style={{ 
      minHeight: '100vh', 
      paddingTop: '80px', 
      padding: '80px 64px 48px',
      background: '#0D0B1E'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* ROW 1 - Welcome Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <p style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 400, marginBottom: '8px' }}>
              {greeting},
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              {user?.name}
            </h1>
            <p style={{ fontSize: '13px', color: '#A78BFA', fontWeight: 500 }}>
              {user?.role === 'recruiter' ? 'Recruiter' : 'Candidate'} Account · SVCE
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Poppins'
              }}
            >
              Analyze a JD
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(124,58,237,0.5)',
                color: '#A78BFA',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Poppins'
              }}
            >
              Rewrite a JD
            </button>
          </div>
        </div>

        {/* ROW 2 - Stats Bar */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '20px 24px'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>
              {loading ? '...' : analysisCount}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              Analyses Run
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '20px 24px'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>
              {loading ? '...' : rewriteCount}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              JDs Rewritten
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '20px 24px'
          }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 800, 
              color: lastBiasScore !== null ? getBiasScoreColor(lastBiasScore) : 'white' 
            }}>
              {loading ? '...' : (lastBiasScore !== null ? lastBiasScore : '—')}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              Last Bias Score
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '20px 24px'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#A78BFA' }}>
              {user?.role === 'recruiter' ? 'Recruiter' : 'Candidate'}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              Account Type
            </div>
          </div>
        </div>

        {/* ROW 3 - Feature Access Cards */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#6B7280',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            YOUR TOOLS
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {/* Bias Detection Card */}
            <div
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(17,24,39,1) 100%)',
                border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: '16px',
                padding: '28px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(17,24,39,1) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(17,24,39,1) 100%)';
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(124,58,237,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginTop: '16px' }}>
                Bias Detection
              </h3>
              <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6, marginTop: '8px' }}>
                Analyze any job description for Indian-specific bias — caste signals, college tier, regional language, and intersectional compound bias.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  color: '#A78BFA',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '999px'
                }}>
                  Indian Bias Taxonomy
                </span>
                <span style={{
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  color: '#A78BFA',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '999px'
                }}>
                  Bias Matrix
                </span>
                <span style={{
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  color: '#A78BFA',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '999px'
                }}>
                  Audit Certificate
                </span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" style={{ position: 'absolute', bottom: '24px', right: '24px' }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>

            {/* JD Rewriter Card */}
            <div
              onClick={() => user?.role === 'recruiter' && navigate('/dashboard')}
              style={{
                background: 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(17,24,39,1) 100%)',
                border: '1px solid rgba(236,72,153,0.2)',
                borderRadius: '16px',
                padding: '28px',
                cursor: user?.role === 'recruiter' ? 'pointer' : 'not-allowed',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (user?.role === 'recruiter') {
                  e.currentTarget.style.borderColor = 'rgba(236,72,153,0.45)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(236,72,153,0.2)';
              }}
            >
              {user?.role !== 'recruiter' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(13,11,30,0.8)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '8px' }}>
                    Available for Recruiters
                  </p>
                </div>
              )}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(236,72,153,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginTop: '16px' }}>
                JD Rewriter
              </h3>
              <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6, marginTop: '8px' }}>
                Rewrite biased job descriptions to attract the demographic your company is failing to hire — with 3 calibrated variants and a measurable Attraction Score.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(236,72,153,0.1)',
                  border: '1px solid rgba(236,72,153,0.2)',
                  color: '#F472B6',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '999px'
                }}>
                  3 Rewrite Variants
                </span>
                <span style={{
                  background: 'rgba(236,72,153,0.1)',
                  border: '1px solid rgba(236,72,153,0.2)',
                  color: '#F472B6',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '999px'
                }}>
                  Attraction Score
                </span>
                <span style={{
                  background: 'rgba(236,72,153,0.1)',
                  border: '1px solid rgba(236,72,153,0.2)',
                  color: '#F472B6',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '999px'
                }}>
                  Demographic Targeting
                </span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" style={{ position: 'absolute', bottom: '24px', right: '24px' }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        {/* ROW 4 - Recent Activity */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#6B7280',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            RECENT ACTIVITY
          </div>
          {loading ? (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '13px', color: '#4B5563' }}>
                Loading...
              </p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '13px', color: '#4B5563' }}>
                No analyses yet. Run your first bias detection above to get started.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => navigate('/dashboard')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: activity.analysis_type === 'rewrite' 
                        ? 'rgba(236,72,153,0.15)' 
                        : 'rgba(124,58,237,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {activity.analysis_type === 'rewrite' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/>
                          <path d="m21 21-4.35-4.35"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
                        {formatDate(activity.created_at)} · {activity.analysis_type === 'rewrite' ? 'JD Rewrite' : 'Bias Detection'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {truncateText(activity.jd_text)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    {activity.bias_score !== undefined && (
                      <>
                        <span style={{
                          background: `${getBiasScoreColor(activity.bias_score)}20`,
                          border: `1px solid ${getBiasScoreColor(activity.bias_score)}40`,
                          color: getBiasScoreColor(activity.bias_score),
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}>
                          {getBiasScoreLabel(activity.bias_score)}
                        </span>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: getBiasScoreColor(activity.bias_score) }}>
                          {activity.bias_score}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
