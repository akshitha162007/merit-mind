import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../api/auth';

export const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('overview');

  const handleLogout = async () => {
    try {
      await logoutUser(token);
    } catch (error) {
      // continue with logout
    }
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'jd', icon: '📄', label: 'Job Descriptions' },
    { id: 'candidates', icon: '👤', label: 'Candidates' },
    { id: 'reports', icon: '📊', label: 'Bias Reports' },
    { id: 'metrics', icon: '⚖️', label: 'Fairness Metrics' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="floating-orb orb-1" style={{ top: '-200px', left: '-200px' }}></div>
      <div className="floating-orb orb-2" style={{ bottom: '-200px', right: '-200px' }}></div>

      <aside className="fixed left-0 top-0 w-60 h-screen bg-bg-primary border-r border-white/10 p-6 flex flex-col z-50">
        <div className="mb-12">
          <h2 className="text-2xl font-syne font-bold text-text-primary">Merit Mind</h2>
          <p className="text-xs text-text-secondary mt-1">Bias-Free Recruitment</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeNav === item.id
                  ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-lg text-text-secondary hover:text-accent-pink transition-colors font-medium border border-white/10 hover:border-accent-pink/50"
        >
          Logout
        </button>
      </aside>

      <main className="ml-60 pt-20 px-8 pb-8">
        <nav className="fixed top-0 right-0 left-60 bg-bg-primary/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex items-center justify-between z-40">
          <div className="text-lg font-semibold text-text-primary">
            Welcome back, <span className="text-accent-pink">{user?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-sm font-bold">
              {getInitials(user?.name || 'U')}
            </div>
            <div className="text-sm">
              <p className="text-text-primary font-medium">{user?.name}</p>
              <p className="text-accent-pink text-xs font-semibold">Recruiter</p>
            </div>
          </div>
        </nav>

        <div className="fade-in">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <p className="text-6xl mb-4">🏗️</p>
            <h1 className="text-3xl font-syne font-bold text-text-primary mb-2">Recruiter Dashboard</h1>
            <p className="text-text-secondary">Your workspace is being built. Features coming soon.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
