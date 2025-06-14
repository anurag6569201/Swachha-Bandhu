// SignupPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../../Api';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign Up - Swachh Bandhu';
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!termsAccepted) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register/', {
        full_name: fullName,
        email: email,
        password: password,
        password2: confirmPassword,
      });
      
      setSuccessMessage(response.data.message || 'Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/auth/login'), 2000);

    } catch (err: any) {
      console.error('Signup failed:', err.response?.data || err.message);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const messages = Object.entries(errorData).map(([key, value]) => 
          `${key.replace("_", " ")}: ${(value as string[]).join(" ")}`
        ).join("\n");
        setError(messages || 'Signup failed. Please check your input.');
      } else {
        setError('Signup failed. A network error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 min-h-screen flex flex-col">
      <Section className="flex-grow flex items-center justify-center py-8" bgColor="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
        <div className="h-full flex items-center">
          <motion.div
            className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-5">
                <UserPlus size={32} />
              </div>
              <SectionHeading
                title="Create Your Account"
                subtitle="Join Swachh Bandhu and start making a difference."
                centered
                className="mb-0"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm whitespace-pre-wrap">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            {!successMessage && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-gray-400" /></div>
                    <input type="text" id="fullName" name="fullName"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="e.g., Jane Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
                  </div>
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail size={18} className="text-gray-400" /></div>
                    <input type="email" id="signup-email" name="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                  </div>
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-gray-400" /></div>
                    <input type={showPassword ? "text" : "password"} id="signup-password" name="password"
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Minimum 8 characters" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-600" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-gray-400" /></div>
                    <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword"
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Re-enter your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-600" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <input id="terms" name="terms" type="checkbox"
                    className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-0.5"
                    required checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}<Link to="/terms" className="font-medium text-teal-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}<Link to="/privacy" className="font-medium text-teal-600 hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" variant="primary" size="lg" className="w-full" icon={<ArrowRight size={20} />} iconPosition="right" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </motion.div>
              </form>
            )}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/auth/login" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">Log In</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default SignupPage;