import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { CandidateDashboard } from './pages/CandidateDashboard';

function RoleRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (role === 'recruiter') {
      navigate('/dashboard/recruiter', { replace: true });
    } else if (role === 'candidate') {
      navigate('/dashboard/candidate', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);
  
  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard/recruiter" 
            element={
              <ProtectedRoute>
                <RecruiterDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/candidate" 
            element={
              <ProtectedRoute>
                <CandidateDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/dashboard" element={<RoleRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
