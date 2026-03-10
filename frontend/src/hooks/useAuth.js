import { useState, useEffect } from 'react';
import { logoutUser } from '../api/auth';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (token && user_id && name) {
      setUser({ token, user_id, name, email, role });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);
    setUser(data);
  };

  const register = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);
    setUser(data);
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await logoutUser(token);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.clear();
    setUser(null);
  };

  return { user, login, register, logout };
}
