import { useState } from 'react';
import { loginUser } from '../api/auth';
import { X, Loader2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onSwitchToSignUp, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      onLoginSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full mx-4 neon-border animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black uppercase tracking-tight gradient-text">LOGIN</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mb-4 glass rounded-lg border border-[#4D4DFF]/30 focus:neon-border focus:outline-none text-white placeholder-gray-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-4 glass rounded-lg border border-[#4D4DFF]/30 focus:neon-border focus:outline-none text-white placeholder-gray-500"
            required
          />
          {error && <p className="text-red-400 text-sm mb-4 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 neon-border bg-[#4D4DFF]/20 hover:bg-[#4D4DFF]/30 text-white font-black uppercase tracking-wide rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> LOGGING IN...</> : 'LOGIN'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-400 text-sm">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="text-[#4D4DFF] font-semibold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
