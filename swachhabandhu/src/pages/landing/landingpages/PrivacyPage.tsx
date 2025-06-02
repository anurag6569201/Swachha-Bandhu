import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20">
      <Section>
        <motion.div 
          className="mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading
            title="Privacy Policy"
            subtitle="Last updated: June 15, 2025"
            centered
          />

          <div className="mt-8 space-y-8 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">1. Introduction</h3>
              <p>
                Swachh Bandhu ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Platform").
              </p>
              <p className="mt-2">
                Please read this Privacy Policy carefully. By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">2. Information We Collect</h3>
              <p className="mb-2">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Personal Information:</strong> Name, email address, phone number, and profile information.
                </li>
                <li>
                  <strong>Location Data:</strong> GPS location when you report or verify issues, subject to your device permissions.
                </li>
                <li>
                  <strong>Issue Reports:</strong> Information and images you provide when reporting civic issues.
                </li>
                <li>
                  <strong>Verification Activities:</strong> Your interactions when verifying other users' reports.
                </li>
                <li>
                  <strong>Device Information:</strong> Device type, operating system, unique device identifiers, and mobile network information.
                </li>
                <li>
                  <strong>Usage Data:</strong> How you interact with our Platform, including features you use and time spent.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">3. How We Use Your Information</h3>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our Platform</li>
                <li>Process and verify civic issue reports</li>
                <li>Facilitate community verification of reported issues</li>
                <li>Share verified reports with relevant municipal authorities</li>
                <li>Track and display civic issue resolution progress</li>
                <li>Administer reward programs and point systems</li>
                <li>Communicate with you about updates, features, and community activities</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Ensure the security and integrity of our Platform</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">4. Sharing Your Information</h3>
              <p className="mb-2">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Municipal Authorities:</strong> Verified issue reports (including location and report details) are shared with relevant municipal departments for resolution.
                </li>
                <li>
                  <strong>Other Users:</strong> Limited profile information may be visible to other users in leaderboards and when they verify your reports.
                </li>
                <li>
                  <strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as hosting, data analysis, and customer service.
                </li>
                <li>
                  <strong>CSR Partners:</strong> Anonymized, aggregated data about civic engagement may be shared with corporate social responsibility partners who support the platform.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law, court order, or governmental authority.
                </li>
              </ul>
              <p className="mt-2">
                We will never sell your personal information to third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">5. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">6. Your Rights and Choices</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and personal data</li>
                <li>Opt out of certain communications</li>
                <li>Control location permissions through your device settings</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, please contact us at privacy@swachhbandhu.org.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">7. Changes to This Privacy Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">8. Contact Us</h3>
              <p>
                If you have any questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                Email: privacy@swachhbandhu.org<br />
                Address: 123 Innovation Park, Koramangala, Bangalore - 560034, India
              </p>
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
};

export default PrivacyPage;