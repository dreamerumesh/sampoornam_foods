// src/pages/Auth/LoginPage.jsx
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Login from '../../components/auth/Login';
import { useAuth } from '../../hooks/useAuth';
import '../pages.css';

const LoginPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const message = location.state?.message || '';
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-container">
      {message && (
        <div className="message-container">
          <div className="success-message">
            <span>{message}</span>
          </div>
        </div>
      )}
      <Login />
    </div>
  );
};

export default LoginPage;