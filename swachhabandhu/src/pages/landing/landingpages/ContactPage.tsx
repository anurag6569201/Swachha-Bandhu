import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ExternalLink } from 'lucide-react'; // Added ExternalLink for FAQ
import Section from '../components/ui/Section'; // Assuming these paths are correct
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

const ContactPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Contact Us - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  const contactInfoItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="pt-20"> {/* Keep this for navbar offset if needed */}
      {/* Hero Section */}
      <Section bgColor="bg-teal-700 text-white" className="py-16 md:py-24"> {/* Increased padding */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" // Slightly larger on lg
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-teal-100 mb-8 max-w-3xl mx-auto" // Slightly smaller base text
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            We're here to answer your questions and help you get the most out of Swachh Bandhu.
            Reach out, and let's make a difference together.
          </motion.p>
        </div>
      </Section>

      {/* Contact Form & Info */}
      <Section className="py-16 md:py-20"> {/* Consistent padding */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16"> {/* Increased gap for lg */}
          {/* Form Section */}
          <motion.div
            className="lg:w-3/5" // Slightly more space for the form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <SectionHeading
              title="Get In Touch"
              subtitle="Fill out the form and our team will get back to you within 24 hours."
              className="mb-10" // More space after heading
            />

            <form className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg"> {/* Added card styling to form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name" // Good practice for forms
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="e.g., Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="Regarding..."
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5} // Slightly less rows, py-3 will make it tall enough
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="Your detailed message..."
                  required
                ></textarea>
              </div>
              <div>
                <Button
                  type="submit" // Important for forms
                  variant="primary"
                  size="lg"
                  className="w-full md:w-auto" // Full width on mobile, auto on md+
                  icon={<Send size={18} className="mr-2" />} // Slightly larger icon, add margin
                >
                  Send Message
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Info Section */}
          <motion.div
            className="lg:w-2/5 space-y-10" // Less space for info, consistent spacing
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {/* General Contact Information */}
            <div className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-teal-700">Contact Information</h3>
              <div className="space-y-6">
                <motion.div className="flex items-start" variants={contactInfoItemVariants} initial="hidden" animate="visible">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mr-4">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-1">Email Us</h4>
                    <a href="mailto:info@swachhbandhu.org" className="text-teal-600 hover:text-teal-700 hover:underline break-all">info@swachhbandhu.org</a>
                    <br />
                    <a href="mailto:support@swachhbandhu.org" className="text-teal-600 hover:text-teal-700 hover:underline break-all">support@swachhbandhu.org</a>
                  </div>
                </motion.div>

                <motion.div className="flex items-start" variants={contactInfoItemVariants} initial="hidden" animate="visible">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mr-4">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-1">Call Us</h4>
                    <a href="tel:+911234567890" className="text-teal-600 hover:text-teal-700 hover:underline">+91 (123) 456-7890</a>
                    <p className="text-gray-500 text-sm">Mon-Fri, 9:00 AM - 6:00 PM IST</p>
                  </div>
                </motion.div>

                <motion.div className="flex items-start" variants={contactInfoItemVariants} initial="hidden" animate="visible">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mr-4">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-1">Our Office</h4>
                    <p className="text-gray-600">123 Innovation Park,<br />Koramangala, Bangalore - 560034<br />India</p>
                    {/* Consider adding a Google Maps link here if desired */}
                    {/* <a href="#" className="text-sm text-teal-500 hover:underline mt-1 inline-block">View on Map</a> */}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Specific Inquiries */}
            <div className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-teal-700">Specific Inquiries</h3>
              <div className="space-y-5">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-1">For Municipalities</h4>
                  <a href="mailto:municipalities@swachhbandhu.org" className="text-teal-600 hover:text-teal-700 hover:underline break-all">municipalities@swachhbandhu.org</a>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-1">For CSR Partners</h4>
                  <a href="mailto:partnerships@swachhbandhu.org" className="text-teal-600 hover:text-teal-700 hover:underline break-all">partnerships@swachhbandhu.org</a>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-1">Technical Support</h4>
                  <a href="mailto:support@swachhbandhu.org" className="text-teal-600 hover:text-teal-700 hover:underline break-all">support@swachhbandhu.org</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* FAQ Reference */}
      <Section bgColor="bg-gray-100" className="py-16 md:py-20"> {/* Slightly different bg for variety */}
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            title="Have More Questions?"
            subtitle="Find quick answers to common questions about Swachh Bandhu on our dedicated FAQ page."
            centered
            className="mb-10" // More space after heading
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="outline" // Changed variant for visual difference
              size="lg"
              href="/faq"
              icon={<ExternalLink size={18} className="ml-2" />} // Added icon
              iconPosition="right"
            >
              Visit FAQ Page
            </Button>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default ContactPage;