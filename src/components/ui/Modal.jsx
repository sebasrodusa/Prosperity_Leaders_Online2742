import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiX } = FiIcons

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnClickOutside = true,
  showCloseButton = true,
  footer = null,
  centered = false,
}) => {
  // Handle size classes
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    'full': 'max-w-full mx-4',
  }

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscKey)
    
    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div
            className={`flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 ${centered ? 'items-center' : 'items-start sm:items-center'}`}
            onClick={handleBackdropClick}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black bg-opacity-50 transition-opacity"
              aria-hidden="true"
            />

            {/* Modal position helper */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`relative z-[10000] inline-block align-bottom bg-white dark:bg-polynesian-blue rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${sizes[size]}`}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-ui-divider dark:border-gray-700">
                  <h3 className="text-lg font-medium text-polynesian-blue dark:text-white">
                    {title}
                  </h3>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="text-ui-muted hover:text-polynesian-blue dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-picton-blue rounded-full p-1 transition duration-150"
                      aria-label="Close modal"
                    >
                      <SafeIcon icon={FiX} className="h-6 w-6" />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className={`px-6 py-4 ${!title && showCloseButton ? 'pt-10' : ''}`}>
                {!title && showCloseButton && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-ui-muted hover:text-polynesian-blue dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-picton-blue rounded-full p-1 transition duration-150"
                    aria-label="Close modal"
                  >
                    <SafeIcon icon={FiX} className="h-6 w-6" />
                  </button>
                )}
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 bg-anti-flash-white dark:bg-gray-800 border-t border-ui-divider dark:border-gray-700">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
