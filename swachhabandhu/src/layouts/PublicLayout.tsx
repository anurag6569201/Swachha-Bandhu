import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../pages/landing/components/layout/Header'; // Adjust path
import Footer from '../pages/landing/components/layout/Footer'; // Adjust path

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;