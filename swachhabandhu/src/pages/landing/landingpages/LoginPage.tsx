// LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../../Api';
import { useAuth } from '../../../context/AuthContext';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    document.title = 'Login - Swachh Bandhu';
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login/', {
        email: email,
        password: password,
      });

      await auth.login(response.data.access, response.data.refresh);
      
      navigate('/app/dashboard');

    } catch (err: any) {
      console.error('Login failed:', err.response?.data || err.message);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.detail) {
          setError(errorData.detail);
        } else {
          const messages = Object.values(errorData).flat().join(' ');
          setError(messages || 'Login failed. Please check your credentials.');
        }
      } else {
        setError('Login failed. A network error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (auth.isLoading) {
    return <div className="mt-20 min-h-screen flex items-center justify-center"><p>Authenticating...</p></div>;
  }

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
                <LogIn size={32} />
              </div>
              <SectionHeading
                title="Welcome Back!"
                subtitle="Log in to continue your journey with Swachh Bandhu."
                centered
                className="mb-0"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email" id="email" name="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="you@example.com"
                    required value={email} onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <Link to="/auth/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} id="password" name="password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="••••••••"
                    required value={password} onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" variant="primary" size="lg" className="w-full" icon={<ArrowRight size={20} />} iconPosition="right"
                  disabled={loading}>
                  {loading ? 'Logging In...' : 'Log In'}
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default LoginPage;