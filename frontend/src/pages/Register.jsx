import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'recruiter'
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await registerUser(formData);
      login(data);
      if (data.role === 'recruiter') {
        navigate('/dashboard/recruiter');
      } else if (data.role === 'candidate') {
        navigate('/dashboard/candidate');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setApiError(error.message || 'Registration failed. Please try again.');
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
          <p className="text-text-secondary text-sm">Create your account</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            error={errors.name}
          />

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
                placeholder="Min 8 characters"
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

          <div className="w-full">
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Role <span className="text-accent-pink">*</span>
            </label>
            <div className="flex gap-3">
              {['recruiter', 'candidate'].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all capitalize ${
                    formData.role === role
                      ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white'
                      : 'bg-bg-secondary border border-white/10 text-text-secondary hover:border-accent-pink/50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full py-3 mt-6">
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-pink hover:text-accent-pink/80 font-medium">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
};
