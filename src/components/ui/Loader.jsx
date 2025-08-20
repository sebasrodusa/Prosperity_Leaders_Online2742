import React from 'react'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'

const Loader = ({ size = 'md', color = 'primary', fullScreen = false, text = '' }) => {
  // Size variants
  const sizes = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
    xl: 'h-24 w-24 border-4'
  }
  
  // Color variants
  const colors = {
    primary: 'border-picton-blue',
    white: 'border-white',
    secondary: 'border-accent-teal',
    success: 'border-status-success',
    warning: 'border-status-warning',
    error: 'border-status-error'
  }
  
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-polynesian-blue/80 backdrop-blur-sm'
    : 'flex items-center justify-center py-8'
  
  const content = (
    <div className={containerClasses}>
      <div
        className={`flex flex-col items-center ${fullScreen ? 'relative z-[10000]' : ''}`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear"
          }}
          className={`rounded-full ${sizes[size]} border-t-transparent ${colors[color]}`}
        />
        {text && (
          <p className="mt-4 text-polynesian-blue dark:text-white font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  )

  return fullScreen ? createPortal(content, document.body) : content
}

export default Loader
