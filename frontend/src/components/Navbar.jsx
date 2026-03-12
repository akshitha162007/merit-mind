import { Link } from 'react-router-dom';

export default function Navbar({ openLogin, openSignUp }) {
  return (
    <nav className="flex-between" style={{
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

      <div className="flex-center" style={{ gap: '12px' }}>
        <Link to="/candidate-view" className="btn-outline" style={{ textDecoration: 'none' }}>
          Demo
        </Link>
        <Link to="/login" className="btn-outline" style={{ textDecoration: 'none' }}>
          Login
        </Link>
        <Link to="/register" className="btn-gradient" style={{ textDecoration: 'none' }}>
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
