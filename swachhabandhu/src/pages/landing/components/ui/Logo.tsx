import React from 'react';
import logo from '../../../../assets/global/logo.png';

interface LogoProps {
  white?: boolean;
}

const Logo: React.FC<LogoProps> = () => {

  return (
    <div className="relative flex items-center">
      <img src={logo} alt="Swachh Bandhu Logo" className="h-12 w-auto" />
    </div>
  );
};

export default Logo;
