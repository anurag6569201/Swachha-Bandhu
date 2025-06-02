import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Award, BarChart3, Users, 
  Globe, CheckCircle, ArrowRight, Heart 
} from 'lucide-react';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

const CSRPartnersPage: React.FC = () => {
  useEffect(() => {
    document.title = 'For CSR Partners - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  const benefits = [
    {
      icon: <Globe size={24} />,
      title: 'Transparent Social Impact',
      description: 'Measurable, verifiable community impact with detailed analytics and reporting.'
    },
    {
      icon: <Users size={24} />,
      title: 'Brand Visibility',
      description: 'Showcase your brand to engaged citizens through rewards, recognition, and in-app presence.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Detailed Impact Metrics',
      description: "Access comprehensive analytics on your CSR investment\'s community impact."
    },
    {
      icon: <Heart size={24} />,
      title: 'Community Goodwill',
      description: 'Build positive relationships with communities by supporting civic improvement.'
    }
  ];

  const partnershipOptions = [
    {
      title: 'Rewards Sponsor',
      description: 'Provide rewards for citizen engagement, from digital vouchers to branded merchandise.',
      examples: ['Retail discounts', 'Digital subscriptions', 'Branded merchandise']
    },
    {
      title: 'Impact Partner',
      description: 'Fund specific civic improvement initiatives in targeted neighborhoods or communities.',
      examples: ['Park renovations', 'Cleanliness drives', 'Infrastructure improvements']
    },
    {
      title: 'Technology Enabler',
      description: 'Support the technological infrastructure needed for effective civic engagement.',
      examples: ['QR code deployment', 'Digital literacy workshops', 'Platform expansion']
    }
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
            <Briefcase size={40} />
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            For CSR Partners
          </motion.h1>
          <motion.p 
            className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Drive meaningful social impact through transparent, measurable civic engagement initiatives.
          </motion.p>
        </div>
      </Section>

      {/* Benefits Section */}
      <Section>
        <SectionHeading
          title="Benefits of Partnership"
          subtitle="How Swachh Bandhu delivers value to corporate social responsibility initiatives"
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
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mr-3">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
              </div>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Impact Visualization */}
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
              title="Visualize Your Impact"
              subtitle="Track and showcase your CSR initiatives with comprehensive analytics"
            />

            <p className="text-gray-600 mb-6">
              Our partner dashboard provides real-time metrics on how your CSR investments are making a difference in communities.
            </p>

            <ul className="space-y-3 mb-8">
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <CheckCircle className="flex-shrink-0 text-amber-600 mt-1 mr-2" size={20} />
                <span>Track engagement metrics from citizens interacting with your brand</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CheckCircle className="flex-shrink-0 text-amber-600 mt-1 mr-2" size={20} />
                <span>Measure the direct impact of your sponsored rewards and initiatives</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <CheckCircle className="flex-shrink-0 text-amber-600 mt-1 mr-2" size={20} />
                <span>Generate CSR reports with verified data for stakeholders</span>
              </motion.li>
            </ul>

            <Button 
              variant="primary" 
              size="lg"
              href="#contact"
            >
              Partner With Us
            </Button>
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
    <filter id="csrGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <radialGradient id="csrCoreGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="rgba(251, 191, 36, 1)" /> <stop offset="60%" stop-color="rgba(217, 119, 6, 0.95)" /> <stop offset="100%" stop-color="rgba(180, 83, 9, 0.8)" /> </radialGradient>
    <radialGradient id="rippleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="rgba(253, 230, 138, 0.7)" /> <stop offset="70%" stop-color="rgba(251, 191, 36, 0.3)" /> <stop offset="100%" stop-color="rgba(251, 191, 36, 0)" /> </radialGradient>
  </defs>

  <g id="community-nodes">
    <circle cx="60" cy="80" r="4.5" fill="rgba(180, 83, 9, 0.35)">
      <animate attributeName="opacity" values="0.35;0.6;0.35" dur="4.2s" repeatCount="indefinite" begin="-0.5s"/>
      <animate attributeName="r" values="4.5;5.5;4.5" dur="4.2s" repeatCount="indefinite" begin="-0.5s"/>
    </circle>
    <circle cx="330" cy="60" r="4" fill="rgba(180, 83, 9, 0.3)">
      <animate attributeName="opacity" values="0.3;0.55;0.3" dur="5.1s" repeatCount="indefinite" begin="-1.2s"/>
      <animate attributeName="r" values="4;5;4" dur="5.1s" repeatCount="indefinite" begin="-1.2s"/>
    </circle>
    <circle cx="100" cy="240" r="5" fill="rgba(180, 83, 9, 0.4)">
       <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4.6s" repeatCount="indefinite" begin="-2.5s"/>
       <animate attributeName="r" values="5;6;5" dur="4.6s" repeatCount="indefinite" begin="-2.5s"/>
    </circle>
    <circle cx="300" cy="220" r="3.5" fill="rgba(180, 83, 9, 0.25)">
       <animate attributeName="opacity" values="0.25;0.45;0.25" dur="5.8s" repeatCount="indefinite" />
       <animate attributeName="r" values="3.5;4.5;3.5" dur="5.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="150" cy="40" r="4.2" fill="rgba(180, 83, 9, 0.32)">
       <animate attributeName="opacity" values="0.32;0.6;0.32" dur="5.3s" repeatCount="indefinite" begin="-0.8s"/>
       <animate attributeName="r" values="4.2;5.2;4.2" dur="5.3s" repeatCount="indefinite" begin="-0.8s"/>
    </circle>
     <circle cx="250" cy="260" r="4.8" fill="rgba(180, 83, 9, 0.38)">
       <animate attributeName="opacity" values="0.38;0.65;0.38" dur="4.9s" repeatCount="indefinite" begin="-2.1s"/>
       <animate attributeName="r" values="4.8;5.8;4.8" dur="4.9s" repeatCount="indefinite" begin="-2.1s"/>
    </circle>
     <circle cx="35" cy="180" r="3.7" fill="rgba(180, 83, 9, 0.28)">
       <animate attributeName="opacity" values="0.28;0.5;0.28" dur="5.5s" repeatCount="indefinite" begin="-3.5s"/>
       <animate attributeName="r" values="3.7;4.7;3.7" dur="5.5s" repeatCount="indefinite" begin="-3.5s"/>
    </circle>
  </g>

  <g id="impact-ripples">
    <circle cx="200" cy="150" fill="url(#rippleGradient)" opacity="0" filter="url(#csrGlow)">
      <animate attributeName="r" values="20;170" dur="4s" begin="0s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0.3;0" dur="4s" begin="0s" repeatCount="indefinite" />
    </circle>
    <circle cx="200" cy="150" fill="url(#rippleGradient)" opacity="0" filter="url(#csrGlow)">
      <animate attributeName="r" values="20;170" dur="4s" begin="-1.33s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0.3;0" dur="4s" begin="-1.33s" repeatCount="indefinite" />
    </circle>
    <circle cx="200" cy="150" fill="url(#rippleGradient)" opacity="0" filter="url(#csrGlow)">
      <animate attributeName="r" values="20;170" dur="4s" begin="-2.66s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0.3;0" dur="4s" begin="-2.66s" repeatCount="indefinite" />
    </circle>
  </g>

  <g id="csr-core" transform="translate(200 150)">
    <circle r="30" fill="url(#csrCoreGradient)" filter="url(#csrGlow)">
      <animate attributeName="r" values="30;38;30" dur="3.2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
    </circle>
    <circle r="22" fill="rgba(254, 243, 199, 0.95)" opacity="0.9"> <animate attributeName="r" values="22;16;22" dur="3.2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
       <animate attributeName="opacity" values="0.9;1;0.9" dur="3.2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
    </circle>
  </g>
</svg>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Partnership Options */}
      <Section>
        <SectionHeading
          title="Partnership Options"
          subtitle="Flexible ways to engage with communities through Swachh Bandhu"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {partnershipOptions.map((option, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">{option.title}</h3>
              <p className="text-gray-600 mb-6 text-center">{option.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium mb-2 text-gray-700">Examples:</p>
                <ul className="space-y-1">
                  {option.examples.map((example, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      <span className="text-gray-600">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Success Story */}
      <Section bgColor="">
        <SectionHeading
          title="Partner Success Story"
          subtitle="How our CSR partners are making a difference"
          centered
        />

        <motion.div 
          className="bg-white rounded-xl mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              <span className="text-gray-500 font-bold text-lg">TC</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">TechCorp Foundation</h3>
              <p className="text-gray-500">Technology CSR Partner</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            "As a technology company committed to social impact, partnering with Swachh Bandhu allowed us to directly engage with communities. Our sponsored rewards program increased citizen participation by 75% in target neighborhoods, while providing us with transparent metrics for our CSR reporting."
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-amber-600 mb-2">75%</p>
              <p className="text-sm text-gray-600">Increased Participation</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-amber-600 mb-2">3,200+</p>
              <p className="text-sm text-gray-600">Rewards Distributed</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-amber-600 mb-2">92%</p>
              <p className="text-sm text-gray-600">Positive Brand Association</p>
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
        <div className="mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Partner With Us Today
          </motion.h2>
          <motion.p 
            className="text-xl text-teal-100 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Contact our partnerships team to explore how your organization can make a meaningful impact through Swachh Bandhu.
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
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Your company"
                />
              </div>
              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Partnership Interest
                </label>
                <select
                  id="interest"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select your interest</option>
                  <option value="rewards">Rewards Sponsor</option>
                  <option value="impact">Impact Partner</option>
                  <option value="technology">Technology Enabler</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Tell us about your CSR goals"
                ></textarea>
              </div>
              <div>
                <Button 
                  variant="primary" 
                  size="full"
                >
                  Submit Inquiry
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default CSRPartnersPage;