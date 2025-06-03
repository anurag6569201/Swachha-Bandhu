// LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Section from '../components/ui/Section'; // Assuming path
import SectionHeading from '../components/ui/SectionHeading'; // Assuming path
import Button from '../components/ui/Button'; // Assuming path

// Placeholder for Link component if not using React Router for this example
const LinkPlaceholder: React.FC<{ to: string; children: React.ReactNode; className?: string }> = ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
);

const LoginSvgIllustration: React.FC = () => (
  <motion.svg
    width="100%"
    height="100%"
    viewBox="0 0 500 500"
    preserveAspectRatio="xMidYMid meet"
    className="hidden lg:block" // Hide on smaller screens
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
  >
    <defs>

      <filter id="loginDropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="2" dy="2" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Background shape */}
    <motion.path
      d="M50,50 Q250,0 450,50 L450,450 Q250,500 50,450 Z"
      fill="url(#loginBgGradient)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
    />

    {/* Abstract representation of a secure portal/gateway */}
    <motion.rect
      x="150" y="120" width="200" height="260" rx="20" ry="20"
      fill="rgba(255, 255, 255, 0.8)"
      stroke="rgba(13, 148, 136, 0.6)" // teal-600
      strokeWidth="3"
      filter="url(#loginDropShadow)"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.8 }}
    />
    
    {/* Keyhole / Lock Icon */}
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 1.1 }}
    >
      <circle cx="250" cy="220" r="30" fill="rgba(13, 148, 136, 1)" /> {/* teal-600 */}
      <rect x="235" y="240" width="30" height="50" rx="5" ry="5" fill="rgba(13, 148, 136, 1)" />
      <circle cx="250" cy="220" r="15" fill="rgba(204, 251, 241, 1)" /> {/* teal-100 */}
    </motion.g>

    {/* Arrow indicating entry */}
     <motion.path
      d="M250 330 L250 380 M230 360 L250 380 L270 360"
      stroke="rgba(13, 148, 136, 0.8)" // teal-600
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    />

    {/* Decorative circles */}
    {[
      { cx: 100, cy: 100, r: 15, delay: 1.0 },
      { cx: 400, cy: 150, r: 20, delay: 1.2 },
      { cx: 120, cy: 400, r: 25, delay: 1.4 },
      { cx: 380, cy: 380, r: 10, delay: 1.6 },
    ].map((circle, i) => (
      <motion.circle
        key={i}
        cx={circle.cx}
        cy={circle.cy}
        r={circle.r}
        fill="rgba(13, 148, 136, 0.3)" // teal-600 opacity 30%
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: circle.delay }}
      />
    ))}
  </motion.svg>
);


const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Login - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Login form submitted');
  };

  return (
    <div className="mt-20 min-h-screen flex flex-col">
      <Section bgColor="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800" className="flex-grow flex items-center justify-center py-8 md:py-0"> {/* Adjusted padding for full height feel */}
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
            {/* Form Section */}
            <motion.div
              className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-lg mx-auto lg:mx-0" // max-w-md for form, mx-auto for centering on small screens
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email or Username
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
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <LinkPlaceholder to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
                      Forgot password?
                    </LinkPlaceholder>
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
                  >
                    Log In
                  </Button>
                </motion.div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <LinkPlaceholder to="/signup" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                    Sign Up
                  </LinkPlaceholder>
                </p>
              </div>
            </motion.div>

            {/* SVG Illustration Section */}
            <div className="hidden lg:flex items-center justify-center h-full"> {/* Ensure SVG container takes height */}
              <LoginSvgIllustration />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default LoginPage;
