import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your public page components
import HomePage from '../pages/landing/landingpages/HomePage';
import AboutPage from '../pages/landing/landingpages/AboutPage';
import HowItWorksPage from '../pages/landing/landingpages/HowItWorksPage';
import FeaturesPage from '../pages/landing/landingpages/FeaturesPage';
import MunicipalitiesPage from '../pages/landing/landingpages/MunicipalitiesPage';
import CSRPartnersPage from '../pages/landing/landingpages/CSRPartnersPage';
import FAQPage from '../pages/landing/landingpages/FAQPage';
import ContactPage from '../pages/landing/landingpages/ContactPage';
import PrivacyPage from '../pages/landing/landingpages/PrivacyPage';
import TermsPage from '../pages/landing/landingpages/TermsPage';
import NotFoundPage from '../pages/landing/landingpages/NotFoundPage';


const LandingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="about" element={<AboutPage />} /> 
      <Route path="how-it-works" element={<HowItWorksPage />} />
      <Route path="features" element={<FeaturesPage />} />
      <Route path="for-municipalities" element={<MunicipalitiesPage />} />
      <Route path="for-csr-partners" element={<CSRPartnersPage />} />
      <Route path="faq" element={<FAQPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="privacy" element={<PrivacyPage />} />
      <Route path="terms" element={<TermsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default LandingRoutes;