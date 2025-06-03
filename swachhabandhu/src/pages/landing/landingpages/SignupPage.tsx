import React, { useEffect as useSignupEffect, useState as useSignupState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User as SignupUser, Lock as SignupLock, Mail as SignupMail, ArrowRight as SignupArrowRight, Eye as SignupEye, EyeOff as SignupEyeOff } from 'lucide-react';
import SignupSection from '../components/ui/Section'; 
import SignupSectionHeading from '../components/ui/SectionHeading'; 
import SignupButton from '../components/ui/Button'; 
import { Link, useNavigate } from 'react-router-dom'; 
import apiClient from '../../../Api'; 
import { useAuth } from '../../../context/AuthContext';


const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useSignupState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useSignupState(false);
  
  const [fullName, setFullName] = useSignupState(''); 
  const [email, setEmail] = useSignupState('');
  const [password, setPasswordState] = useSignupState('');
  const [confirmPassword, setConfirmPassword] = useSignupState('');
  const [termsAccepted, setTermsAccepted] = useSignupState(false);

  const [error, setError] = useSignupState<string | null>(null);
  const [successMessage, setSuccessMessage] = useSignupState<string | null>(null);
  const [loading, setLoading] = useSignupState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  useSignupEffect(() => {
    document.title = 'Sign Up - Swachh Bandhu';
    window.scrollTo(0, 0);
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate('/'); 
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!termsAccepted) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/register/', {
        full_name: fullName, 
        email: email,
        password: password,
        password2: confirmPassword,
      });
      
      setSuccessMessage(response.data.message || 'Account created successfully! Please log in.');
      setFullName('');
      setEmail('');
      setPasswordState('');
      setConfirmPassword('');
      setTermsAccepted(false);
      
      setTimeout(() => {
        navigate('/auth/login'); 
      }, 3000);

    } catch (err: any) {
      console.error('Signup failed:', err.response?.data || err.message);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        let errorMessages = [];
        for (const key in errorData) {
          const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Prettify field names
          if (Array.isArray(errorData[key])) {
            errorMessages.push(`${fieldName}: ${errorData[key].join(' ')}`);
          } else {
            errorMessages.push(`${fieldName}: ${errorData[key]}`);
          }
        }
        setError(errorMessages.join('; ') || 'Signup failed. Please check your input.');
      } else {
        setError('Signup failed. An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (auth.isLoading) {
    return <div className="mt-20 min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="mt-20 min-h-screen flex flex-col">
      <SignupSection bgColor="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800" className="flex-grow flex items-center justify-center py-8 md:py-0">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="items-center w-full" style={{display:'flex',justifyContent:'center'}}>
            <motion.div
              className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-5">
                  <UserPlus size={32} />
                </div>
                <SignupSectionHeading
                  title="Create Your Account"
                  subtitle="Join Swachh Bandhu and start making a difference in your community."
                  centered
                  className="mb-0"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">
                  {successMessage}
                </div>
              )}

              {!successMessage && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SignupUser size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        placeholder="e.g., Jane Doe"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SignupMail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="signup-email"
                        name="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SignupLock size={18} className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="signup-password"
                        name="password"
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        placeholder="Minimum 8 characters"
                        required
                        value={password}
                        onChange={(e) => setPasswordState(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <SignupEyeOff size={20} /> : <SignupEye size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SignupLock size={18} className="text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        placeholder="Re-enter your password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-600"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <SignupEyeOff size={20} /> : <SignupEye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-0.5"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                        Privacy Policy
                      </Link>.
                    </label>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SignupButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      icon={<SignupArrowRight size={20} />}
                      iconPosition="right"
                      disabled={loading || auth.isLoading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </SignupButton>
                  </motion.div>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/auth/login" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                    Log In
                  </Link>
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </SignupSection>
    </div>
  );
};

export default SignupPage;