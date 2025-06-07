import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import ProblemSection from '../components/home/ProblemSection';
import SolutionSection from '../components/home/SolutionSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import BenefitsSection from '../components/home/BenefitsSection';
import FeaturesHighlightSection from '../components/home/FeaturesHighlightSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Swachh Bandhu - Civic Issue Reporting Platform';
  }, []);

  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      {/* Add the leaderboard button section */}
      <Section className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            href="/app/leaderboard"
            icon={<Trophy size={20} />}
            className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            View Leaderboard
          </Button>
        </motion.div>
      </Section>
      <HowItWorksSection />
      <BenefitsSection />
      <FeaturesHighlightSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default HomePage;