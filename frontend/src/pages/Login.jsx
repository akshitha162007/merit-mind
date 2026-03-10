import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await loginUser(formData);
      login(data);
      
      if (data.role === 'recruiter') {
        navigate('/dashboard/recruiter', { replace: true });
      } else if (data.role === 'candidate') {
        navigate('/dashboard/candidate', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-8">
      <div className="floating-orb orb-1" style={{ top: '-200px', left: '-200px' }}></div>
      <div className="floating-orb orb-2" style={{ bottom: '-200px', right: '-200px' }}></div>

      <Card className="w-full max-w-md p-8 fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-syne font-bold text-text-primary mb-2">Merit Mind</h1>
          <p className="text-text-secondary text-sm">Sign in to your account</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            error={errors.email}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password <span className="text-accent-pink">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded-lg text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent-pink/50 focus:ring-2 focus:ring-accent-pink/20 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-text-secondary hover:text-accent-pink transition-colors"
              >
                {showPassword ? '👁️' : '👁️🗨️'}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full py-3 mt-6">
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-pink hover:text-accent-pink/80 font-medium">
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
};
