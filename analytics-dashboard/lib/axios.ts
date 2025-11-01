import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10);

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ REQUEST INTERCEPTOR ============
// Runs BEFORE every API request
apiClient.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('authToken')
      : null;

    // Add Bearer token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Bearer token added to request');
    } else {
      console.log('⚠️ No token found in localStorage');
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ============ RESPONSE INTERCEPTOR ============
// Runs AFTER every API response
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Success response - just return it
    console.log('✅ Response received:', response.status);
    return response;
  },
  (error: AxiosError) => {
    // Handle different error statuses
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('🔐 Unauthorized (401) - Token expired or invalid');

      // Remove invalid token from localStorage
      localStorage.removeItem('authToken');

      // Redirect to login page
      if (typeof window !== 'undefined') {
        console.log('🔄 Redirecting to login...');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      console.error('❌ Forbidden (403) - Access denied');
    } else if (error.response?.status === 404) {
      console.error('❌ Not Found (404) - Endpoint does not exist');
    } else if (error.response?.status === 500) {
      console.error('❌ Server Error (500) - Backend error');
    } else if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout');
    } else if (!error.response) {
      console.error('❌ Network error - Cannot reach backend');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
