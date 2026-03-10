import { useAuth } from '../context/AuthContext';
import { logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, token, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(token);
      logoutUser();
      navigate('/');
    } catch (error) {
      logoutUser();
      navigate('/');
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="fixed top-0 right-0 left-60 bg-bg-primary/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex items-center justify-between z-40">
      <div className="text-lg font-semibold text-text-primary">
        Welcome back, <span className="text-accent-pink">{user?.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-sm font-bold">
            {getInitials(user?.name || 'U')}
          </div>
          <div className="text-sm">
            <p className="text-text-primary font-medium">{user?.name}</p>
            <p className="text-text-secondary text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-pink transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
