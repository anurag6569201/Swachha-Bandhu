import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string | ReactNode;
  centered?: boolean;
  light?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  centered = false, 
  light = false 
}) => {
  const textAlign = centered ? 'text-center' : 'text-left';
  const textColor = light ? 'text-white' : 'text-gray-900';
  const subtitleColor = light ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`max-w-4xl mx-auto ${centered ? 'mx-auto' : 'mx-0'} mb-12`}>
      <motion.h2 
        className={`text-3xl md:text-4xl font-bold mb-4 ${textAlign} ${textColor}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.div 
          className={`text-lg ${subtitleColor} ${textAlign}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {subtitle}
        </motion.div>
      )}
    </div>
  );
};

export default SectionHeading;