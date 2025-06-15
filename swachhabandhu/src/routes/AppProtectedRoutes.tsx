import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardPage from '../pages/apps/dashboard/Dashboard';
import NotFoundPage from '../pages/landing/landingpages/NotFoundPage';
import ScannerPage from '../pages/apps/scan/ScannerPage';
import SubmitReportPage from '../pages/apps/report/SubmitReportPage';
import GamificationDashboard from '../pages/apps/lottery/LotteryDashboard';

const AppProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="lottery" element={<GamificationDashboard />} />
      
      {/* New Reporting Flow Routes */}
      <Route path="scan" element={<ScannerPage />} />
      <Route path="report/new/:locationId" element={<SubmitReportPage />} />

      {/* Default route within the protected app */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* Fallback for any other /app/* route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppProtectedRoutes;