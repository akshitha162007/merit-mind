import axios from 'axios';

// backend is served on port 8080 by default
const API_BASE = 'http://localhost:8080/api/auth';

export const registerUser = async ({ name, email, password, role }) => {
  try {
    console.log('Registering user:', { name, email, role });
    const response = await axios.post(`${API_BASE}/register`, { name, email, password, role });
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    console.log('Logging in user:', email);
    const response = await axios.post(`${API_BASE}/login`, { email, password });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Login failed');
  }
};

export const logoutUser = async (token) => {
  try {
    const response = await axios.post(`${API_BASE}/logout?token=${token}`);
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Logout failed');
  }
};
