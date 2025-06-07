import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, MapPin, Users, Trophy, 
  BarChart3, Bell, Lock, Clock 
} from 'lucide-react';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

const FeaturesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Features - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  const citizenFeatures = [
    {
      icon: <QrCode size={24} />,
      title: 'QR Code Reporting',
      description: 'Scan location-specific QR codes for precise, hyperlocal issue reporting.'
    },
    {
      icon: <MapPin size={24} />,
      title: 'GPS-Based Geo-Fencing',
      description: 'Submit reports only when physically present at the issue location, ensuring data reliability.'
    },
    {
      icon: <Users size={24} />,
      title: 'Community Verification',
      description: 'Other citizens verify your reports, creating a trusted consensus-based validation system.'
    },
    {
      icon: <Trophy size={24} />,
      title: 'Points & Rewards',
      description: 'Earn points for reporting and verifying issues, redeem for rewards from CSR partners.'
    },
    {
      icon: <Bell size={24} />,
      title: 'Issue Notifications',
      description: 'Receive alerts for nearby issues that need verification and updates on your submitted reports.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Personal Impact Dashboard',
      description: 'Track your civic contributions, points earned, and community impact over time.'
    }
  ];

  const municipalityFeatures = [
    {
      icon: <Lock size={24} />,
      title: 'Verified Data Stream',
      description: 'Receive only community-verified reports, drastically reducing false positives and resource waste.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Analytics Dashboard',
      description: 'Gain insights into issue trends, resolution times, and resource allocation efficiency.'
    },
    {
      icon: <Clock size={24} />,
      title: 'Workflow Management',
      description: 'Assign, track, and manage issue resolution with streamlined workflows and automated updates.'
    },
    {
      icon: <Users size={24} />,
      title: 'Citizen Engagement Metrics',
      description: 'Measure community participation and identify your most active civic contributors.'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <Section bgColor="bg-teal-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Features
          </motion.h1>
          <motion.p 
            className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Discover the innovative technologies and systems that power Swachh Bandhu's trusted civic reporting platform.
          </motion.p>
        </div>
      </Section>

      {/* Citizen Features */}
      <Section>
        <SectionHeading
          title="For Citizens"
          subtitle="Features that empower you to make a difference in your community"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {citizenFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mr-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            variant="primary" 
            size="lg"
            href="#download"
          >
            Download The App
          </Button>
        </motion.div>
      </Section>

      {/* Municipality Features */}
      <Section bgColor="">
        <SectionHeading
          title="For Municipalities"
          subtitle="Tools that transform civic management with verified data and actionable insights"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {municipalityFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mr-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button 
            variant="primary" 
            size="lg"
            href="/for-municipalities"
          >
            Learn More For Municipalities
          </Button>
        </motion.div>
      </Section>

      {/* Technology Highlights */}
      <Section>
        <SectionHeading
          title="Technology Highlights"
          subtitle="The innovative systems that make Swachh Bandhu unique"
          centered
        />

        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-gray-50 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4">Dual-Layer Verification</h3>
              <p className="text-gray-600">
                Our platform combines location-based verification (QR + geo-fencing) with community consensus verification to create highly reliable civic data.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-50 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4">Behavioral Economics</h3>
              <p className="text-gray-600">
                Our LeaderboardPage system applies principles of behavioral economics to maximize civic participation and create sustainable engagement.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-50 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4">Real-Time Processing</h3>
              <p className="text-gray-600">
                Issues are reported, verified, and routed to appropriate authorities in real-time, drastically reducing the time from identification to resolution.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-50 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4">Data Security</h3>
              <p className="text-gray-600">
                All personal and civic data is protected with enterprise-grade security, ensuring privacy while enabling necessary information sharing.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section bgColor="bg-teal-700 text-white" id="download">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Experience These Features Yourself
          </motion.h2>
          <motion.p 
            className="text-xl text-teal-100 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Download the Swachh Bandhu app today and start making a real impact in your community.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              variant="secondary" 
              size="lg"
              external
              href="https://play.google.com/store"
            >
              Google Play
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              external
              href="https://apps.apple.com"
            >
              App Store
            </Button>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default FeaturesPage;