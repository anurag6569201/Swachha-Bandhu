import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  useEffect(() => {
    document.title = 'FAQ - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems: FaqItem[] = [
    {
      question: 'What is Swachh Bandhu?',
      answer: 'Swachh Bandhu is a mobile-first civic issue reporting platform that uses QR codes, geo-fencing, community verification, and gamification to create a trusted system for citizens to report and track civic issues in their communities.',
      category: 'general'
    },
    {
      question: 'How does the verification system work?',
      answer: 'Our verification system works in two layers: First, location verification through QR codes and geo-fencing ensures reports are submitted from the actual location. Second, community verification allows other nearby users to confirm the reported issue, creating a trusted consensus.',
      category: 'reporting'
    },
    {
      question: 'Is the app free to download and use?',
      answer: 'Yes, Swachh Bandhu is completely free for citizens to download and use. The platform is funded through municipal partnerships and CSR initiatives, ensuring there are no costs to citizens.',
      category: 'general'
    },
    {
      question: 'How do I earn points and rewards?',
      answer: 'You earn points by reporting issues, verifying other users\' reports, achieving milestones, and consistent participation. These points can be redeemed for rewards from our CSR partners, ranging from digital vouchers to merchandise.',
      category: 'rewards'
    },
    {
      question: 'What types of issues can I report?',
      answer: 'You can report a wide range of civic issues including garbage collection problems, road maintenance issues, water supply disruptions, street light outages, public facility damages, and more. The specific categories may vary based on your municipality\'s implementation.',
      category: 'reporting'
    },
    {
      question: 'How do municipalities implement Swachh Bandhu?',
      answer: 'Municipalities go through a structured implementation process that includes initial consultation, platform customization, QR code deployment across the city, staff training, and a coordinated public launch. We provide ongoing support throughout this process.',
      category: 'municipalities'
    },
    {
      question: 'How can I become a CSR partner?',
      answer: 'Organizations interested in CSR partnerships can contact our partnerships team through the form on our "For CSR Partners" page. We offer flexible partnership options including rewards sponsorship, impact partnerships, and technology enablement.',
      category: 'partners'
    },
    {
      question: 'What happens after I submit a report?',
      answer: 'After submission, your report is sent for community verification where other users in the area can confirm it. Once verified, it is forwarded to the relevant municipal department for action. You can track the status of your report through the app at every stage.',
      category: 'reporting'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we take data privacy very seriously. Your personal information is protected with enterprise-grade security measures. We only share the minimum necessary information with municipalities for issue resolution, and never share your personal details with third parties without consent.',
      category: 'general'
    },
    {
      question: 'How can I verify other users\' reports?',
      answer: 'When you are near a reported issue that needs verification, you\'ll receive a notification. You can then visit the location, check the issue, and confirm or flag the report based on what you observe. Each verification contributes to your points and community standing.',
      category: 'reporting'
    }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'general', name: 'General' },
    { id: 'reporting', name: 'Reporting' },
    { id: 'rewards', name: 'Rewards' },
    { id: 'municipalities', name: 'For Municipalities' },
    { id: 'partners', name: 'For Partners' }
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
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Find answers to common questions about Swachh Bandhu.
          </motion.p>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <button
                  className="flex justify-between items-center w-full p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  {activeIndex === index ? (
                    <ChevronUp className="flex-shrink-0 text-teal-600" size={20} />
                  ) : (
                    <ChevronDown className="flex-shrink-0 text-gray-400" size={20} />
                  )}
                </button>
                
                {activeIndex === index && (
                  <motion.div
                    className="p-5 bg-gray-50 border-t border-gray-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Still Have Questions */}
      <Section bgColor="bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            title="Still Have Questions?"
            subtitle="Our team is here to help you with any other questions you might have."
            centered
          />

          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="primary" 
              size="lg"
              href="/contact"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default FAQPage;