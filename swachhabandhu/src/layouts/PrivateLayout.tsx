import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../pages/landing/components/layout/Footer'; // Adjust path
import PrivateHeader from '../pages/landing/components/layout/PrivateHeader';

const PrivateLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PrivateHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;