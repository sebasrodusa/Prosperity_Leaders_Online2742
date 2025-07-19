import React from 'react'
import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hover = false,
  padding = '',
  shadow = 'sm',
  border = true,
  onClick = null,
  ...props
}) => {
  // Define shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  }
  
  // Define hover animation if enabled
  const hoverAnimation = hover ? {
    y: -4,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
  } : {}
  
  // Default padding if not specified
  const paddingClass = padding || 'p-6'
  
  // Border class if enabled
  const borderClass = border ? 'border border-ui-divider dark:border-gray-700' : ''
  
  return (
    <motion.div
      whileHover={hover ? hoverAnimation : {}}
      className={`bg-white dark:bg-gray-800 text-polynesian-blue dark:text-white rounded-lg ${shadowClasses[shadow]} ${borderClass} ${paddingClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card