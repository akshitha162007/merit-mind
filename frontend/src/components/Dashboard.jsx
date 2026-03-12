import { useState } from 'react';
import SilenceRankPanel from './SilenceRankPanel';
import EmotionBlindPanel from './EmotionBlindPanel';
import ResumeSubmission from './ResumeSubmission';
import ResumesPanel from './ResumesPanel';
import FairnessOptimizerPanel from './FairnessOptimizerPanel';
import FairnessAudit from './FairnessAudit';
import ReverseBiasSimulator from './ReverseBiasSimulator';
import SkillEvaluationPage from '../pages/SkillEvaluationPage';
import { silenceRankDummyData } from '../config/silenceRankDummyData';
import { emotionBlindDummyData } from '../config/emotionBlindDummyData';

export default function Dashboard({ user, onLogout }) {
  const isRecruiter = user.role === 'recruiter';
  const [activeSection, setActiveSection] = useState(
    isRecruiter ? 'fairness-optimizer' : 'dashboard'
  );

  const recruiterFeatures = [
    { key: 'fairness-audit', label: 'Fairness Audit' },
    { key: 'fairness-optimizer', label: 'Fairness Optimizer' },
    { key: 'reverse-bias-simulator', label: 'Reverse Bias Simulator' },
    { key: 'silence-rank', label: 'Silence Rank' },
    { key: 'emotion-blind', label: 'EmotionBlind' },
    { key: 'skill-graph', label: 'Skill Graph' },
    { key: 'resumes', label: 'Resumes' }
  ];

  const candidateFeatures = [
    { key: 'resume-upload', label: 'Resume Upload' },
    { key: 'fairness-audit', label: 'Fairness Audit' },
    { key: 'pipeline-status', label: 'Pipeline Status' },
    { key: 'skill-graph', label: 'Skill Graph' },
    { key: 'emotion-blind', label: 'EmotionBlind' },
    { key: 'dashboard', label: 'Overview' }
  ];

  const sidebarItems = isRecruiter ? recruiterFeatures : candidateFeatures;

  const renderPanel = () => {
    if (activeSection === 'silence-rank') {
      return (
        <SilenceRankPanel
          jobDescriptions={silenceRankDummyData.jobDescriptions}
          applications={silenceRankDummyData.applications}
          dummyResultsByJD={silenceRankDummyData.resultsByJobDescription}
        />
      );
    }

    if (activeSection === 'emotion-blind') {
      return (
        <EmotionBlindPanel
          onBack={() => setActiveSection(isRecruiter ? 'fairness-optimizer' : 'dashboard')}
          dummyData={emotionBlindDummyData}
        />
      );
    }

    if (activeSection === 'resumes' && isRecruiter) {
      return <ResumesPanel />;
    }

    if (activeSection === 'resume-upload' && !isRecruiter) {
      return <ResumeSubmission candidate_id={user.user_id} />;
    }

    if (activeSection === 'fairness-optimizer' && isRecruiter) {
      return <FairnessOptimizerPanel />;
    }

    if (activeSection === 'fairness-audit') {
      return <FairnessAudit candidateId={user.user_id} />;
    }

    if (activeSection === 'reverse-bias-simulator' && isRecruiter) {
      return <ReverseBiasSimulator />;
    }

    if (activeSection === 'pipeline-status' && !isRecruiter) {
      return <ReverseBiasSimulator />;
    }

    if (activeSection === 'skill-graph') {
      return <SkillEvaluationPage />;
    }

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Portal Features
              </p>
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#7B2FFF' }}></div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{sidebarItems.length}</p>
          </div>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Role</p>
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#00D4FF' }}></div>
            </div>
            <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', textTransform: 'capitalize' }}>{user.role}</p>
          </div>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Backend</p>
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#E91E8C' }}></div>
            </div>
            <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>Supabase + API</p>
          </div>
        </div>

        {!isRecruiter && <ResumeSubmission candidate_id={user.user_id} />}
      </>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0B1E', display: 'flex' }}>
      <aside style={{ width: '260px', background: 'rgba(255, 255, 255, 0.03)', borderRight: '1px solid rgba(255, 255, 255, 0.07)', padding: '24px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Merit Mind
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.75rem', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            {isRecruiter ? 'Recruiter Portal - 6 Features' : 'Candidate Portal - 6 Features'}
          </p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(233, 30, 140, 0.1)' : 'transparent',
                  color: isActive ? 'white' : '#B8A9D9',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  borderLeft: isActive ? '4px solid #E91E8C' : '4px solid transparent',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
              >
                {item.label}
              </button>
            );
          })}
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

      <main style={{ flex: 1, marginLeft: '260px', padding: '28px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'white', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Welcome Back, {user.name}
            </h2>
            <p className="text-secondary">
              {isRecruiter
                ? 'Integrated recruiter stack with six end-to-end features.'
                : 'Integrated candidate stack with six portal features.'}
            </p>
          </div>
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}
