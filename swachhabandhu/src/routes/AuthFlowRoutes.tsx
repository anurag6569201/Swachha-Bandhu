import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your auth page components
import LoginPage from '../pages/landing/landingpages/LoginPage';
import SignupPage from '../pages/landing/landingpages/SignupPage';
import ForgotPasswordPage from '../pages/landing/landingpages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/landing/landingpages/ResetPasswordPage';

const AuthFlowRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password/:token" element={<ResetPasswordPage />} />
    </Routes>
  );
};

export default AuthFlowRoutes;