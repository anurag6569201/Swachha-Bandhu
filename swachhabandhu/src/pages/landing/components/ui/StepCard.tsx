import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
}

const StepCard: React.FC<StepCardProps> = ({ 
  number, 
  title, 
  description, 
  icon,
  delay = 0 
}) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row items-start gap-4 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center justify-center min-w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-lg">
        {number}
      </div>
      <div>
        <div className="flex items-center mb-2">
          <span className="mr-2 text-teal-600">{icon}</span>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default StepCard;