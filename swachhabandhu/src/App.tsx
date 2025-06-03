import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/for-municipalities" element={<MunicipalitiesPage />} />
            <Route path="/for-csr-partners" element={<CSRPartnersPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;