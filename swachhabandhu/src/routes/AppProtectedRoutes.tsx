import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardPage from '../pages/apps/dashboard/Dashboard';
import NotFoundPage from '../pages/landing/landingpages/NotFoundPage';

const AppProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />  
    </Routes>
  );
};

export default AppProtectedRoutes;