import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import Section from '../components/ui/Section'; 
import SectionHeading from '../components/ui/SectionHeading'; 
import Button from '../components/ui/Button'; 

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found | Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mt-20 min-h-screen flex flex-col">
      <Section 
        bgColor="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800" 
        className="flex-grow flex items-center justify-center py-12 text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-lg mx-auto"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 text-white mb-8">
              <AlertTriangle size={60} />
            </div>
            
            <SectionHeading
              title="404 - Page Not Found"
              subtitle="Oops! The page you are looking for does not exist or may have been moved."
              centered
              light

            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="mb-8 text-lg text-gray-100">
                It seems you've taken a wrong turn. Don't worry, it happens to the best of us.
              </p>
              <Link to="/">
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Home size={20} />}
                  iconPosition="left"
                  className=""
                >
                  Go Back to Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default NotFoundPage;