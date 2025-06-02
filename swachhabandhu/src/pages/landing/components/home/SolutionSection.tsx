import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, MapPin, Users, Trophy, BarChart3 } from 'lucide-react';
import Section from '../ui/Section';
import SectionHeading from '../ui/SectionHeading';
import FeatureCard from '../ui/FeatureCard';
import Button from '../ui/Button';

const SolutionSection: React.FC = () => {
  const features = [
    {
      icon: <QrCode size={24} />,
      title: 'Hyperlocal QR Code Reporting',
      description: 'Scan location-specific QR codes to report issues instantly with precise location data.'
    },
    {
      icon: <MapPin size={24} />,
      title: 'GPS-Based Geo-Fencing',
      description: 'Advanced geo-fencing ensures reports can only be submitted from actual issue locations.'
    },
    {
      icon: <Users size={24} />,
      title: 'Peer Verification Protocol',
      description: 'Community members verify reports, creating a trusted layer of validation.'
    },
    {
      icon: <Trophy size={24} />,
      title: 'Gamification & Rewards',
      description: 'Earn points, climb leaderboards, and win rewards for positive civic participation.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Real-Time Dashboards',
      description: 'Public and administrative dashboards provide transparent insights on civic issues.'
    }
  ];

  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mx-auto mb-12"
      >
        <SectionHeading
          title="Our Solution: Swachh Bandhu"
          centered
          subtitle={
            <>
              <p className="mb-4 text-center">
                Swachh Bandhu revolutionizes civic reporting with a mobile-first platform that ensures accuracy, builds trust, and motivates citizen participation.
              </p>
              <p className='text-center'>
                By combining QR technology, community verification, and gamification, we've created a system that delivers real value to both citizens and municipalities.
              </p>
            </>
          }
        />
        <div className="mt-6">
          <Button variant="primary" size="lg" href="/features">
            Explore All Features
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 0.1}
          />
        ))}
      </motion.div>
    </Section>
  );
};

export default SolutionSection;
