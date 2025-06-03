// src/App.tsx
import React, { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom'; // Added Link for Navbar example
import Header from './pages/landing/components/layout/Header';
import Footer from './pages/landing/components/layout/Footer';
import HomePage from './pages/landing/landingpages/HomePage';
import AboutPage from './pages/landing/landingpages/AboutPage';
import HowItWorksPage from './pages/landing/landingpages/HowItWorksPage';
import FeaturesPage from './pages/landing/landingpages/FeaturesPage';
import MunicipalitiesPage from './pages/landing/landingpages/MunicipalitiesPage';
import CSRPartnersPage from './pages/landing/landingpages/CSRPartnersPage';
import FAQPage from './pages/landing/landingpages/FAQPage';
import ContactPage from './pages/landing/landingpages/ContactPage';
import PrivacyPage from './pages/landing/landingpages/PrivacyPage';
import TermsPage from './pages/landing/landingpages/TermsPage';

import LoginPage from './pages/landing/landingpages/LoginPage';
import SignupPage from './pages/landing/landingpages/SignupPage';
import ForgotPasswordPage from './pages/landing/landingpages/ForgotPasswordPage';
import ResetPasswordPage from './pages/landing/landingpages/ResetPasswordPage';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import NotFoundPage from './pages/landing/landingpages/NotFoundPage';
import DashboardPage from './pages/apps/dashboard/Dashboard';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> 
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/for-municipalities" element={<MunicipalitiesPage />} />
          <Route path="/for-csr-partners" element={<CSRPartnersPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Protected Routes Example */}
          <Route 
            path="app/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* CATCH-ALL 404 ROUTE */}
          <Route path="*" element={<NotFoundPage/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider wraps everything that needs auth context */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;