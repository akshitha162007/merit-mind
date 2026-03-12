import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function NavbarLoggedIn({ user, onLogout }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 50,
      padding: '16px 24px',
      background: 'rgba(13, 11, 30, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Merit Mind
        </h1>
      </Link>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#9CA3AF',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'transparent',
            border: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'white';
            e.target.style.background = 'rgba(124,58,237,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#9CA3AF';
            e.target.style.background = 'transparent';
          }}
        >
          Overview
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#9CA3AF',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'transparent',
            border: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'white';
            e.target.style.background = 'rgba(124,58,237,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#9CA3AF';
            e.target.style.background = 'transparent';
          }}
        >
          Bias Detection
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#9CA3AF',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'transparent',
            border: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'white';
            e.target.style.background = 'rgba(124,58,237,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#9CA3AF';
            e.target.style.background = 'transparent';
          }}
        >
          JD Rewriter
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              cursor: 'pointer',
              padding: '8px',
              background: 'transparent',
              border: 'none'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          {showNotifications && (
            <div style={{
              background: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '13px',
              color: '#9CA3AF',
              position: 'absolute',
              right: 0,
              top: '40px',
              whiteSpace: 'nowrap',
              zIndex: 50
            }}>
              No new notifications
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '999px',
              padding: '6px 14px 6px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: 'white'
            }}>
              {getFirstLetter(user?.name)}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '11px', color: '#A78BFA' }}>
                {user?.role === 'recruiter' ? 'Recruiter' : 'Candidate'}
              </div>
            </div>
          </button>
          {showUserMenu && (
            <div style={{
              background: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '10px',
              padding: '8px',
              position: 'absolute',
              right: 0,
              top: '48px',
              minWidth: '180px',
              zIndex: 50
            }}>
              <button
                onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: '#D1D5DB',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#374151'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                Dashboard
              </button>
              <button
                onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: '#D1D5DB',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#374151'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                My Analyses
              </button>
              <div style={{ borderTop: '1px solid #374151', margin: '8px 0' }}></div>
              <button
                onClick={() => { onLogout(); setShowUserMenu(false); }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: '#F87171',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#374151'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
