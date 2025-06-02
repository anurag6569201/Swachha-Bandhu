import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, LineChart } from 'lucide-react';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';
import TestimonialCard from '../components/ui/TestimonialCard';

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About Us - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  const successStories = [
    {
      quote: "After implementing Swachh Bandhu, our municipality saw a 40% increase in verified reports and 30% faster resolution times.",
      name: "Pune Municipal Corporation",
      role: "Municipal Partner",
      delay: 0
    },
    {
      quote: "The gamification elements helped us increase citizen participation by over 200% in just three months.",
      name: "Bangalore Urban Local Body",
      role: "Municipal Partner",
      delay: 0.1
    },
    {
      quote: "As a CSR partner, we've been able to directly measure our impact and engage with communities in a meaningful way.",
      name: "Green Future Foundation",
      role: "CSR Partner",
      delay: 0.2
    }
  ];

  return (
    <div className="pt-20">
      {/* Mission & Vision */}
      <Section bgColor="bg-teal-700 text-white">
        <div className="mx-auto">
          <SectionHeading
            title="Our Mission & Vision"
            subtitle="Transforming civic engagement through technology, trust, and community action."
            centered
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <motion.div 
              className="bg-teal-600 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-teal-600 mr-4">
                  <Target size={24} />
                </div>
                <h3 className="text-2xl font-semibold">Mission</h3>
              </div>
              <p className="text-teal-100">
                To empower citizens and local governments with a trusted platform for reporting, verifying, and resolving civic issues, fostering collaborative community improvement.
              </p>
            </motion.div>

            <motion.div 
              className="bg-teal-600 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-teal-600 mr-4">
                  <LineChart size={24} />
                </div>
                <h3 className="text-2xl font-semibold">Vision</h3>
              </div>
              <p className="text-teal-100">
                A world where every citizen is an active participant in urban governance, where civic reporting is trusted and efficient, and where data drives better decisions for sustainable communities.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Why Now */}
      <Section>
        <div className="mx-auto">
          <SectionHeading
            title="Why Now?"
            subtitle="The perfect convergence of technology, need, and opportunity"
            centered
          />

          <motion.div 
            className="mt-12 bg-gray-50 rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg mb-6">
              As urbanization accelerates across India and the world, the need for efficient civic management has never been greater. At the same time, several factors have created the perfect opportunity for Swachh Bandhu:
            </p>

            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 mt-1 mr-3">
                  <span className="text-sm font-bold">1</span>
                </div>
                <p><strong>Digital India:</strong> Widespread smartphone adoption and internet penetration have created the technical foundation for a mobile-first platform.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 mt-1 mr-3">
                  <span className="text-sm font-bold">2</span>
                </div>
                <p><strong>Government Modernization:</strong> Municipal bodies are actively seeking technological solutions to improve service delivery and citizen engagement.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 mt-1 mr-3">
                  <span className="text-sm font-bold">3</span>
                </div>
                <p><strong>CSR Evolution:</strong> Companies increasingly seek transparent, measurable social impact opportunities aligned with government initiatives.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 mt-1 mr-3">
                  <span className="text-sm font-bold">4</span>
                </div>
                <p><strong>Citizen Expectations:</strong> People expect efficient, transparent civic services and meaningful participation in governance.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 mt-1 mr-3">
                  <span className="text-sm font-bold">5</span>
                </div>
                <p><strong>Technological Maturity:</strong> QR codes, geo-fencing, and gamification have reached mainstream adoption, enabling our verification and engagement model.</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </Section>

      {/* Our Team */}
      <Section bgColor="">
        <SectionHeading
          title="Our Team"
          subtitle="A passionate group of technologists, urban planners, and civic engagement experts"
          centered
        />

        <div className="flex gap-8 mt-12 mx-auto" >
          <motion.div 
            className="bg-gray-50 rounded-xl shadow-sm p-6 text-center col-start-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Amit Patel</h3>
            <p className="text-gray-500 mb-4">Co-Founder & CEO</p>
            <p className="text-gray-600">
              Former urban planner with 15+ years experience in smart city initiatives across India.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gray-50 rounded-xl shadow-sm p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Priya Sharma</h3>
            <p className="text-gray-500 mb-4">Co-Founder & CTO</p>
            <p className="text-gray-600">
              Tech leader with background in mobile platforms and geospatial technologies.
            </p>
          </motion.div>

        </div>
      </Section>

      {/* Success Stories */}
      <Section id="success-stories">
        <SectionHeading
          title="Success Stories"
          subtitle="Real impact in communities across India"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mx-auto">
          {successStories.map((story, index) => (
            <TestimonialCard
              key={index}
              quote={story.quote}
              name={story.name}
              role={story.role}
              delay={story.delay}
            />
          ))}
        </div>
      </Section>
    </div>
  );
};

export default AboutPage;