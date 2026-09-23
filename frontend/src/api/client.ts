import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout for Render free tier spin-up
});

// Request interceptor to attach latest JWT or Firebase ID token
apiClient.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('careerpilot_token');
  if (auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
      if (token) {
        localStorage.setItem('careerpilot_token', token);
      }
    } catch {
      // Use existing token if getIdToken fails
    }
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle unauthenticated 401s gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only clear tokens if user is not authenticated via Firebase
      if (!error.config.url.includes('/auth/me') && !error.config.url.includes('/auth/login') && !auth.currentUser) {
        localStorage.removeItem('careerpilot_token');
        localStorage.removeItem('careerpilot_user');
      }
    }
    return Promise.reject(error);
  }
);
