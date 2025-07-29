import React from 'react'
import Select from 'react-select'

const MultiSelect = React.forwardRef(({
  label,
  options = [],
  value,
  onChange,
  className = '',
  error,
  helperText = null,
  required = false,
  fullWidth = true,
  id = null,
  ...props
}, ref) => {
  const selectId = id || `multiselect-${Math.random().toString(36).substring(2,9)}`

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '2.5rem',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(6, 182, 212, 0.3)' : undefined,
      borderColor: error ? '#ef4444' : state.isFocused ? '#38bdf8' : provided.borderColor,
      '&:hover': { borderColor: state.isFocused ? '#38bdf8' : '#94a3b8' },
    }),
    multiValue: provided => ({
      ...provided,
      backgroundColor: '#bae6fd',
    }),
    multiValueLabel: provided => ({
      ...provided,
      color: '#0369a1',
      fontSize: '0.875rem',
    }),
    multiValueRemove: provided => ({
      ...provided,
      color: '#0369a1',
      ':hover': {
        backgroundColor: '#bfdbfe',
        color: '#075985',
      },
    }),
    placeholder: provided => ({
      ...provided,
      color: '#64748b',
    }),
  }

  return (
    <div className={`space-y-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-polynesian-blue dark:text-white">
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
      )}
      <Select
        ref={ref}
        inputId={selectId}
        isMulti
        options={options}
        value={value}
        onChange={onChange}
        className={className}
        classNamePrefix="multi"
        styles={customStyles}
        {...props}
      />
      {error && (
        <p className="text-sm text-status-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-ui-muted dark:text-gray-400">{helperText}</p>
      )}
    </div>
  )
})

export default MultiSelect
