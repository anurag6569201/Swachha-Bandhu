import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Award, User, LogOut, Menu, X, ReceiptPoundSterling } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo'; // Assuming you have a Logo component
import { useAuth } from '../../../../context/AuthContext';

// --- A simple hook to detect clicks outside an element ---
const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};


const PrivateHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth(); 
  
  useOnClickOutside(profileMenuRef, () => setIsProfileOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    console.log("User logged out");
    navigate('/auth/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/app/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Rewards', path: '/app/lottery', icon: <Award size={18} /> },
    { name: 'Report', path: '/app/report/new', icon: <ReceiptPoundSterling size={18} /> },
  ];

  const profileLinks = [
    { name: 'My Profile', path: '/app/profile', icon: <User size={16} /> },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-sm shadow-md border-b border-slate-200 py-2' 
          : 'bg-white py-4'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold text-teal-700">Swachh Bandhu</span>
          </Link>
          <div className='flex gap-3'>
                      <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 text-sm font-medium ${
                  location.pathname.startsWith(link.path)
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
             {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors">
                <User className="text-slate-600" size={20} />
              </button>
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden"
                  >
                    <ul>
                      {profileLinks.map(link => (
                         <li key={link.name}>
                            <Link to={link.path} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        </li>
                      ))}
                      <li>
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
             {/* Mobile Navigation Toggle */}
            <button
              className="lg:hidden p-2 text-slate-700 hover:text-teal-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-20 border-t border-slate-200 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-5">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      location.pathname.startsWith(link.path)
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}

                <div className="border-t border-slate-200 my-2 !mt-4"></div>

                {profileLinks.map(link => (
                    <Link key={link.name} to={link.path} className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50">
                        {link.icon}
                        <span>{link.name}</span>
                    </Link>
                ))}
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PrivateHeader;
