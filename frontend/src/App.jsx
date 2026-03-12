import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './components/Dashboard';
import CandidateView from './pages/CandidateView';
import Recruitment from './pages/Recruitment';
import Applications from './pages/Applications';
import TestFairness from './pages/TestFairness';
import SkillEvaluationPage from './pages/SkillEvaluationPage';
import useAuth from './hooks/useAuth';

function LandingPage({ openLogin, openSignUp }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0D0B1E' }}>
      <Navbar openLogin={openLogin} openSignUp={openSignUp} />
      <Hero openSignUp={openSignUp} />
      <Stats />
      <Features />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </div>
  );
}

function App() {
  const { user, login, register, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  if (user) {
    return (
      <Routes>
        <Route path="/" element={<Dashboard user={user} onLogout={logout} />}>
          <Route index element={null} />
          <Route path="candidate-view" element={<CandidateView />} />
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="applications" element={<Applications />} />
          <Route path="test-fairness" element={<TestFairness />} />
          <Route path="skill-evaluation" element={<SkillEvaluationPage />} />
          {/* additional nested routes such as analytics/settings could go here */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    );
  }

  return (
      <Routes>
        <Route path="/" element={<LandingPage openLogin={() => setShowLogin(true)} openSignUp={() => setShowSignUp(true)} />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={login} />} />
        <Route path="/register" element={<RegisterPage onSignUpSuccess={register} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;
