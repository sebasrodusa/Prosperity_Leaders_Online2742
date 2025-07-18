import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiChevronDown } = FiIcons;

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[90vh] bg-gradient-to-br from-[#00AAFF] to-[#0044AA] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute w-full h-full bg-[url('https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AAFF]/90 to-[#0044AA]/90" />
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -right-[20%] -top-[10%] w-[80%] h-[80%] rounded-full border-[40px] border-white/20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute -left-[20%] -bottom-[10%] w-[80%] h-[80%] rounded-full border-[40px] border-white/10"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Empowering Families.
              <br />
              Building Legacies.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mt-6 text-xl md:text-2xl text-blue-100">
              Personalized Financial Strategies • Life Insurance • Wealth Growth • Career Opportunities
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection('services')}
              className="bg-white text-[#0044AA] hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
            >
              Start Your Financial Plan
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('join-team')}
              className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
            >
              Join the Team
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.2
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white"
      >
        <button 
          onClick={() => scrollToSection('about')}
          className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
        >
          <span className="text-sm font-medium mb-2">Learn More</span>
          <SafeIcon icon={FiChevronDown} className="w-6 h-6 animate-bounce" />
        </button>
      </motion.div>
    </div>
  );
};

export default Hero;