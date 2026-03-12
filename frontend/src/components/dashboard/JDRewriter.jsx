import { useState, useEffect } from 'react';
import AttractionScore from './AttractionScore';
import AuditCertificate from './AuditCertificate';
import { rewriteJD, getBiasHistory } from '../../api/bias';
import { useDashboard } from '../../contexts/DashboardContext';

export default function JDRewriter({ user }) {
  const dashboardContext = useDashboard();
  const triggerRefresh = dashboardContext?.triggerRefresh || (() => {});
  console.log('JDRewriter context:', dashboardContext);
  const [jdText, setJdText] = useState('');
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [customTargets, setCustomTargets] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [activeVariant, setActiveVariant] = useState('balanced');

  // Target demographics options
  const targetOptions = [
    'Women in Technical Roles',
    'Candidates from Tier-2/3 Cities',
    'First-Generation Graduates',
    'SC/ST Candidates',
    'South/East/Northeast India',
    'Persons with Disabilities',
    'Women Returning from Career Breaks'
  ];

  // If user is candidate, show info card
  if (user.role === 'candidate') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '64px' }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1F1235',
            fontFamily: "'Poppins', sans-serif",
            marginBottom: '8px'
          }}>
            Recruiter Feature
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            fontFamily: "'Poppins', sans-serif",
            lineHeight: '1.7',
            margin: 0
          }}>
            The JD Rewriter is designed for recruiters to rewrite job descriptions and attract underrepresented talent. Log in as a Recruiter to access this feature.
          </p>
        </div>
      </div>
    );
  }

  const handleTargetToggle = (target) => {
    setSelectedTargets(prev => 
      prev.includes(target)
        ? prev.filter(t => t !== target)
        : [...prev, target]
    );
  };

  const handleRewrite = async () => {
    if (!jdText.trim()) {
      setError('Please paste a job description before rewriting.');
      return;
    }

    // Combine predefined selections and custom targets
    const allTargets = [...selectedTargets];
    if (customTargets.trim()) {
      // Split custom targets by comma, semicolon, or newline and clean them up
      const customTargetsList = customTargets
        .split(/[,;\n]/)
        .map(target => target.trim())
        .filter(target => target.length > 0);
      allTargets.push(...customTargetsList);
    }

    if (allTargets.length === 0) {
      setError('Please select at least one target demographic or add custom requirements.');
      return;
    }

    setLoading(true);
    setError('');
    // Clear previous results to avoid showing stale data
    setResults(null);
    
    try {
      const rewriteData = {
        jd_text: jdText,
        target_demographics: allTargets,
        user_id: user.user_id
      };
      
      console.log('Sending rewrite request:', rewriteData); // Debug log
      const result = await rewriteJD(rewriteData);
      console.log('Rewrite result received:', result); // Debug log
      setResults(result);
      
      // Trigger dashboard refresh
      console.log('Triggering dashboard refresh');
      triggerRefresh();
      
    } catch (err) {
      console.error('Rewrite error:', err); // Debug log
      setError(err.message || 'Rewrite unavailable. Please check that the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const variantDescriptions = {
    conservative: "Minimal changes. Removes only legally risky language.",
    balanced: "Removes all detected bias while preserving your company's voice.",
    inclusive_first: "Full rewrite maximizing inclusivity and talent attraction signals."
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
        Inclusive JD Rewriter
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
        Rewrite your job description to actively attract the demographic your company is currently failing to hire — using Indian-specific research.
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
        {/* Step 1 - Job Description Input */}
        <div style={{ marginBottom: '24px' }}>
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
            placeholder="Paste the job description you want to rewrite..."
          />
        </div>

        {/* Step 2 - Target Demographics */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            fontFamily: "'Poppins', sans-serif",
            display: 'block',
            marginBottom: '4px'
          }}>
            Which group is your company currently underrepresented in?
          </label>
          <p style={{
            fontSize: '12px',
            color: '#9CA3AF',
            fontFamily: "'Poppins', sans-serif",
            marginBottom: '12px'
          }}>
            Select one or more.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            {targetOptions.map((target) => (
              <button
                key={target}
                onClick={() => handleTargetToggle(target)}
                style={{
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: '500',
                  fontFamily: "'Poppins', sans-serif",
                  borderRadius: '8px',
                  border: selectedTargets.includes(target) ? '2px solid #7C3AED' : '1px solid #D1D5DB',
                  background: selectedTargets.includes(target) ? '#FAF5FF' : 'white',
                  color: selectedTargets.includes(target) ? '#7C3AED' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {target}
              </button>
            ))}
            
            {/* Custom Requirements Button */}
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: "'Poppins', sans-serif",
                borderRadius: '8px',
                border: showCustomInput ? '2px solid #EC4899' : '1px solid #D1D5DB',
                background: showCustomInput ? '#FDF2F8' : 'white',
                color: showCustomInput ? '#EC4899' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              + Custom Requirements
            </button>
          </div>

          {/* Custom Input Field */}
          {showCustomInput && (
            <div style={{ marginTop: '16px' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                fontFamily: "'Poppins', sans-serif",
                display: 'block',
                marginBottom: '8px'
              }}>
                Specify Custom Demographics/Requirements
              </label>
              <textarea
                value={customTargets}
                onChange={(e) => setCustomTargets(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '13px',
                  fontFamily: "'Poppins', sans-serif",
                  color: '#374151',
                  backgroundColor: 'white',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="e.g., Military veterans, Remote workers from rural areas, People with non-traditional educational backgrounds
Separate multiple requirements with commas or new lines."
                onFocus={(e) => {
                  e.target.style.borderColor = '#EC4899';
                  e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p style={{
                fontSize: '11px',
                color: '#9CA3AF',
                fontFamily: "'Poppins', sans-serif",
                marginTop: '6px',
                marginBottom: '0'
              }}>
                Be specific about the groups your company wants to attract. This helps our AI tailor the language more effectively.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div style={{ color: '#DC2626', fontSize: '13px', marginTop: '6px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Step 3 - Generate Button */}
        <button
          onClick={handleRewrite}
          disabled={loading || !jdText.trim() || selectedTargets.length === 0}
          style={
            (loading || !jdText.trim() || selectedTargets.length === 0)
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
          {loading ? 'Generating...' : 'Generate Inclusive Variants'}
        </button>
      </div>

      {/* Results */}
      {results && !loading && (
        <div>
          {/* Section 1 - Rewrite Variants */}
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
              Rewrite Variants
            </h3>
            
            {/* Tab Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {Object.keys(results.variants).map((variant) => (
                <button
                  key={variant}
                  onClick={() => setActiveVariant(variant)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    fontFamily: "'Poppins', sans-serif",
                    borderRadius: '20px',
                    border: 'none',
                    background: activeVariant === variant ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : '#F3F4F6',
                    color: activeVariant === variant ? 'white' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {variant === 'conservative' && 'Conservative'}
                  {variant === 'balanced' && 'Balanced (Recommended)'}
                  {variant === 'inclusive_first' && 'Inclusive-First'}
                </button>
              ))}
            </div>
            
            {/* Description */}
            <p style={{
              fontSize: '12px',
              color: '#6B7280',
              fontFamily: "'Poppins', sans-serif",
              fontStyle: 'italic',
              marginBottom: '16px'
            }}>
              {variantDescriptions[activeVariant]}
            </p>
            
            {/* Rewritten Text */}
            <div style={{ position: 'relative' }}>
              <pre style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '13px',
                fontFamily: "'Courier New', monospace",
                minHeight: '150px',
                whiteSpace: 'pre-wrap',
                overflowX: 'auto',
                color: '#1F1235',
                lineHeight: '1.6'
              }}>
                {results.variants[activeVariant]}
              </pre>
              <button
                onClick={() => copyToClipboard(results.variants[activeVariant])}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  fontSize: '12px',
                  color: '#7C3AED',
                  fontWeight: '500',
                  fontFamily: "'Poppins', sans-serif",
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Section 2 - Change Annotation Diff */}
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
              What Changed and Why
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {/* Original Panel */}
              <div>
                <h4 style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  color: '#DC2626',
                  fontFamily: "'Poppins', sans-serif",
                  marginBottom: '12px'
                }}>
                  Original
                </h4>
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  {results.diff_annotations.map((annotation, index) => (
                    <div key={index} style={{ marginBottom: '12px' }}>
                      <span style={{
                        background: '#FEE2E2',
                        color: '#DC2626',
                        textDecoration: 'line-through',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        {annotation.original_phrase}
                      </span>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{
                          display: 'inline-block',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          fontSize: '11px',
                          fontFamily: "'Poppins', sans-serif",
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {annotation.bias_type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rewritten Panel */}
              <div>
                <h4 style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  color: '#16A34A',
                  fontFamily: "'Poppins', sans-serif",
                  marginBottom: '12px'
                }}>
                  Rewritten (Balanced)
                </h4>
                <div style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  {results.diff_annotations.map((annotation, index) => (
                    <div key={index} style={{ marginBottom: '12px' }}>
                      <span style={{
                        background: '#BBF7D0',
                        color: '#16A34A',
                        fontWeight: '500',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        {annotation.rewritten_phrase || 'removed'}
                      </span>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{
                          display: 'inline-block',
                          background: '#BBF7D0',
                          color: '#16A34A',
                          fontSize: '11px',
                          fontFamily: "'Poppins', sans-serif",
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          Skills-First Language
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 - Attraction Score */}
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
              marginBottom: '8px'
            }}>
              Demographic Attraction Score
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#6B7280',
              fontFamily: "'Poppins', sans-serif",
              marginBottom: '16px'
            }}>
              How attractive is this JD to your selected target demographic — before and after rewriting.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <AttractionScore 
                score={results.attraction_score_before} 
                label="Before Rewrite"
              />
              <AttractionScore 
                score={results.attraction_score_after} 
                label="After Rewrite"
              />
            </div>
            
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#16A34A',
                fontFamily: "'Poppins', sans-serif",
                marginBottom: '8px'
              }}>
                Predicted Outcome
              </h4>
              <p style={{
                fontSize: '13px',
                color: '#374151',
                fontFamily: "'Poppins', sans-serif",
                margin: 0
              }}>
                {results.predicted_outcome}
              </p>
            </div>
          </div>

          {/* Section 4 - Bias Audit Certificate */}
          <AuditCertificate certificate={results.certificate} />
        </div>
      )}
    </div>
  );
}
