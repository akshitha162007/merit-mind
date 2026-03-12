import axios from 'axios';

// Base URL for the backend API
const BASE_URL = 'http://localhost:8000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for bias analysis calls
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Detect bias in a job description
 * @param {Object} data - Request data
 * @param {string} data.jd_text - Job description text
 * @param {string} data.user_role - User role (recruiter/candidate)
 * @param {string} data.user_id - User ID
 * @returns {Promise<Object>} Bias detection results
 */
export const detectBias = async (data) => {
  try {
    const response = await apiClient.post('/api/bias/detect', data);
    return response.data;
  } catch (error) {
    console.error('Bias detection error:', error);
    
    // If API is unavailable, return error that components can handle
    if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
      throw new Error('Analysis unavailable. Please check that the backend is running and try again.');
    }
    
    // For other errors, throw the original error message
    throw new Error(error.response?.data?.detail || error.message || 'Failed to analyze bias');
  }
};

/**
 * Rewrite job description for inclusivity
 * @param {Object} data - Request data
 * @param {string} data.jd_text - Job description text
 * @param {string[]} data.target_demographics - Target demographics array
 * @param {string} data.user_id - User ID
 * @returns {Promise<Object>} Rewrite results with variants and certificate
 */
export const rewriteJD = async (data) => {
  try {
    const response = await apiClient.post('/api/bias/rewrite', data);
    return response.data;
  } catch (error) {
    console.error('JD rewrite error:', error);
    
    // If API is unavailable, return error that components can handle
    if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
      throw new Error('Rewrite unavailable. Please check that the backend is running and try again.');
    }
    
    // For other errors, throw the original error message
    throw new Error(error.response?.data?.detail || error.message || 'Failed to rewrite job description');
  }
};

/**
 * Get bias analysis history for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of historical analyses
 */
export const getBiasHistory = async (userId) => {
  try {
    const response = await apiClient.get(`/api/bias/history?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Bias history error:', error);
    
    // Return empty array if history is unavailable
    if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
      return [];
    }
    
    // For other errors, still return empty array to prevent UI breaks
    return [];
  }
};

/**
 * Health check for the bias detection service
 * @returns {Promise<Object>} Service status
 */
export const checkBiasServiceHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw new Error('Backend service is unavailable');
  }
};

// Export all functions as named exports for easier importing
export default {
  detectBias,
  rewriteJD,
  getBiasHistory,
  checkBiasServiceHealth
};