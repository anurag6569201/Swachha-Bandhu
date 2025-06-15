import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardPage from '../pages/apps/dashboard/Dashboard';
import NotFoundPage from '../pages/landing/landingpages/NotFoundPage';
import GamificationDashboard from '../pages/apps/lottery/LotteryDashboard';
import NewReportPage from '../pages/apps/report/NewReportPage';
import ReportSuccessPage from '../pages/apps/report/ReportSuccessPage';

const AppProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="lottery" element={<GamificationDashboard />} />
      
      {/* New Reporting Flow Routes */}
      <Route path="report/new" element={<NewReportPage />} />
      <Route path="report/new/:locationId" element={<NewReportPage />} />
      <Route path="report/success/:reportId" element={<ReportSuccessPage />} />
      
      {/* Default route within the protected app */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* Fallback for any other /app/* route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppProtectedRoutes;