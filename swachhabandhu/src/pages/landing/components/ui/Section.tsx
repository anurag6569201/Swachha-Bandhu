import React, { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  bgColor?: string;
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  id, 
  className = '', 
  bgColor = 'bg-white' 
}) => {
  return (
    <section 
      id={id} 
      className={`py-16 md:py-24 ${bgColor} ${className}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        {children}
      </div>
    </section>
  );
};

export default Section;