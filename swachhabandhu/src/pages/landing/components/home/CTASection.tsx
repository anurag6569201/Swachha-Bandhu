import React from 'react';
import { motion } from 'framer-motion';
import { Download, Building2, Briefcase } from 'lucide-react';
import Section from '../ui/Section';
import Button from '../ui/Button';

const CTASection: React.FC = () => {
  return (
    <Section bgColor="bg-teal-700 text-white" id="download">
      <div className="mx-auto text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to Transform Civic Engagement?
        </motion.h2>
        <motion.p 
          className="text-xl text-teal-100 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Join the growing community of citizens, municipalities, and organizations working together to build better cities.
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-teal-600 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-teal-600 mx-auto mb-4">
              <Download size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-4">For Citizens</h3>
            <p className="text-teal-100 mb-6">Download the app and start making a difference in your community today.</p>
            <div className="flex flex-col gap-3">
              <Button 
                variant="secondary" 
                size="md"
                external
                href="https://play.google.com/store"
              >
                Google Play
              </Button>
            </div>
          </div>

          <div className="bg-teal-600 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-teal-600 mx-auto mb-4">
              <Building2 size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-4">For Municipalities</h3>
            <p className="text-teal-100 mb-6">Learn how Swachh Bandhu can improve your urban management and citizen engagement.</p>
            <Button 
              variant="secondary" 
              size="md"
              href="/for-municipalities"
            >
              Learn More
            </Button>
          </div>

          <div className="bg-teal-600 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-teal-600 mx-auto mb-4">
              <Briefcase size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-4">For CSR Partners</h3>
            <p className="text-teal-100 mb-6">Discover how your organization can make a transparent social impact through our platform.</p>
            <Button 
              variant="secondary" 
              size="md"
              href="/for-csr-partners"
            >
              Partner With Us
            </Button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default CTASection;