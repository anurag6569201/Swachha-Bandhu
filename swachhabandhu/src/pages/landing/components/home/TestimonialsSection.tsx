import React from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';
import SectionHeading from '../ui/SectionHeading';
import TestimonialCard from '../ui/TestimonialCard';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Since our municipality started using Swachh Bandhu, we've seen a 40% reduction in verification costs and much higher data quality.",
      name: "Rajesh Kumar",
      role: "Municipal Commissioner",
      delay: 0
    },
    {
      quote: "I love how I can contribute to my community and earn rewards at the same time. The verification system makes me feel like my efforts actually matter.",
      name: "Priya Sharma",
      role: "Citizen & Active User",
      delay: 0.1
    },
    {
      quote: "As a CSR partner, we've found Swachh Bandhu to be an effective channel for our social impact initiatives with transparent reporting.",
      name: "Vikram Mehta",
      role: "CSR Director, Tech Solutions Ltd.",
      delay: 0.2
    }
  ];

  return (
    <Section bgColor="">
      <SectionHeading
        title="Trusted by Citizens & Municipalities"
        subtitle="Hear from the people and organizations experiencing the impact of Swachh Bandhu."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            quote={testimonial.quote}
            name={testimonial.name}
            role={testimonial.role}
            delay={testimonial.delay}
          />
        ))}
      </div>

      <motion.div 
        className="mt-16 flex flex-wrap gap-8 justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <p className="text-lg font-semibold text-gray-500">Municipality of Pune</p>
        </div>
        <div className="text-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <p className="text-lg font-semibold text-gray-500">Bangalore Urban</p>
        </div>
        <div className="text-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <p className="text-lg font-semibold text-gray-500">Delhi MCD</p>
        </div>
        <div className="text-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <p className="text-lg font-semibold text-gray-500">TechCorp Foundation</p>
        </div>
      </motion.div>
    </Section>
  );
};

export default TestimonialsSection;