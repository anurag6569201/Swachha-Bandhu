import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Droplets, UserX, X, Clock, Eye } from 'lucide-react';
import Section from '../ui/Section';
import SectionHeading from '../ui/SectionHeading';

const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <AlertTriangle size={24} />,
      title: 'Broken Reporting Systems',
      description: 'Current civic issue reporting systems are fragmented, inefficient and often ignored.'
    },
    {
      icon: <Droplets size={24} />,
      title: 'Wasted Resources',
      description: 'Municipalities waste resources validating reports and responding to duplicate issues.'
    },
    {
      icon: <UserX size={24} />,
      title: 'Disempowered Citizens',
      description: 'Citizens feel powerless when their reports disappear into bureaucratic black holes.'
    },
    {
      icon: <X size={24} />,
      title: 'Fake Reports',
      description: 'Without verification, systems are plagued by false or exaggerated reports.'
    },
    {
      icon: <Clock size={24} />,
      title: 'Low Participation',
      description: 'Lack of incentives and feedback leads to low citizen engagement.'
    },
    {
      icon: <Eye size={24} />,
      title: 'Opaque Feedback Loops',
      description: 'Citizens rarely see the outcome of their reports, leading to distrust.'
    }
  ];

  return (
    <Section bgColor="">
      <SectionHeading
        title="The Civic Reporting Challenge"
        subtitle="Current civic issue reporting systems face several critical problems that limit their effectiveness and impact."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-amber-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mr-4">
                {problem.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default ProblemSection;