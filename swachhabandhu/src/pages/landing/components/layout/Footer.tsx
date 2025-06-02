import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'Features', path: '/features' },
      ],
    },
    {
      title: 'Partners',
      links: [
        { name: 'For Municipalities', path: '/for-municipalities' },
        { name: 'For CSR Partners', path: '/for-csr-partners' },
        { name: 'Success Stories', path: '/about#success-stories' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, url: '#', label: 'Facebook' },
    { icon: <Twitter size={20} />, url: '#', label: 'Twitter' },
    { icon: <Instagram size={20} />, url: '#', label: 'Instagram' },
    { icon: <Linkedin size={20} />, url: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center">
              <Logo white />
              <span className="ml-2 text-xl font-bold">Swachh Bandhu</span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Transforming civic engagement through verified reporting, community participation, and transparent governance.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="font-medium text-lg mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Swachh Bandhu. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center">
            <a href="mailto:info@swachhbandhu.org" className="flex items-center text-gray-400 hover:text-teal-400 transition-colors duration-300">
              <Mail size={16} className="mr-2" />
              <span>info@swachhbandhu.org</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;