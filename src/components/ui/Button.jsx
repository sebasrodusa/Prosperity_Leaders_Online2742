import React from 'react'
import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  loading = false,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Variant-specific styling
  const variants = {
    primary: 'bg-picton-blue hover:bg-picton-blue/90 text-white focus:ring-picton-blue/50 shadow-sm hover:shadow',
    secondary: 'bg-accent-teal hover:bg-accent-teal/90 text-white focus:ring-accent-teal/50 shadow-sm hover:shadow',
    outline: 'border border-picton-blue bg-white dark:bg-transparent hover:bg-picton-blue/5 dark:hover:bg-picton-blue/20 text-picton-blue focus:ring-picton-blue/50',
    ghost: 'hover:bg-anti-flash-white dark:hover:bg-gray-700 text-polynesian-blue dark:text-white focus:ring-picton-blue/50',
    danger: 'bg-status-error hover:bg-status-error/90 text-white focus:ring-status-error/50 shadow-sm hover:shadow',
    success: 'bg-status-success hover:bg-status-success/90 text-white focus:ring-status-success/50 shadow-sm hover:shadow',
    warning: 'bg-status-warning hover:bg-status-warning/90 text-white focus:ring-status-warning/50 shadow-sm hover:shadow',
  }
  
  // Size-specific styling
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }

  // Handle loading state
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{typeof children === 'string' ? children : 'Loading...'}</span>
        </>
      )
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {icon}
          {children && <span className={icon ? 'ml-2' : ''}>{children}</span>}
        </>
      )
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children && <span className={icon ? 'mr-2' : ''}>{children}</span>}
          {icon}
        </>
      )
    }

    return children
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </motion.button>
  )
}

export default Button