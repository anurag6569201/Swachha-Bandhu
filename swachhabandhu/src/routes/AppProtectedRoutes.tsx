// src/routes/AppProtectedRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DashboardPage from '../pages/apps/dashboard/Dashboard';
import NotFoundPage from '../pages/landing/landingpages/NotFoundPage';
import GamificationDashboard from '../pages/apps/lottery/LotteryDashboard';
import NewReportPage from '../pages/apps/report/NewReportPage';
import ReportSuccessPage from '../pages/apps/report/ReportSuccessPage';
import MyReportsPage from '../pages/apps/report/MyReportsPage';
import ReportDetailPage from '../pages/apps/report/ReportDetailPage';
import ReportManagementPage from '../pages/apps/report/ReportManagementPage';
import UserProfilePage from '../pages/apps/profile/UserProfilePage';
import RoleBasedRoute from './RoleBasedRoute';
import VerifyReportsPage from '../pages/apps/report/VerifyReportsPage'; // New Import

const AppProtectedRoutes: React.FC = () => {
  return (
    // The <Outlet /> in AppLayout will render these routes
    <Routes>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="lottery" element={<GamificationDashboard />} />
        <Route path="profile" element={<UserProfilePage />} />
        
        {/* --- REPORTING FLOW ROUTES --- */}
        <Route path="report/new" element={<NewReportPage />} />
        <Route path="report/new/:locationId" element={<NewReportPage />} />
        <Route path="report/success/:reportId" element={<ReportSuccessPage />} />

        {/* --- VERIFICATION FLOW ROUTE --- */}
        <Route path="verify" element={<VerifyReportsPage />} />
        <Route path="report/verify/:originalReportId" element={<NewReportPage mode="verify" />} />
        
        {/* --- REPORT VIEWING ROUTES --- */}
        <Route path="reports" element={<MyReportsPage />} />
        <Route path="reports/:reportId" element={<ReportDetailPage />} />

        {/* --- ADMIN-ONLY ROUTE --- */}
        <Route 
          path="manage/reports"
          element={
            <RoleBasedRoute allowedRoles={['MUNICIPAL_ADMIN', 'MODERATOR', 'SUPER_ADMIN']}>
              <ReportManagementPage />
            </RoleBasedRoute>
          } 
        />
        
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppProtectedRoutes;