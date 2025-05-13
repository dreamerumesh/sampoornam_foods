// src/utils/axiosConfig.js
import axios from 'axios';

// Create an axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api"||import.meta.env.VITE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const requestURL = error.config.url;

      if (error.response.status === 401 && !requestURL.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login'); // only works inside a React component or if you pass `navigate` to the interceptor context

      }
    }
    return Promise.reject(error); // Pass the error to frontend
  }
);


export default axiosInstance;