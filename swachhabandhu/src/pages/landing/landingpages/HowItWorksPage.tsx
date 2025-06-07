import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, MapPin, CheckCircle, Trophy, FileCheck, Search, Bell, BarChart3 } from 'lucide-react';
import Section from '../components/ui/Section'; // Assuming these components are correctly set up
import SectionHeading from '../components/ui/SectionHeading'; // Assuming these components are correctly set up
import Button from '../components/ui/Button'; // Assuming these components are correctly set up

const HowItWorksPage: React.FC = () => {
  useEffect(() => {
    document.title = 'How It Works - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  const citizenProcess = [
    {
      icon: <QrCode size={28} />, // Icon size increased
      title: 'Find & Scan QR Code',
      description: 'Locate a Swachh Bandhu QR code in public spaces like parks, streets, or government buildings. Each code is unique to that location.',
    },
    {
      icon: <MapPin size={28} />,
      title: 'Submit Your Report',
      description: 'The app automatically captures your location and confirms you\'re within the geo-fence. Add details, select issue type, and upload photos of the problem.',
    },
    {
      icon: <CheckCircle size={28} />,
      title: 'Community Verification',
      description: 'Other citizens in the area will receive notification to verify your report. They can confirm or flag the report based on what they observe.',
    },
    {
      icon: <Trophy size={28} />,
      title: 'Earn Points & Rewards',
      description: 'Gain points for each report submitted and verified. Additional points for verifying others\' reports. Climb leaderboards and earn rewards.',
    },
    {
      icon: <FileCheck size={28} />,
      title: 'Track Resolution Progress',
      description: 'Follow your report as it moves through the resolution process. Receive updates when municipal authorities review, assign, and resolve the issue.',
    }
  ];

  const municipalityProcess = [
    {
      icon: <Bell size={24} />,
      title: 'Receive Verified Reports',
      description: 'Your dashboard displays new reports that have been verified by multiple community members, ensuring data reliability.'
    },
    {
      icon: <Search size={24} />,
      title: 'Review & Prioritize',
      description: 'Analyze reports with confidence, knowing they\'ve been community-verified. Filter by area, issue type, or urgency.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Track Performance Metrics',
      description: 'Monitor resolution times, community satisfaction rates, and operational efficiency through real-time analytics.'
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
            How Swachh Bandhu Works
          </motion.h1>
          <motion.p
            className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Our innovative platform connects citizens, communities, and municipalities through a transparent, verified reporting process.
          </motion.p>
        </div>
      </Section>

      {/* Citizen Process */}
      <Section>
  <SectionHeading
    title="The Citizen Experience"
    subtitle="A simple, rewarding process for reporting and tracking civic issues"
    centered
  />

  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
    {citizenProcess.map((step, index) => (
      <motion.div
        key={index}
        className={`relative bg-white p-6 md:p-8 rounded-xl shadow-xl overflow-hidden ${
          index === 4 ? 'md:col-span-2' : ''
        }`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
      >
        {/* Decorative Accent */}
        <div className="absolute -top-5 -left-5 w-24 h-24 bg-teal-500/10 rounded-full hidden md:block transform rotate-12 -z-0"></div>

        {/* Step Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-teal-700 bg-teal-100 rounded-full z-10">
          STEP {index + 1}
        </div>

        <div className="relative z-0 pt-10 md:pt-6">
          <div className="flex flex-col sm:flex-row items-start mb-4">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 text-teal-600 mr-0 sm:mr-5 mb-3 sm:mb-0">
              {step.icon}
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mt-1 sm:mt-0">{step.title}</h3>
          </div>
          <p className="text-md md:text-lg text-gray-600 leading-relaxed sm:pl-0">
            {step.description}
          </p>

          {index === citizenProcess.length - 1 && (
            <div className="mt-6">
              <Button
                variant="primary"
                size="md"
                href="#download"
              >
                Try It Yourself
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    ))}
  </div>
</Section>


      {/* Municipality Process */}
      <Section bgColor="">
        <SectionHeading
          title="The Municipality Experience"
          subtitle="Efficient management of civic issues with reliable, verified data"
          centered
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {municipalityProcess.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mr-3">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </div>
              <p className="text-gray-600">{step.description}</p>
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

      {/* Technology Behind */}
      <Section>
        <SectionHeading
          title="The Technology Behind Swachh Bandhu"
          subtitle="Innovative systems working together to ensure trust and engagement"
          centered
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ... Technology cards remain the same ... */}
          <motion.div 
            className="bg-gray-50 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-4">QR & Geo-Fencing System</h3>
            <p className="text-gray-600 mb-4">
              Our QR codes are uniquely linked to specific locations. When scanned, the app verifies that you are physically within the geo-fenced area before allowing a report submission.
            </p>
            <p className="text-gray-600">
              This two-layer location verification ensures that reports are only submitted by people actually present at the location, eliminating false or remote reporting.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gray-50 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4">Peer Verification Protocol</h3>
            <p className="text-gray-600 mb-4">
              When a report is submitted, nearby users are notified to verify the issue. Multiple verifications from different users create a trusted consensus.
            </p>
            <p className="text-gray-600">
              This community-based approach eliminates the need for municipal staff to personally verify every report, saving time and resources while maintaining data quality.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gray-50 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4">LeaderboardPage Engine</h3>
            <p className="text-gray-600 mb-4">
              Our platform rewards civic participation through points, badges, leaderboards, and real-world rewards, creating sustained engagement.
            </p>
            <p className="text-gray-600">
              Users earn points for reporting issues, verifying others\' reports, and achieving milestones. These points can be redeemed for rewards provided by CSR partners.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gray-50 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Both citizens and municipalities have access to powerful analytics dashboards showing civic issue trends, resolution rates, and community impact.
            </p>
            <p className="text-gray-600">
              For municipalities, these insights drive better resource allocation and strategic planning. For citizens, they provide transparency and accountability.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section bgColor="bg-teal-700 text-white" id="download">
        {/* ... CTA Section remains the same ... */}
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Transform Your Community?
          </motion.h2>
          <motion.p 
            className="text-xl text-teal-100 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Download the app today and start making a difference in your neighborhood through verified civic reporting.
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

export default HowItWorksPage;