import { useState } from 'react';
import { registerUser } from '../api/auth';

export default function SignUpModal({ isOpen, onClose, onSwitchToLogin, onSignUpSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('recruiter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await registerUser({ name, email, password, role });
      onSignUpSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} onClick={onClose}>
      <div className="glass-card rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-syne font-bold text-text-primary">Create Account</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-lg border transition-all"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-lg border transition-all"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}
            required
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border transition-all pr-10"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}
              required
              minLength="8"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
            >
              {showPassword ? '✓' : '○'}
            </button>
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-lg border transition-all"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}
          >
            <option value="recruiter" style={{ backgroundColor: 'var(--bg-primary)' }}>Recruiter</option>
            <option value="candidate" style={{ backgroundColor: 'var(--bg-primary)' }}>Candidate</option>
          </select>
          {error && (
            <div className="mb-4 p-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 gradient-button rounded-lg font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        <p className="text-center mt-6 text-text-secondary text-sm">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-semibold hover:text-text-primary transition" style={{ color: 'var(--accent-pink)' }}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
