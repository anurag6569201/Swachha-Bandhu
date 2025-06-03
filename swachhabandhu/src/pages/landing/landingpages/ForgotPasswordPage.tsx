import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import apiClient from '../../../Api';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await apiClient.post('/password-reset/', { email });
      setMessage(response.data.message || "If an account with that email exists, a password reset link has been sent.");
      setEmail(''); 
    } catch (err: any) {
      console.error('Forgot password error:', err.response?.data);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        setError(errorData.email?.[0] || errorData.detail || errorData.error || 'Failed to send reset link.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 min-h-screen flex flex-col">
      <Section bgColor="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800" className="flex-grow flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-5">
                <Mail size={32} />
              </div>
              <SectionHeading
                title="Forgot Your Password?"
                subtitle="Enter your email address and we'll send you a link to reset your password."
                centered
                className="mb-0"
              />
            </div>

            {message && <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}

            {!message && (
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                    </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                    type="submit"
                    variant="primary" 
                    className="w-full"
                    size="lg"
                    icon={<ArrowRight size={20} />}
                    iconPosition="right"
                    disabled={loading}
                    >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </motion.div>
                </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/auth/login" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default ForgotPasswordPage;