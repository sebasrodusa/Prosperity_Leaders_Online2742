import React, { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error,
  className = '',
  type = 'text',
  required = false,
  prefix = null,
  suffix = null,
  helperText = null,
  fullWidth = true,
  id = null,
  ...props
}, ref) => {
  // Generate a random ID if none is provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`
  
  return (
    <div className={`space-y-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-polynesian-blue dark:text-white">
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {prefix}
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue transition-colors duration-200
            ${error ? 'border-status-error focus:border-status-error focus:ring-status-error/30' : 'border-ui-divider dark:border-gray-700'}
            ${prefix ? 'pl-10' : ''}
            ${suffix ? 'pr-10' : ''}
            ${className}
            text-polynesian-blue dark:text-white
            bg-white dark:bg-gray-800
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          required={required}
          {...props}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-status-error">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-sm text-ui-muted dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
})

export default Input