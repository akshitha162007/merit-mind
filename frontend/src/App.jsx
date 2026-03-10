import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import Dashboard from './components/Dashboard';
import useAuth from './hooks/useAuth';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user, login, register, logout } = useAuth();

  const openLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const openSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignUp(false);
  };

  // Show Dashboard if user is logged in
  if (user) {
    return <Dashboard user={user} onLogout={logout} />;
  }

  // Show Landing Page if not logged in
  return (
    <div className="font-sans">
      <Navbar user={user} openLogin={openLogin} openSignUp={openSignUp} logout={logout} />
      <Hero openSignUp={openSignUp} />
      <Features />
      <HowItWorks />
      <Footer />
      <LoginModal
        isOpen={showLogin}
        onClose={closeModals}
        onSwitchToSignUp={openSignUp}
        onLoginSuccess={login}
      />
      <SignUpModal
        isOpen={showSignUp}
        onClose={closeModals}
        onSwitchToLogin={openLogin}
        onSignUpSuccess={register}
      />
    </div>
  );
}

export default App;
