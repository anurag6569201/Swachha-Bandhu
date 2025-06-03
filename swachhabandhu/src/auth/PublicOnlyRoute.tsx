// src/auth/PublicOnlyRoute.tsx
import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path

const PublicOnlyRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />; // Redirect to app if logged in
  }

  return children;
};

export default PublicOnlyRoute;