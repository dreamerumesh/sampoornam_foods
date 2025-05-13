// src/pages/Auth/RegisterPage.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Register from '../../components/auth/Register';
import { useAuth } from '../../hooks/useAuth';
import '../pages.css';

const RegisterPage = () => {
  const { user } = useAuth();
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-container">
      <Register />
    </div>
  );
};

export default RegisterPage;