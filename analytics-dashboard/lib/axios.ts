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

apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('authToken')
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Bearer token added to request');
    } else {
      console.log('No token found in localStorage');
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized (401) - Token expired or invalid');

      localStorage.removeItem('authToken');
      if (typeof window !== 'undefined') {
        console.log(' Redirecting to login...');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      console.error('Forbidden (403) - Access denied');
    } else if (error.response?.status === 404) {
      console.error('Not Found (404) - Endpoint does not exist');
    } else if (error.response?.status === 500) {
      console.error('Server Error (500) - Backend error');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error - Cannot reach backend');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
