import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, MapPin, CheckCircle, Trophy, FileCheck } from 'lucide-react';
import Section from '../ui/Section';
import SectionHeading from '../ui/SectionHeading';
import StepCard from '../ui/StepCard';
import Button from '../ui/Button';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: <QrCode size={20} />,
      title: 'Scan QR Code',
      description: 'Find and scan a QR code located at public spaces to initiate a report for that specific location.'
    },
    {
      number: 2,
      icon: <MapPin size={20} />,
      title: 'Submit Report',
      description: "Add details and photos of the issue. Geo-fencing ensures you're physically present at the location."
    },
    {
      number: 3,
      icon: <CheckCircle size={20} />,
      title: 'Community Verification',
      description: 'Other citizens in the area verify your report, creating a trusted layer of validation.'
    },
    {
      number: 4,
      icon: <Trophy size={20} />,
      title: 'Earn Points & Rewards',
      description: 'Gain points for reporting and verifying. Climb leaderboards and earn rewards for your civic participation.'
    },
    {
      number: 5,
      icon: <FileCheck size={20} />,
      title: 'Track Resolution',
      description: 'Follow the progress as municipal authorities address the issue, with transparent status updates.'
    }
  ];

  return (
    <Section bgColor="">
      <SectionHeading
        title="How Swachh Bandhu Works"
        subtitle="Our innovative process ensures accurate reporting, community verification, and transparent resolution tracking."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            number={step.number}
            icon={step.icon}
            title={step.title}
            description={step.description}
            delay={index * 0.1}
          />
        ))}
      </div>

      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button 
          variant="primary" 
          size="lg"
          href="/how-it-works"
        >
          Learn More About The Process
        </Button>
      </motion.div>
    </Section>
  );
};

export default HowItWorksSection;
