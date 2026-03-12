import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const analyzeEmotionBlind = async (jd_id, candidates) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/api/emotion-blind/analyze',
      { jd_id, candidates },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to run EmotionBlind analysis');
  }
};

export const getEmotionBlindResults = async (jd_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(
      `/api/emotion-blind/results/${jd_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch EmotionBlind results');
  }
};

export const checkEmotionBlindHealth = async () => {
  try {
    const response = await api.get('/api/emotion-blind/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend connection failed');
  }
};
