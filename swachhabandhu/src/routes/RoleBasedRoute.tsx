// src/routes/RoleBasedRoute.tsx
import React, { type JSX } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Checking role...</div>;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect them to the dashboard or a "not authorized" page
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;