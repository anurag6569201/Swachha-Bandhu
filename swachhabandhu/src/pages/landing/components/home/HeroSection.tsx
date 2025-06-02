import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowRight, MapPin, CheckCircle, Award as AwardIcon, ScanLine, FileText, Users, Zap } from 'lucide-react';
import Button from '../ui/Button'; // Assuming your Button component path

const AppScreen: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColorClass: string;
  textColorClass?: string;
}> = ({ icon, title, description, bgColorClass, textColorClass = "text-white" }) => (
  <motion.div
    className={`absolute inset-0 p-4 sm:p-6 flex flex-col items-center justify-center text-center rounded-xl ${bgColorClass}`}
    initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
    exit={{ opacity: 0, scale: 0.95, rotateY: -15 }}
    transition={{ duration: 0.6, type: "spring", stiffness: 150, damping: 20 }}
  >
    <div className={`mb-3 sm:mb-4 ${textColorClass}`}>{icon}</div>
    <h3 className={`text-lg sm:text-xl font-semibold ${textColorClass} mb-1`}>{title}</h3>
    <p className={`text-xs sm:text-sm ${textColorClass}/80`}>{description}</p>
  </motion.div>
);

const HeroSection: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const appScreens = [
    { id: 0, icon: <ScanLine size={44} />, title: "1. Scan QR & Report", description: "Instantly flag civic issues using QR codes on public assets.", bgColorClass: "bg-teal-600" },
    { id: 1, icon: <MapPin size={44} />, title: "2. Geo-Verify", description: "Ensure report authenticity with location-based validation.", bgColorClass: "bg-cyan-600" },
    { id: 2, icon: <Users size={44} />, title: "3. Community Validates", description: "Fellow citizens confirm the issue, building trust.", bgColorClass: "bg-sky-600" },
    { id: 3, icon: <AwardIcon size={44} />, title: "4. Earn Rewards!", description: "Get recognized with points & incentives for your contribution.", bgColorClass: "bg-indigo-600" },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentScreen((prevScreen) => (prevScreen + 1) % appScreens.length);
    }, 3500); // Change screen every 3.5 seconds
    return () => clearInterval(intervalId);
  }, [appScreens.length]);

  const featureItemVariants = {
    rest: { scale: 1, boxShadow: "0px 2px 4px rgba(0,0,0,0.05)" },
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }
  };

  return (
    <div className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-teal-50 via-sky-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <motion.div
            className="lg:w-3/5 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl xl:text-7xl font-bold text-gray-900 mb-5 leading-tight">
              Your Voice, <br /><span className="text-teal-600">Verified Action,</span><br />Our Community
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Swachh Bandhu connects citizens with municipalities using a transparent, rewarding system for reporting and resolving civic issues.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start">
              <Button
                variant="primary"
                size="lg"
                icon={<Download size={20} />}
                href="#download"
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get The App
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<ArrowRight size={20} />}
                href="/how-it-works"
                className="hover:bg-teal-50 transform hover:scale-105 transition-all duration-300"
              >
                Learn How It Works
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {[
                { icon: <MapPin size={20} />, text: "Geo-Verified Reports" }, //
                { icon: <CheckCircle size={20} />, text: "Peer Validated" }, //
                { icon: <AwardIcon size={20} />, text: "Rewarding Participation" } //
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center p-3 bg-white rounded-lg shadow-md border border-gray-200"
                  variants={featureItemVariants}
                  initial="rest"
                  whileHover="hover"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-600 mr-3 shrink-0">
                    {feature.icon}
                  </div>
                  <p className="text-gray-700 font-medium text-sm">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Interactive App Showcase */}
          <motion.div
            className="lg:w-2/5 relative mt-10 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative mx-auto w-[280px] h-[560px] sm:w-[300px] sm:h-[600px] bg-slate-800 rounded-[40px] shadow-2xl p-3 sm:p-4 border-4 border-slate-700 overflow-hidden">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-full z-20"></div> {/* Notch */}
              <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-slate-900">
                <AnimatePresence mode="wait">
                  <AppScreen key={appScreens[currentScreen].id} {...appScreens[currentScreen]} />
                </AnimatePresence>
              </div>
            </div>
             {/* Navigation Dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 mt-4">
              {appScreens.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentScreen(index)}
                  className={`w-2.5 h-2.5 rounded-full ${currentScreen === index ? 'bg-teal-600 scale-125' : 'bg-gray-300'}`}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ))}
            </div>

            {/* Decorative elements - more subtle and integrated */}
            <motion.div 
              className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/30 rounded-full blur-2xl -z-10"
              animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-12 -left-12 w-40 h-40 bg-teal-400/30 rounded-full blur-2xl -z-10"
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
             <motion.div 
              className="absolute top-1/2 left-1/4 w-20 h-20 bg-sky-400/20 rounded-full blur-xl -z-10"
              animate={{ scale: [1, 1.1, 1]}}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Wave pattern - can be kept if desired, or removed for a cleaner look if background gradient is enough */}
      <div className="absolute bottom-0 left-0 right-0 opacity-50 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L60,80C120,64,240,32,360,21.3C480,11,600,21,720,42.7C840,64,960,96,1080,96C1200,96,1320,64,1380,48L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;