import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMenu, FiX, FiUser, FiLogIn } = FiIcons;

const HomeNavbar = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '#' },
    { name: 'About', path: '#about' },
    { name: 'Services', path: '#services' },
    { name: 'Join Our Team', path: '#join-team' },
    { name: 'Find a Professional', path: '#find-professional' },
    { name: 'Contact', path: '#contact' }
  ];

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    if (id === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="https://via.placeholder.com/40x40?text=PL"
                  alt="Prosperity Leaders Logo"
                  className="h-10 w-auto"
                />
                <div className={`ml-2 font-bold text-xl ${isScrolled ? 'text-[#0044AA]' : 'text-white'}`}>
                  Prosperity Leaders™
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex space-x-6">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.path)}
                    className={`text-sm font-medium hover:text-[#00AAFF] transition-colors ${
                      isScrolled ? 'text-gray-700' : 'text-white'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              <div className="ml-4 flex items-center space-x-4">
                {user ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className={`flex items-center space-x-2 ${
                      isScrolled ? 'border-[#0044AA] text-[#0044AA]' : 'border-white text-white'
                    }`}
                  >
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className={`flex items-center space-x-2 ${
                      isScrolled ? 'border-[#0044AA] text-[#0044AA]' : 'border-white text-white'
                    }`}
                  >
                    <SafeIcon icon={FiLogIn} className="w-4 h-4" />
                    <span>Login</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
              >
                <SafeIcon icon={isMobileMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.path)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-[#0044AA] rounded-md"
                >
                  {link.name}
                </button>
              ))}
              
              <div className="pt-2 border-t border-gray-200 mt-2">
                {user ? (
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full flex items-center justify-center space-x-2 mt-2"
                  >
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full flex items-center justify-center space-x-2 mt-2"
                  >
                    <SafeIcon icon={FiLogIn} className="w-4 h-4" />
                    <span>Login</span>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>
      
      {/* Spacer for fixed navbar */}
      <div className={`h-16 ${isScrolled ? 'bg-transparent' : 'bg-transparent'}`}></div>
    </>
  );
};

export default HomeNavbar;