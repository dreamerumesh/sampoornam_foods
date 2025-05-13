// src/services/authService.js
import axiosInstance from '../utils/axiosConfig';

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      console.log(userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Registration failed');
    }
  },

  // Verify OTP
  verifyOTP: async (verificationData) => {
    try {
      const response = await axiosInstance.post('/auth/verify-otp', verificationData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('OTP verification failed');
    }
  },

  //Login
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      // Store token and user info in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      //console.log(error.response);
      throw error.response ? error.response.data : new Error('Login failed');
    }
  },



   // Login
  //  login: async (credentials) => {
  //   try {
  //     const response = await axiosInstance.post('/auth/login', credentials);
  //     console.log(`Login resonse ${response.message} `);
      
  //     // Ensure we have a token before storing
  //     if (response.data.token) {
  //       localStorage.setItem('token', response.data.token);
  //       localStorage.setItem('user', JSON.stringify(response.data.user));
        
  //       return response.data;
  //     } else {
  //       throw new Error('No authentication token received');
  //     }
  //   } catch (error) {
  //     // Standardize error throwing
  //     if (error.response) {
  //       console.log(`Login error ${error.response.message} `);
  //       // The request was made and the server responded with a status code
  //       // that falls out of the range of 2xx
  //       throw error;
  //     } else if (error.request) {
  //       // The request was made but no response was received
  //       throw new Error('No response from server. Please check your connection.');
  //     } else {
  //       // Something happened in setting up the request that triggered an Error
  //       throw new Error('An unexpected error occurred during login');
  //     }
  //   }
  // },

  // Resend OTP
  resendOTP: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/resend-otp', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Resend OTP failed');
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Forgot password request failed');
    }
  },

  // Reset Password
  resetPassword: async (resetData) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Password reset failed');
    }
  },

  // Get Current User
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch user data');
    }
  },

  // Validate Token
  validateToken: async () => {
    try {
      const response = await axiosInstance.get('/auth/validate-token');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Token validation failed');
    }
  },

  // Logout
  logout: async () => {
    try {
      // Optional: Call backend logout first (send token!)
      const response = await axiosInstance.post('/auth/logout');
  
      // Now clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  
      return response.data;
    } catch (error) {
      // Fallback: Still clear if logout failed due to expired token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  
      // Don't throw error to avoid interceptor redirect
      return { message: 'Logged out with expired token' };
    }
  }
  
};

export default authService;