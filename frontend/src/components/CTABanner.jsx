import { useNavigate } from 'react-router-dom';

export default function CTABanner() {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '80px 0' }}>
      <div className="container">
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.15), rgba(233, 30, 140, 0.15))' }}>
          <h2 style={{ marginBottom: '24px' }}>
            Ready to build a bias-free team?
          </h2>
          <button onClick={() => navigate('/register')} className="btn-gradient">
            Start for Free
          </button>
        </div>
      </div>
    </section>
  );
}
