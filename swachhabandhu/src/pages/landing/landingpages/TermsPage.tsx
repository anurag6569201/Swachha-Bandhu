import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';

const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms of Service - Swachh Bandhu';
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
            title="Terms of Service"
            subtitle="Last updated: June 15, 2025"
            centered
          />

          <div className="mt-8 space-y-8 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">1. Acceptance of Terms</h3>
              <p>
                By accessing or using the Swachh Bandhu mobile application and website (collectively, the "Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">2. Description of Service</h3>
              <p>
                Swachh Bandhu is a civic issue reporting platform that enables citizens to report and verify civic issues, allows municipalities to manage and resolve these issues, and provides a transparent system for tracking civic improvement. The Platform uses QR codes, geo-fencing, community verification, and gamification to create a trusted reporting ecosystem.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">3. User Accounts</h3>
              <p className="mb-2">
                To use certain features of the Platform, you must register for an account. When you register, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as needed</li>
                <li>Keep your password secure and confidential</li>
                <li>Be responsible for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">4. User Conduct</h3>
              <p className="mb-2">
                You agree not to use the Platform to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submit false or misleading reports</li>
                <li>Harass, abuse, or harm another person</li>
                <li>Impersonate another user or person</li>
                <li>Post content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
                <li>Attempt to circumvent the verification systems</li>
                <li>Use the Platform for any illegal purpose or in violation of any local, state, national, or international law</li>
                <li>Interfere with or disrupt the Platform or servers or networks connected to the Platform</li>
                <li>Collect or store personal data about other users without their consent</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">5. Reporting and Verification</h3>
              <p className="mb-2">
                When using the reporting and verification features, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Only submit reports for genuine civic issues that you have personally observed</li>
                <li>Only verify reports based on your actual observations at the location</li>
                <li>Submit accurate information and images that represent the true condition of the reported issue</li>
                <li>Respect the privacy of individuals when reporting issues (e.g., not including identifiable images of people without their consent)</li>
                <li>Not manipulate the geo-fencing or QR code systems to submit reports from locations where you are not physically present</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">6. Rewards and Points</h3>
              <p>
                The Platform includes a points system and rewards program. Points are awarded for reporting issues, verifying others' reports, and other forms of civic participation. These points may be redeemed for rewards provided by our CSR partners, subject to the specific terms of each reward offer. We reserve the right to modify, suspend, or discontinue the points system or any specific reward at any time.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">7. Intellectual Property</h3>
              <p>
                The Platform and its original content, features, and functionality are owned by Swachh Bandhu and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You may not copy, modify, create derivative works of, publicly display, publicly perform, republish, or transmit any of the material on our Platform without our prior written consent.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">8. User Content</h3>
              <p>
                By submitting reports, verifications, comments, or other content to the Platform, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content for the purposes of operating and improving the Platform and sharing verified reports with municipal authorities.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">9. Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, Swachh Bandhu and its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">10. Indemnification</h3>
              <p>
                You agree to defend, indemnify, and hold harmless Swachh Bandhu and its licensors, service providers, and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms of Service or your use of the Platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">11. Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">12. Changes to Terms</h3>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">13. Contact Us</h3>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                Email: legal@swachhbandhu.org<br />
                Address: 123 Innovation Park, Koramangala, Bangalore - 560034, India
              </p>
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
};

export default TermsPage;