import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-picton-blue hover:bg-picton-blue/90 text-white focus:ring-picton-blue/50',
    secondary: 'bg-anti-flash-white hover:bg-gray-200 text-polynesian-blue focus:ring-picton-blue/50',
    outline: 'border border-picton-blue bg-white hover:bg-picton-blue/5 text-picton-blue focus:ring-picton-blue/50',
    ghost: 'hover:bg-anti-flash-white text-polynesian-blue focus:ring-picton-blue/50',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button