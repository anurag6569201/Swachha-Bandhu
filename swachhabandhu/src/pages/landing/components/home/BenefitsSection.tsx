import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, Users, Clock, BarChart as ChartBar, DollarSign, Heart, Zap, Lock, LineChart } from 'lucide-react';
import Section from '../ui/Section';
import SectionHeading from '../ui/SectionHeading';

const BenefitsSection: React.FC = () => {
  const citizenBenefits = [
    {
      icon: <CheckCircle size={20} />,
      title: 'Real Impact',
      description: 'See your reports verified and resolved with transparent tracking.'
    },
    {
      icon: <Trophy size={20} />,
      title: 'Rewards & Recognition',
      description: 'Earn points, rewards, and recognition for your civic contributions.'
    },
    {
      icon: <Users size={20} />,
      title: 'Community Connection',
      description: 'Connect with other citizens who care about improving your neighborhood.'
    },
    {
      icon: <Zap size={20} />,
      title: 'Easy to Use',
      description: 'Simple, intuitive interface makes reporting quick and efficient.'
    }
  ];

  const municipalityBenefits = [
    {
      icon: <Lock size={20} />,
      title: 'Verified Data',
      description: 'Make decisions based on reliable, community-verified information.'
    },
    {
      icon: <Clock size={20} />,
      title: 'Operational Efficiency',
      description: 'Reduce false reports and prioritize resources more effectively.'
    },
    {
      icon: <Heart size={20} />,
      title: 'Public Trust',
      description: 'Build confidence through transparent processes and communication.'
    },
    {
      icon: <LineChart size={20} />,
      title: 'Strategic Insights',
      description: 'Gain data-driven insights for better urban planning and management.'
    },
    {
      icon: <DollarSign size={20} />,
      title: 'Cost Reduction',
      description: 'Lower costs of verification and issue management through our platform.'
    }
  ];

  return (
    <Section bgColor="bg-teal-700 text-white">
      <SectionHeading
        title="Benefits for Everyone"
        subtitle="Swachh Bandhu delivers significant value to both citizens and municipal authorities."
        centered
        light
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        <div>
          <motion.h3 
            className="text-2xl font-semibold mb-6 flex items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Users className="mr-2" size={24} />
            For Citizens
          </motion.h3>
          <div className="space-y-6">
            {citizenBenefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="flex gap-4 bg-teal-600 rounded-lg p-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center min-w-10 h-10 rounded-full bg-teal-100 text-teal-700">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">{benefit.title}</h4>
                  <p className="text-teal-100">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <motion.h3 
            className="text-2xl font-semibold mb-6 flex items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ChartBar className="mr-2" size={24} />
            For Municipalities
          </motion.h3>
          <div className="space-y-6">
            {municipalityBenefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="flex gap-4 bg-teal-600 rounded-lg p-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center min-w-10 h-10 rounded-full bg-teal-100 text-teal-700">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">{benefit.title}</h4>
                  <p className="text-teal-100">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default BenefitsSection;