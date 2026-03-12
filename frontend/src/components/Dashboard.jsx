import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import FairnessOptimizerPanel from './FairnessOptimizerPanel';
import ReverseBiasSimulator from './ReverseBiasSimulator';

export default function Dashboard({ user, onLogout }) {
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [activePanel, setActivePanel] = useState(null);
import { useNavigate, Outlet } from 'react-router-dom';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0D0B1E', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: 'rgba(255, 255, 255, 0.03)', borderRight: '1px solid rgba(255, 255, 255, 0.07)', padding: '24px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Merit Mind
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.75rem', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            {user.role === 'recruiter' ? 'Recruiter Portal' : 'Candidate Portal'}
          </p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Dashboard Parent Item */}
          <div 
            onClick={() => setDashboardOpen(!dashboardOpen)}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 20px', 
              cursor: 'pointer', 
              color: '#B8A9D9',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              transition: 'background 0.3s ease'
            }}
          >
            <span>Dashboard</span>
            <ChevronRight 
              size={16} 
              style={{ 
                transform: dashboardOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
                transition: 'transform 300ms' 
              }} 
            />
          </div>

          {/* Dashboard Child Items */}
          {dashboardOpen && user.role === 'recruiter' && (
            <>
              <div 
                onClick={() => setActivePanel('fairness-optimizer')}
                style={{ 
                  padding: '10px 20px 10px 32px', 
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  color: activePanel === 'fairness-optimizer' ? '#E91E8C' : '#B8A9D9',
                  borderLeft: activePanel === 'fairness-optimizer' ? '4px solid #E91E8C' : 'none',
                  background: activePanel === 'fairness-optimizer' ? 'rgba(233,30,140,0.08)' : 'transparent',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                Fairness Optimizer
              </div>
              <div 
                onClick={() => setActivePanel('reverse-bias-simulator')}
                style={{ 
                  padding: '10px 20px 10px 32px', 
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  color: activePanel === 'reverse-bias-simulator' ? '#E91E8C' : '#B8A9D9',
                  borderLeft: activePanel === 'reverse-bias-simulator' ? '4px solid #E91E8C' : 'none',
                  background: activePanel === 'reverse-bias-simulator' ? 'rgba(233,30,140,0.08)' : 'transparent',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                Reverse Bias Simulator
              </div>
            </>
          )}

          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: '#B8A9D9', fontWeight: 600, border: 'none', cursor: 'pointer', background: 'transparent', transition: 'all 0.3s ease' }}>
          <button
            onClick={() => navigate('.')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(233, 30, 140, 0.1)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', borderLeft: '4px solid #E91E8C', transition: 'all 0.3s ease' }}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate(user.role === 'recruiter' ? '/recruitment' : '/applications')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: '#B8A9D9', fontWeight: 600, border: 'none', cursor: 'pointer', background: 'transparent', transition: 'all 0.3s ease' }}
          >
            {user.role === 'recruiter' ? 'Job Postings' : 'Applications'}
          </button>
          <button
            onClick={() => navigate('candidate-view')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: '#B8A9D9', fontWeight: 600, border: 'none', cursor: 'pointer', background: 'transparent', transition: 'all 0.3s ease' }}
          >
            {user.role === 'recruiter' ? 'Candidates' : 'My Resume'}
          </button>
          <button
            onClick={() => navigate('test-fairness')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: '#B8A9D9', fontWeight: 600, border: 'none', cursor: 'pointer', background: 'transparent', transition: 'all 0.3s ease' }}
          >
            Fairness Test
          </button>
          <button
            onClick={() => navigate('skill-evaluation')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: '#B8A9D9', fontWeight: 600, border: 'none', cursor: 'pointer', background: 'transparent', transition: 'all 0.3s ease' }}
          >
            Skill Evaluation
          </button>
          <button
            onClick={() => navigate('analytics')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: '#B8A9D9', fontWeight: 600, border: 'none', cursor: 'pointer', background: 'transparent', transition: 'all 0.3s ease' }}
          >
            Analytics
          </button>
          <button
            onClick={() => navigate('settings')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: '#B8A9D9', fontWeight: 600, border: 'none', cursor: 'pointer', background: 'transparent', transition: 'all 0.3s ease' }}
          >
            Settings
          </button>
        </nav>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)', paddingTop: '16px' }}>
          <div style={{ marginBottom: '12px', paddingLeft: '8px' }}>
            <p className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Logged In As</p>
            <p style={{ fontWeight: 600, color: 'white' }}>{user.name}</p>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{user.email}</p>
          </div>
          <button onClick={onLogout} style={{ width: '100%', padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '240px', padding: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activePanel === 'fairness-optimizer' ? (
            <FairnessOptimizerPanel />
          ) : activePanel === 'reverse-bias-simulator' ? (
            <ReverseBiasSimulator />
          ) : (
            <>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Welcome Back, {user.name}
            </h2>
            <p className="text-secondary">
              {user.role === 'recruiter' 
                ? 'AI-Powered Bias Detection & Fair Hiring Intelligence' 
                : 'Track Applications with Merit-Based Transparency'}
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Total {user.role === 'recruiter' ? 'Jobs' : 'Applications'}
                </p>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#7B2FFF' }}></div>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>0</p>
            </div>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Active</p>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#00D4FF' }}></div>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>0</p>
            </div>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Completed</p>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#E91E8C' }}></div>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>0</p>
            </div>
          </div>

          {/* Main Panel */}
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)', borderRadius: '12px', margin: '0 auto 24px' }}></div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Agentic AI Orchestrator
            </h3>
            <p className="text-secondary" style={{ marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              Your dashboard is ready. Deploy AI agents to {user.role === 'recruiter' ? 'analyze job descriptions and detect bias' : 'optimize your resume and track applications'} with full transparency and explainability.
            </p>
            <button className="btn-gradient">
              {user.role === 'recruiter' ? 'Launch JD Analyzer' : 'Upload Resume'}
            </button>
          </div>
            </>
          )}

          {/* Nested route content */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
