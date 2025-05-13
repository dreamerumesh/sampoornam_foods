// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

// Create the AuthContext
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  verifyOTP: () => {},
  resendOTP: () => {},
  forgotPassword: () => {},
  resetPassword: () => {},
});

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    const checkAuthentication = async () => {
      try {
        if (token) {
          // Validate token
          await authService.validateToken();

          // If validation succeeds
          setIsAuthenticated(true);
          setUser(storedUser ? JSON.parse(storedUser) : null);
        }
      } catch (error) {
        // Token invalid, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (credentials) => {
    try {
      console.log(credentials);
      const response = await authService.login(credentials);

      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      return response;
    } catch (error) {
      //console.log(error.message);
      setIsAuthenticated(false);
      setUser(null);

      // Standardize error response
      return {
        success: false,
        message: error.message || "Login failed",
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  // Verify OTP
  const verifyOTP = async (verificationData) => {
    try {
      const response = await authService.verifyOTP(verificationData);
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Resend OTP
  const resendOTP = async (email) => {
    try {
      return await authService.resendOTP(email);
    } catch (error) {
      throw error;
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  // Reset Password
  const resetPassword = async (resetData) => {
    try {
      return await authService.resetPassword(resetData);
    } catch (error) {
      throw error;
    }
  };

  // Context value
  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

