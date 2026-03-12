import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BiasDetector from '../components/dashboard/BiasDetector';
import JDRewriter from '../components/dashboard/JDRewriter';
import '../dashboard-responsive.css';

export default function Dashboard({ user, onLogout }) {
  const [activeFeature, setActiveFeature] = useState(null);

  // Get user initials for avatar
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const features = [
    { id: 'bias-detection', label: 'Bias Detection' },
    { id: 'jd-rewriter', label: 'JD Rewriter' }
  ];

  const handleFeatureClick = (featureId) => {
    setActiveFeature(featureId);
  };

  const renderActiveFeature = () => {
    if (!activeFeature) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{
            backgroundColor: '#1A1A2E',
            border: '1px solid #2D2D44',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            textAlign: 'center',
            maxWidth: '450px'
          }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '12px', margin: '0 auto 16px' }}></div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', fontFamily: "'Poppins', sans-serif", marginBottom: '8px' }}>Get Started</h3>
            <p style={{ color: '#B4B4C7', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
              Select a feature from the sidebar to get started
            </p>
          </div>
        </div>
      );
    }

    // Render actual feature components
    if (activeFeature === 'bias-detection') {
      return <BiasDetector user={user} />;
    }
    
    if (activeFeature === 'jd-rewriter') {
      return <JDRewriter user={user} />;
    }

    return null;
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#0F0F23'
    }}>
      {/* LEFT SIDEBAR */}
      <aside className="dashboard-sidebar" style={{
        width: '260px',
        minWidth: '260px',
        backgroundColor: '#1A1A2E',
        borderRight: '1px solid #2D2D44',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 100
      }}>
        {/* Logo Section */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #2D2D44'
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Poppins', sans-serif",
            marginBottom: '4px'
          }}>
            Merit Mind
          </div>
          <div style={{
            fontSize: '12px',
            color: '#8B8BA3',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            RECRUITER PORTAL
          </div>
        </div>

        {/* User Info Section */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #2D2D44'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#7C3AED',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '16px',
            marginBottom: '10px'
          }}>
            {getInitials(user.name)}
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '4px'
          }}>
            {user.name}
          </div>
          <div style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: '500',
            color: '#7C3AED',
            backgroundColor: '#FAF5FF',
            border: '1px solid #DDD6FE',
            borderRadius: '999px',
            padding: '2px 10px'
          }}>
            {user.role === 'recruiter' ? 'Recruiter' : 'Candidate'}
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{
          padding: '12px',
          flex: 1
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#8B8BA3',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 8px',
            display: 'block'
          }}>
            FEATURES
          </div>
          
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: activeFeature === feature.id ? '600' : '500',
                color: activeFeature === feature.id ? '#FFFFFF' : '#B4B4C7',
                cursor: 'pointer',
                display: 'block',
                border: 'none',
                borderLeft: activeFeature === feature.id ? '3px solid #EC4899' : 'none',
                backgroundColor: activeFeature === feature.id ? '#2D2D44' : 'transparent',
                textAlign: 'left',
                marginBottom: '4px',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeFeature !== feature.id) {
                  e.target.style.backgroundColor = '#2D2D44';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFeature !== feature.id) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {feature.label}
            </button>
          ))}
        </div>

        {/* Back to Home Link */}
        <Link
          to="/"
          style={{
            padding: '20px',
            fontSize: '13px',
            color: '#8B8BA3',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'block',
            marginTop: 'auto'
          }}
        >
          ← Back to Home
        </Link>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main-content" style={{
        marginLeft: '260px',
        flex: 1,
        padding: '32px',
        minHeight: '100vh',
        backgroundColor: '#0F0F23',
        overflowY: 'auto'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {renderActiveFeature()}
        </div>
      </main>
    </div>
  );
}