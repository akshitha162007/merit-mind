import { LayoutDashboard, Briefcase, Users, BarChart3, Settings, LogOut, FileText, Target } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D001A] via-[#1a0033] to-[#0D001A] flex">
      {/* Sidebar */}
      <aside className="w-64 glass-strong p-6 flex flex-col border-r border-[#4D4DFF]/30">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight gradient-text">
            MERIT MIND
          </h1>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-semibold">
            {user.role === 'recruiter' ? 'Recruiter Portal' : 'Candidate Portal'}
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg neon-border bg-[#4D4DFF]/10 text-white font-semibold hover:bg-[#4D4DFF]/20 transition">
            <LayoutDashboard size={18} />
            <span>DASHBOARD</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg glass text-gray-300 hover:text-white hover:neon-border transition">
            <Briefcase size={18} />
            <span>{user.role === 'recruiter' ? 'JOB POSTINGS' : 'APPLICATIONS'}</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg glass text-gray-300 hover:text-white hover:neon-border transition">
            <Users size={18} />
            <span>{user.role === 'recruiter' ? 'CANDIDATES' : 'MY RESUME'}</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg glass text-gray-300 hover:text-white hover:neon-border transition">
            <BarChart3 size={18} />
            <span>ANALYTICS</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg glass text-gray-300 hover:text-white hover:neon-border transition">
            <Settings size={18} />
            <span>SETTINGS</span>
          </button>
        </nav>

        <div className="border-t border-[#4D4DFF]/30 pt-4">
          <div className="mb-3 px-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">LOGGED IN AS</p>
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 glass hover:neon-border text-white rounded-lg transition font-medium"
          >
            <LogOut size={16} />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
              WELCOME BACK, {user.name}
            </h2>
            <p className="text-gray-400 text-sm">
              {user.role === 'recruiter' 
                ? 'AI-Powered Bias Detection & Fair Hiring Intelligence' 
                : 'Track Applications with Merit-Based Transparency'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-strong rounded-xl p-6 hover:neon-border transition">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                  TOTAL {user.role === 'recruiter' ? 'JOBS' : 'APPLICATIONS'}
                </p>
                <FileText size={20} className="text-[#4D4DFF]" />
              </div>
              <p className="text-4xl font-black text-white">0</p>
            </div>
            <div className="glass-strong rounded-xl p-6 hover:neon-border transition">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">ACTIVE</p>
                <Target size={20} className="text-[#4D4DFF]" />
              </div>
              <p className="text-4xl font-black text-white">0</p>
            </div>
            <div className="glass-strong rounded-xl p-6 hover:neon-border transition">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">COMPLETED</p>
                <BarChart3 size={20} className="text-[#4D4DFF]" />
              </div>
              <p className="text-4xl font-black text-white">0</p>
            </div>
          </div>

          {/* Agent Orchestrator Hub */}
          <div className="glass-strong rounded-2xl p-12 text-center breathe">
            <div className="inline-block p-4 rounded-full neon-glow mb-6">
              <Target size={48} className="text-[#4D4DFF]" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              AGENTIC AI ORCHESTRATOR
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Your dashboard is ready. Deploy AI agents to {user.role === 'recruiter' ? 'analyze job descriptions and detect bias' : 'optimize your resume and track applications'} with full transparency and explainability.
            </p>
            <button className="px-8 py-4 neon-border bg-[#4D4DFF]/20 hover:bg-[#4D4DFF]/30 text-white font-black uppercase tracking-wide rounded-lg transition neon-glow">
              {user.role === 'recruiter' ? 'LAUNCH JD ANALYZER' : 'UPLOAD RESUME'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
