import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import NavbarLoggedIn from './components/NavbarLoggedIn';
import VSCodeSidebar from './components/VSCodeSidebar';
import Hero from './components/Hero';
import DashboardHome from './components/DashboardHome';
import Stats from './components/Stats';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import WhyDifferent from './components/WhyDifferent';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import useAuth from './hooks/useAuth';
import { DashboardProvider } from './contexts/DashboardContext';

function LandingPage({ openLogin, openSignUp, user, onLogout }) {
  if (user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D0B1E' }}>
        <NavbarLoggedIn user={user} onLogout={onLogout} />
        <DashboardHome user={user} />
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D0B1E' }}>
      <Navbar openLogin={openLogin} openSignUp={openSignUp} user={user} onLogout={onLogout} />
      <VSCodeSidebar user={user} onLogout={onLogout} />
      <Hero openSignUp={openSignUp} />
      <Stats />
      <Features />
      <HowItWorks />
      <WhyDifferent />
      <CTABanner openSignUp={openSignUp} />
      <Footer />
    </div>
  );
}

// Auth Guard Component
function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const { user, login, register, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <DashboardProvider>
      {/* Global VS Code Sidebar - shows on all pages when logged in */}
      <VSCodeSidebar user={user} onLogout={logout} />
      
      <Routes>
        <Route path="/" element={<LandingPage openLogin={() => setShowLogin(true)} openSignUp={() => setShowSignUp(true)} user={user} onLogout={logout} />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={login} />} />
        <Route path="/register" element={<RegisterPage onSignUpSuccess={register} />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardProvider>
  );
}

export default App;
