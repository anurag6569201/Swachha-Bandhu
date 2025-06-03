import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading'; 
import Button from '../components/ui/Button'; 
import { Link, useNavigate } from 'react-router-dom'; 
import apiClient from '../../../Api';
import { useAuth } from '../../../context/AuthContext';


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
    window.scrollTo(0, 0);
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate('/app/dashboard/'); 
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.post('/login/', {
        email: email,
        password: password,
      });
      
      await auth.login(response.data.access, response.data.refresh);
      
      navigate('/app/dashboard/'); // Redirect to home or dashboard

    } catch (err: any) {
      console.error('Login failed:', err.response?.data || err.message);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.detail) { 
          setError(errorData.detail);
        } else if (errorData.error) {
            setError(errorData.error);
        } else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
            const messages = Object.values(errorData).flat().join(' ');
            setError(messages || 'Login failed. Please check your credentials.');
        } else {
          setError('Login failed. Please check your credentials and try again.');
        }
      } else {
        setError('Login failed. An unexpected error occurred.');
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
      <Section bgColor="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800" className="flex-grow flex items-center justify-center py-8 md:py-0">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="gap-16 items-center w-full" style={{justifyContent:'center',display:'flex'}}>
            <motion.div
              className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address 
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
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
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link to="/auth/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={<ArrowRight size={20} />}
                    iconPosition="right"
                    disabled={loading || auth.isLoading}
                  >
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
        </div>
      </Section>
    </div>
  );
};

export default LoginPage;