import { useState, useEffect } from 'react';
import BiasMatrix from './BiasMatrix';
import { detectBias, getBiasHistory } from '../../api/bias';
import { useDashboard } from '../../contexts/DashboardContext';

export default function BiasDetector({ user }) {
  const dashboardContext = useDashboard();
  const triggerRefresh = dashboardContext?.triggerRefresh || (() => {});
  console.log('BiasDetector context:', dashboardContext);
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  // Fetch recent analyses on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (user?.user_id) {
          const history = await getBiasHistory(user.user_id);
          setRecentAnalyses(history);
        }
      } catch (error) {
        console.error('Failed to fetch bias history:', error);
        setRecentAnalyses([]);
      }
    };
    
    fetchHistory();
  }, [user]);

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      setError('Please paste a job description before analyzing.');
      return;
    }

    setLoading(true);
    setError('');
    // Clear previous results to avoid showing stale data
    setResults(null);
    
    try {
      const analysisData = {
        jd_text: jdText,
        user_role: user.role,
        user_id: user.user_id
      };
      
      console.log('Sending analysis request:', analysisData); // Debug log
      const result = await detectBias(analysisData);
      console.log('Analysis result received:', result); // Debug log
      setResults(result);
      
      // Trigger dashboard refresh
      triggerRefresh();
      
      // Refresh history after successful analysis
      try {
        const updatedHistory = await getBiasHistory(user.user_id);
        setRecentAnalyses(updatedHistory);
      } catch (historyError) {
        console.error('Failed to refresh history:', historyError);
      }
      
    } catch (err) {
      console.error('Analysis error:', err); // Debug log
      setError(err.message || 'Analysis unavailable. Please check that the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeStyle = (riskLevel) => {
    if (riskLevel === 'HIGH') {
      return {
        backgroundColor: '#FEF2F2',
        color: '#DC2626',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 12px',
        borderRadius: '999px',
        display: 'inline-block'
      };
    } else if (riskLevel === 'MODERATE') {
      return {
        backgroundColor: '#FFFBEB',
        color: '#D97706',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 12px',
        borderRadius: '999px',
        display: 'inline-block'
      };
    } else {
      return {
        backgroundColor: '#F0FDF4',
        color: '#16A34A',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 12px',
        borderRadius: '999px',
        display: 'inline-block'
      };
    }
  };

  const getScoreColor = (score) => {
    if (score > 60) return '#DC2626';
    if (score >= 30) return '#F59E0B';
    return '#16A34A';
  };

  return (
    <div>
      {/* Page Title */}
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: "'Poppins', sans-serif",
        lineHeight: '1.3',
        marginBottom: '6px'
      }}>
        {user.role === 'recruiter' ? 'Job Description Bias Analyzer' : 'Job Posting Transparency Analyzer'}
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '14px',
        fontWeight: '400',
        color: '#B4B4C7',
        fontFamily: "'Poppins', sans-serif",
        lineHeight: '1.6',
        maxWidth: '600px',
        marginBottom: '24px'
      }}>
        {user.role === 'recruiter' 
          ? 'Detect intersectional bias patterns specific to Indian hiring — caste signals, college tier bias, regional discrimination, and compounded intersections.'
          : 'Understand whether a job posting contains bias signals that may be affecting your application.'}
      </p>

      {/* Input Card */}
      <div style={{
        backgroundColor: '#1A1A2E',
        border: '1px solid #2D2D44',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        marginBottom: '16px'
      }}>
        <label style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#FFFFFF',
          fontFamily: "'Poppins', sans-serif",
          display: 'block',
          marginBottom: '8px'
        }}>
          Paste Job Description
        </label>

        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = '#7C3AED';
            e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#D1D5DB';
            e.target.style.boxShadow = 'none';
          }}
          style={{
            width: '100%',
            minHeight: '200px',
            border: '1px solid #2D2D44',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
            fontFamily: "'Poppins', sans-serif",
            color: '#FFFFFF',
            backgroundColor: '#0F0F23',
            lineHeight: '1.6',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          placeholder={user.role === 'recruiter' 
            ? "Paste your job description here..." 
            : "Paste the job description you received..."}
        />

        {error && (
          <div style={{ color: '#DC2626', fontSize: '13px', marginTop: '6px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || !jdText.trim()}
          style={
            (loading || !jdText.trim())
              ? {
                  background: '#D1D5DB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'not-allowed',
                  marginTop: '16px'
                }
              : {
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  marginTop: '16px'
                }
          }
        >
          {loading ? 'Analyzing...' : (user.role === 'recruiter' ? 'Analyze for Bias' : 'Check for Bias Signals')}
        </button>
      </div>

      {/* Results */}
      {results && !loading && (
        <div>
          {/* Card 1 - Bias Detection Report */}
          <div style={{
            backgroundColor: '#1A1A2E',
            border: '1px solid #2D2D44',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#FFFFFF',
                fontFamily: "'Poppins', sans-serif",
                marginBottom: '0'
              }}>
                Bias Detection Report
              </h3>
              <div style={getRiskBadgeStyle(results.risk_level)}>
                {results.risk_level} RISK
              </div>
            </div>

            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: "'Poppins', sans-serif",
              marginBottom: '8px'
            }}>
              Overall Bias Score: {results.overall_score}/100
            </p>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#2D2D44',
              borderRadius: '999px',
              marginTop: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                height: '8px',
                borderRadius: '999px',
                width: results.overall_score + '%',
                backgroundColor: getScoreColor(results.overall_score)
              }} />
            </div>
          </div>

          {/* Card 2 - Bias Matrix */}
          <BiasMatrix biasAxes={results.bias_axes} />

          {/* Card 3 - Compound Intersections */}
          <div style={{
            backgroundColor: '#1A1A2E',
            border: '1px solid #2D2D44',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: "'Poppins', sans-serif",
              marginBottom: '16px'
            }}>
              Compound Intersections Detected
            </h3>

            {results.compound_intersections.map((intersection, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderLeft: '4px solid #DC2626',
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1F1235',
                    fontFamily: "'Poppins', sans-serif",
                    margin: 0
                  }}>
                    {intersection.combination}
                  </h4>
                  <div style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}>
                    Severity {intersection.severity}/10
                  </div>
                </div>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  fontFamily: "'Poppins', sans-serif",
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {intersection.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Card 4 - What This Means */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F1235',
              fontFamily: "'Poppins', sans-serif",
              marginBottom: '16px'
            }}>
              What This Means
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              fontFamily: "'Poppins', sans-serif",
              lineHeight: '1.7',
              margin: 0
            }}>
              {results.plain_explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
