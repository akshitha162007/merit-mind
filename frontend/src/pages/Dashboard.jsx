import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/ui/Card';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('overview');

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'jd', icon: '📄', label: 'Job Descriptions' },
    { id: 'candidates', icon: '👤', label: 'Candidates' },
    { id: 'reports', icon: '📊', label: 'Bias Reports' },
    { id: 'metrics', icon: '⚖️', label: 'Fairness Metrics' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  const statCards = [
    { label: 'Total JDs', value: '—' },
    { label: 'Candidates Screened', value: '—' },
    { label: 'Bias Cases Detected', value: '—' },
    { label: 'Fairness Score', value: '—' }
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="floating-orb orb-1" style={{ top: '-200px', left: '-200px' }}></div>
      <div className="floating-orb orb-2" style={{ bottom: '-200px', right: '-200px' }}></div>

      {/* Sidebar */}
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
          onClick={() => navigate('/')}
          className="w-full px-4 py-3 rounded-lg text-text-secondary hover:text-accent-pink transition-colors font-medium border border-white/10 hover:border-accent-pink/50"
        >
          ← Back to Home
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-60 pt-20 px-8 pb-8">
        <Navbar />

        <div className="fade-in">
          <h1 className="text-4xl font-syne font-bold text-text-primary mb-8">Dashboard Overview</h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, idx) => (
              <Card key={idx} className="p-6">
                <p className="text-text-secondary text-sm mb-2">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                  <div className="shimmer w-12 h-12 rounded-lg"></div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-8 border-2 border-dashed border-white/20 flex flex-col items-center justify-center min-h-64">
              <p className="text-4xl mb-4">📊</p>
              <p className="text-text-secondary text-center">Analytics coming soon</p>
            </Card>

            <Card className="p-8 border-2 border-dashed border-white/20 flex flex-col items-center justify-center min-h-64">
              <p className="text-4xl mb-4">📋</p>
              <p className="text-text-secondary text-center">Recent Activity coming soon</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
