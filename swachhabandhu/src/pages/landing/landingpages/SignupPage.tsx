// SignupPage.tsx
import React, { useEffect as useSignupEffect, useState as useSignupState } from 'react';
import { motion, motion as signupMotion } from 'framer-motion';
import { UserPlus, User as SignupUser, Lock as SignupLock, Mail as SignupMail, ArrowRight as SignupArrowRight, Eye as SignupEye, EyeOff as SignupEyeOff } from 'lucide-react';
import SignupSection from '../components/ui/Section';
import SignupSectionHeading from '../components/ui/SectionHeading';
import SignupButton from '../components/ui/Button';

const SignupLinkPlaceholder: React.FC<{ to: string; children: React.ReactNode; className?: string }> = ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
);

const SignupSvgIllustration: React.FC = () => (
  <motion.svg
    width="100%"
    height="100%"
    viewBox="0 0 500 550" // Adjusted viewBox for slightly taller design
    preserveAspectRatio="xMidYMid meet"
    className="hidden lg:block"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
  >
    <defs>

      <filter id="signupDropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3.5"/>
        <feOffset dx="2.5" dy="2.5" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.4"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <motion.path
      d="M20,70 Q250,20 480,70 L460,480 Q250,530 40,480 Z"
      fill="url(#signupBgGradient)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
    />

    {/* Abstract representation of community/connection */}
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {/* Central "User Plus" Icon */}
      <circle cx="250" cy="200" r="50" fill="rgba(204, 251, 241, 0.8)" filter="url(#signupDropShadow)" /> {/* teal-100 */}
      <path d="M250 175 V 225 M225 200 H 275" stroke="rgba(13, 148, 136, 1)" strokeWidth="8" strokeLinecap="round" /> {/* teal-600 */}
      
      {/* Connecting lines and nodes - representing network/community */}
      {[
        { x1: 250, y1: 200, x2: 150, y2: 120, delay: 1.0 },
        { x1: 250, y1: 200, x2: 350, y2: 120, delay: 1.1 },
        { x1: 250, y1: 200, x2: 180, y2: 300, delay: 1.2 },
        { x1: 250, y1: 200, x2: 320, y2: 300, delay: 1.3 },
        { x1: 250, y1: 200, x2: 250, y2: 350, delay: 1.4 },
      ].map((line, i) => (
        <motion.line
          key={`line-${i}`}
          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke="rgba(13, 148, 136, 0.5)" // teal-600 opacity 50%
          strokeWidth="3"
          strokeDasharray="5 5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: line.delay }}
        />
      ))}
      
      {/* Nodes */}
      {[
        { cx: 150, cy: 120, r: 18, delay: 1.0 },
        { cx: 350, cy: 120, r: 18, delay: 1.1 },
        { cx: 180, cy: 300, r: 20, delay: 1.2 },
        { cx: 320, cy: 300, r: 20, delay: 1.3 },
        { cx: 250, cy: 350, r: 22, delay: 1.4 },
      ].map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={node.cx} cy={node.cy} r={node.r}
          fill="rgba(13, 148, 136, 0.7)" // teal-600 opacity 70%
          stroke="rgba(204, 251, 241, 1)" // teal-100
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: node.delay + 0.3 }}
        />
      ))}
    </motion.g>

    {/* Abstract "growth" or "positive impact" elements */}
    <motion.path
      d="M100 450 C150 400, 200 420, 250 380 S 350 300, 400 400"
      fill="none"
      stroke="rgba(74, 222, 128, 0.6)" // green-400 opacity 60%
      strokeWidth="6"
      strokeDasharray="10 10"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, delay: 1.5, ease: "circOut" }}
    />
     <motion.circle cx="80" cy="80" r="12" fill="rgba(74, 222, 128, 0.3)" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.7}}/>
     <motion.circle cx="420" cy="90" r="15" fill="rgba(74, 222, 128, 0.4)" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}}/>

  </motion.svg>
);

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useSignupState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useSignupState(false);

  useSignupEffect(() => {
    document.title = 'Sign Up - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle signup logic here
    console.log('Signup form submitted');
  };

  return (
    <div className="mt-20 min-h-screen flex flex-col">
      <SignupSection bgColor="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800" className="flex-grow flex items-center justify-center py-8 md:py-0">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full"> {/* Increased gap slightly */}
            {/* Form Section */}
            <signupMotion.div
              className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-lg mx-auto lg:mx-0" // max-w-lg for signup form
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
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <SignupLinkPlaceholder to="/terms" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                      Terms of Service
                    </SignupLinkPlaceholder>
                    {' '}and{' '}
                    <SignupLinkPlaceholder to="/privacy" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                      Privacy Policy
                    </SignupLinkPlaceholder>.
                  </label>
                </div>
                
                <signupMotion.div
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
                  >
                    Create Account
                  </SignupButton>
                </signupMotion.div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <SignupLinkPlaceholder to="/login" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                    Log In
                  </SignupLinkPlaceholder>
                </p>
              </div>
            </signupMotion.div>
            
            {/* SVG Illustration Section */}
            <div className="hidden lg:flex items-center justify-center h-full">
              <SignupSvgIllustration />
            </div>
          </div>
        </div>
      </SignupSection>
    </div>
  );
};

export default SignupPage;
