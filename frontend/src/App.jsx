import { Routes, Route, Navigate } from 'react-router-dom';
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
import useAuth from './hooks/useAuth';

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0D0B1E' }}>
      <Navbar />
      <Hero />
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

  if (user) {
    return <Dashboard user={user} onLogout={logout} />;
  }

  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={login} />} />
        <Route path="/register" element={<RegisterPage onSignUpSuccess={register} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;
