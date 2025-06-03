import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Download, LogIn } from 'lucide-react';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Features', path: '/features' },
    { name: 'For Municipalities', path: '/for-municipalities' },
    { name: 'For CSR Partners', path: '/for-csr-partners' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo />
            <span className="ml-2 text-xl font-bold text-teal-700">Swachh Bandhu</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-teal-700 font-medium'
                    : 'text-gray-700 hover:text-teal-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button 
              variant="primary" 
              size="sm"
              icon={<LogIn size={16} />}
              onClick={() => navigate('/auth/login')}
            >
              Login
            </Button>
          </nav>

          {/* Mobile Navigation Toggle */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-teal-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-20">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'bg-teal-50 text-teal-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2">
                <Button 
                  variant="primary" 
                  size="full"
                  href="#download"
                  icon={<Download size={16} />}
                >
                  Download App
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;