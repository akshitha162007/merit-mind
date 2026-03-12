import { Link } from 'react-router-dom';

export default function Navbar({ openLogin, openSignUp, user, onLogout }) {
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          // Logged in state - only show Welcome and Logout
          <>
            <span style={{ color: 'white', fontSize: '0.875rem', fontFamily: "'Poppins', sans-serif" }}>
              Welcome, {user.name}
            </span>
            <button 
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '8px 20px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = '#E91E8C';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'white';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          // Not logged in state
          <>
            <Link to="/login" style={{
              textDecoration: 'none',
              background: 'transparent',
              border: '1px solid white',
              color: 'white',
              fontWeight: 600,
              borderRadius: '8px',
              padding: '8px 20px',
              fontSize: '0.875rem',
              fontFamily: "'Poppins', sans-serif",
              display: 'inline-block'
            }}>
              Login
            </Link>
            <Link to="/register" style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)',
              border: 'none',
              color: 'white',
              fontWeight: 600,
              borderRadius: '10px',
              padding: '12px 28px',
              fontSize: '1rem',
              fontFamily: "'Poppins', sans-serif",
              display: 'inline-block'
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}