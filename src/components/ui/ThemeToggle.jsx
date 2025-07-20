import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-picton-blue transition-colors ${
        isDarkMode 
          ? 'bg-gray-800 hover:bg-gray-700 text-yellow-300' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      } ${className}`}
      whileTap={{ scale: 0.95 }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <SafeIcon
        icon={isDarkMode ? FiIcons.FiSun : FiIcons.FiMoon}
        className="w-5 h-5"
      />
    </motion.button>
  );
};

export default ThemeToggle;
