import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, MapPin, Users, Trophy } from 'lucide-react';
import Section from '../ui/Section';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';

const FeaturesHighlightSection: React.FC = () => {
  const features = [
    {
      icon: <QrCode size={32} />,
      title: 'Hyperlocal QR Reporting',
      description: 'Location-specific QR codes enable precise reporting and issue tracking.',
      color: 'bg-amber-100 text-amber-600',
      delay: 0
    },
    {
      icon: <MapPin size={32} />,
      title: 'GPS-Based Geo-Fencing',
      description: 'Ensures reporters are physically present, increasing data reliability.',
      color: 'bg-teal-100 text-teal-600',
      delay: 0.1
    },
    {
      icon: <Users size={32} />,
      title: 'Peer Verification',
      description: 'Community members validate reports, creating a trusted system.',
      color: 'bg-blue-100 text-blue-600',
      delay: 0.2
    },
    {
      icon: <Trophy size={32} />,
      title: 'LeaderboardPage & Rewards',
      description: 'Points, leaderboards, and rewards drive engagement and participation.',
      color: 'bg-purple-100 text-purple-600',
      delay: 0.3
    }
  ];

  return (
    <Section>
      <SectionHeading
        title="Core Features That Make Us Different"
        subtitle="Our unique combination of technologies creates a trusted, engaging platform for civic reporting."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: feature.delay }}
          >
            <div className={`flex items-center justify-center w-16 h-16 rounded-full ${feature.color} mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-6">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button 
          variant="primary" 
          size="lg"
          href="/features"
        >
          Explore All Features
        </Button>
      </motion.div>
    </Section>
  );
};

export default FeaturesHighlightSection;