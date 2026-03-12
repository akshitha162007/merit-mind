import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function VSCodeSidebar({ user, onLogout }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null; // Don't show sidebar if not logged in

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const handleFeatureClick = (feature) => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
    // Close sidebar after navigation
    setIsExpanded(false);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'fixed',
          top: '80px',
          left: '10px',
          zIndex: 1000,
          width: '36px',
          height: '36px',
          background: '#2D1B69',
          border: '1px solid #4C1D95',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#7C3AED';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#2D1B69';
        }}
      >
        {isExpanded ? '✕' : '☰'}
      </button>

      {/* Sidebar Panel */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsExpanded(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 998,
              backdropFilter: 'blur(2px)'
            }}
          />

          {/* Sidebar */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '260px',
              height: '100vh',
              background: '#1E1B4B',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 20px 20px 20px',
              borderBottom: '1px solid #374151'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: "'Poppins', sans-serif",
                marginBottom: '4px'
              }}>
                Merit Mind
              </div>
              <div style={{
                fontSize: '11px',
                color: '#9CA3AF',
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                RECRUITER PORTAL
              </div>
            </div>

            {/* Features Section */}
            <div style={{ padding: '20px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '12px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                FEATURES
              </div>

              {/* Bias Detector */}
              <button
                onClick={() => handleFeatureClick('bias-detection')}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#D1D5DB',
                  fontSize: '14px',
                  fontWeight: '400',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '4px',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(124, 58, 237, 0.1)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#D1D5DB';
                }}
              >
                <span style={{ fontSize: '16px' }}>🔍</span>
                Bias Detector
              </button>

              {/* JD Rewriter */}
              <button
                onClick={() => handleFeatureClick('jd-rewriter')}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#D1D5DB',
                  fontSize: '14px',
                  fontWeight: '400',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '4px',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(124, 58, 237, 0.1)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#D1D5DB';
                }}
              >
                <span style={{ fontSize: '16px' }}>✏️</span>
                JD Rewriter
              </button>
            </div>

            {/* User Info at Bottom */}
            <div style={{
              marginTop: 'auto',
              padding: '20px',
              borderTop: '1px solid #374151'
            }}>
              <div style={{
                fontSize: '11px',
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '8px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                LOGGED IN AS
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  {getInitials(user.name)}
                </div>
                <div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'white',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    {user.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#9CA3AF',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  setIsExpanded(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: '1px solid #4B5563',
                  borderRadius: '6px',
                  color: '#D1D5DB',
                  fontSize: '12px',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.target.style.borderColor = '#EF4444';
                  e.target.style.color = '#FCA5A5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = '#4B5563';
                  e.target.style.color = '#D1D5DB';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}