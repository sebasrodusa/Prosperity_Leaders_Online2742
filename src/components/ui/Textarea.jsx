import React, { forwardRef } from 'react'

const Textarea = forwardRef(({
  label,
  error,
  className = '',
  rows = 4,
  required = false,
  helperText = null,
  id = null,
  ...props
}, ref) => {
  // Generate a random ID if none is provided
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-polynesian-blue dark:text-white">
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue transition-colors duration-200 resize-vertical
          ${error ? 'border-status-error focus:border-status-error focus:ring-status-error/30' : 'border-ui-divider dark:border-gray-700'}
          ${className}
          text-polynesian-blue dark:text-white
          bg-white dark:bg-gray-800
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        required={required}
        {...props}
      />
      
      {error && (
        <p id={`${textareaId}-error`} className="text-sm text-status-error">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="text-sm text-ui-muted dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
})

export default Textarea
