import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Lock, Clock, BarChart3,
  DollarSign, CheckCircle, ArrowRight
} from 'lucide-react';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

const MunicipalitiesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'For Municipalities - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  const benefits = [
    {
      icon: <Lock size={24} />,
      title: 'Verified Data',
      description: 'Only receive reports that have been community-verified, eliminating false reports and wasted resources.'
    },
    {
      icon: <Clock size={24} />,
      title: 'Operational Efficiency',
      description: 'Reduce the cost and time of issue verification while improving response prioritization and resource allocation.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Strategic Insights',
      description: 'Gain data-driven insights into civic issue patterns for better urban planning and proactive management.'
    },
    {
      icon: <DollarSign size={24} />,
      title: 'Cost Reduction',
      description: 'Significantly lower the costs of civic issue management through our efficient verification and reporting system.'
    }
  ];

  const dashboardFeatures = [
    'Real-time issue tracking and management',
    'Verified issue heat maps and trend analysis',
    'Resource allocation optimization tools',
    'Citizen engagement metrics and reporting',
    'Performance analytics and KPI tracking',
    'Customizable workflows and automation',
    'Integration with existing municipal systems'
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <Section bgColor="bg-teal-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="flex items-center justify-center w-20 h-20 rounded-full bg-white text-teal-600 mx-auto mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Building2 size={40} />
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            For Municipalities
          </motion.h1>
          <motion.p
            className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Transform civic issue management with verified data, increased efficiency, and powerful insights.
          </motion.p>
        </div>
      </Section>

      {/* Benefits Section */}
      <Section>
        <SectionHeading
          title="Benefits for Municipalities"
          subtitle="How Swachh Bandhu delivers significant value to urban local bodies"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {benefits.map((benefit, index) => (
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
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
              </div>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Dashboard Preview */}
      <Section bgColor="">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionHeading
              title="Powerful Municipal Dashboard"
              subtitle="Make data-driven decisions with our comprehensive administrative interface"
            />

            <ul className="mt-6 space-y-3">
              {dashboardFeatures.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                >
                  <CheckCircle className="flex-shrink-0 text-teal-600 mt-1 mr-2" size={20} />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                variant="primary"
                size="lg"
                href="#contact"
              >
                Request a Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white rounded-xl overflow-hidden border-8 border-white">
              <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stop-color="rgba(120, 255, 255, 1)" />
                    <stop offset="60%" stop-color="rgba(0, 220, 220, 0.9)" />
                    <stop offset="100%" stop-color="rgba(0, 180, 180, 0.6)" />
                  </radialGradient>
                </defs>

                <g id="background-stars">
                  <circle cx="50" cy="70" r="1.5" fill="rgba(150, 220, 220, 0.3)">
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="6s" repeatCount="indefinite" begin="-0.5s" />
                  </circle>
                  <circle cx="350" cy="100" r="1" fill="rgba(150, 220, 220, 0.25)">
                    <animate attributeName="opacity" values="0.25;0.6;0.25" dur="7s" repeatCount="indefinite" begin="-1.5s" />
                  </circle>
                  <circle cx="120" cy="250" r="1.2" fill="rgba(150, 220, 220, 0.35)">
                    <animate attributeName="opacity" values="0.35;0.8;0.35" dur="5s" repeatCount="indefinite" begin="-2.5s" />
                  </circle>
                  <circle cx="280" cy="50" r="1" fill="rgba(150, 220, 220, 0.2)">
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="180" cy="180" r="0.8" fill="rgba(150, 220, 220, 0.25)">
                    <animate attributeName="opacity" values="0.25;0.7;0.25" dur="6.5s" repeatCount="indefinite" begin="-3.5s" />
                  </circle>
                  <circle cx="320" cy="230" r="1.3" fill="rgba(150, 220, 220, 0.3)">
                    <animate attributeName="opacity" values="0.3;0.75;0.3" dur="7.5s" repeatCount="indefinite" begin="-4.5s" />
                  </circle>
                  <circle cx="90" cy="150" r="1.1" fill="rgba(150, 220, 220, 0.28)">
                    <animate attributeName="opacity" values="0.28;0.65;0.28" dur="5.5s" repeatCount="indefinite" begin="-1s" />
                  </circle>
                </g>

                <g id="ripples" filter="url(#glow)">
                  <circle cx="200" cy="150" stroke="rgba(0, 220, 220, 0.7)" stroke-width="2" fill="none">
                    <animate attributeName="r" values="20;140" dur="3.5s" begin="0s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0" dur="3.5s" begin="0s" repeatCount="indefinite" />
                    <animate attributeName="stroke-width" values="2;0.5" dur="3.5s" begin="0s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="200" cy="150" stroke="rgba(0, 200, 200, 0.6)" stroke-width="1.5" fill="none">
                    <animate attributeName="r" values="20;140" dur="3.5s" begin="-1.16s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0" dur="3.5s" begin="-1.16s" repeatCount="indefinite" />
                    <animate attributeName="stroke-width" values="1.5;0.3" dur="3.5s" begin="-1.16s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="200" cy="150" stroke="rgba(0, 180, 180, 0.5)" stroke-width="1" fill="none">
                    <animate attributeName="r" values="20;140" dur="3.5s" begin="-2.32s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0" dur="3.5s" begin="-2.32s" repeatCount="indefinite" />
                    <animate attributeName="stroke-width" values="1;0.1" dur="3.5s" begin="-2.32s" repeatCount="indefinite" />
                  </circle>
                </g>

                <g id="core" transform="translate(200 150)">
                  <circle r="25" fill="url(#coreGradient)" filter="url(#glow)">
                    <animate attributeName="r" values="25;32;25" dur="2.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" />
                  </circle>
                  <circle r="18" fill="rgba(220, 255, 255, 0.95)" opacity="0.8">
                    <animate attributeName="r" values="18;12;18" dur="2.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" />
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" />
                  </circle>
                </g>
              </svg>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Process Section */}
      <Section>
        <SectionHeading
          title="Implementation Process"
          subtitle="A smooth, structured approach to implementing Swachh Bandhu in your municipality"
          centered
        />

        <div className="max-w-3xl mx-auto mt-12">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-teal-200"></div>

            <div className="space-y-12">
              <motion.div
                className="relative flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-lg z-10">
                  1
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Initial Consultation</h3>
                  <p className="text-gray-600 mb-4">
                    We meet with your team to understand your specific needs, challenges, and goals.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-lg z-10">
                  2
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Customization & Configuration</h3>
                  <p className="text-gray-600 mb-4">
                    We tailor the platform to your specific requirements, including integration with existing systems.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-lg z-10">
                  3
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">QR Code Deployment</h3>
                  <p className="text-gray-600 mb-4">
                    Strategic placement of QR codes across your municipality with geo-fencing setup.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-lg z-10">
                  4
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Training & Launch</h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive training for your staff and a coordinated public launch campaign.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-lg z-10">
                  5
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Ongoing Support & Optimization</h3>
                  <p className="text-gray-600 mb-4">
                    Continuous technical support, data analysis, and platform optimization.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* Case Study Section */}
      <Section bgColor="">
        <SectionHeading
          title="Success Stories"
          subtitle="How other municipalities have transformed their civic engagement"
          centered
        />

        <motion.div
          className="bg-white rounded-xl mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Pune Municipal Corporation</h3>
          <p className="text-gray-600 mb-6">
            After implementing Swachh Bandhu, Pune saw a 40% reduction in verification costs and a 60% increase in citizen reporting. The quality of data improved significantly, with false reports dropping by 85%.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-teal-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-teal-600 mb-2">40%</p>
              <p className="text-sm text-gray-600">Cost Reduction</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-teal-600 mb-2">60%</p>
              <p className="text-sm text-gray-600">Increased Reporting</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-teal-600 mb-2">85%</p>
              <p className="text-sm text-gray-600">Fewer False Reports</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="md"
            href="#contact"
            icon={<ArrowRight size={16} />}
          >
            Read Full Case Study
          </Button>
        </motion.div>
      </Section>

      {/* CTA Section */}
      <Section bgColor="bg-teal-700 text-white" id="contact">
        <div className=" mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Transform Your Municipal Operations?
          </motion.h2>
          <motion.p
            className="text-xl text-teal-100 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Contact us today to schedule a demo and learn how Swachh Bandhu can benefit your municipality.
          </motion.p>

          <motion.div
            className="bg-white rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Municipality
                </label>
                <input
                  type="text"
                  id="municipality"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Your municipality"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Tell us about your needs"
                ></textarea>
              </div>
              <div>
                <Button
                  variant="primary"
                  size="full"
                >
                  Request a Demo
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default MunicipalitiesPage;