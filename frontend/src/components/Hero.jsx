import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', marginBottom: '24px', lineHeight: 1.2 }}>
          Hire on <span className="gradient-text">Merit</span>. Not on Bias.
        </h1>

        <p className="text-secondary" style={{ fontSize: '1.125rem', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
          Merit Mind uses agentic AI to eliminate bias from job descriptions, blind-screen resumes, and rank candidates purely on skill — transparently and fairly.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')} className="btn-gradient" style={{ maxWidth: '220px' }}>
            Get Started Free
          </button>
          <button onClick={scrollToHowItWorks} className="btn-outline" style={{ maxWidth: '220px' }}>
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
}
