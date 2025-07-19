import React, { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { SERVICE_OPTIONS } from '../../lib/directory'

const {
  FiMapPin,
  FiGlobe,
  FiUsers,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiChevronUp
} = FiIcons

const DirectoryFilters = ({ options, filters, onChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    languages: true,
    services: true,
    availability: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleStateChange = (state) => {
    onChange({
      ...filters,
      state: filters.state === state ? null : state
    })
  }

  const handleLanguageChange = (language) => {
    const currentLanguages = filters.languages || []
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language]
    
    onChange({
      ...filters,
      languages: newLanguages.length > 0 ? newLanguages : null
    })
  }

  const handleServiceChange = (service) => {
    const currentServices = filters.services || []
    const newServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service]
    
    onChange({
      ...filters,
      services: newServices.length > 0 ? newServices : null
    })
  }

  const handleCalendlyChange = () => {
    onChange({
      ...filters,
      hasCalendly: !filters.hasCalendly
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-polynesian-blue mb-3">Filter Results</h3>
        
        {/* Location Filter */}
        <div className="border-t border-gray-200 pt-4 pb-2">
          <button 
            className="flex items-center justify-between w-full text-left font-medium text-polynesian-blue"
            onClick={() => toggleSection('location')}
          >
            <div className="flex items-center">
              <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2 text-picton-blue" />
              <span>Location</span>
            </div>
            <SafeIcon 
              icon={expandedSections.location ? FiChevronUp : FiChevronDown} 
              className="w-4 h-4 text-polynesian-blue/50" 
            />
          </button>
          
          {expandedSections.location && (
            <div className="mt-3 space-y-2">
              {options.states && options.states.length > 0 ? (
                <div className="max-h-48 overflow-y-auto pr-1">
                  {options.states.map((state) => (
                    <label 
                      key={state} 
                      className="flex items-center space-x-2 p-1 hover:bg-anti-flash-white rounded cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        checked={filters.state === state}
                        onChange={() => handleStateChange(state)}
                        className="rounded text-picton-blue focus:ring-picton-blue"
                      />
                      <span className="text-sm text-polynesian-blue/80">{state}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-polynesian-blue/50 italic">No locations available</p>
              )}
            </div>
          )}
        </div>
        
        {/* Languages Filter */}
        <div className="border-t border-gray-200 pt-4 pb-2">
          <button 
            className="flex items-center justify-between w-full text-left font-medium text-polynesian-blue"
            onClick={() => toggleSection('languages')}
          >
            <div className="flex items-center">
              <SafeIcon icon={FiGlobe} className="w-4 h-4 mr-2 text-picton-blue" />
              <span>Languages Spoken</span>
            </div>
            <SafeIcon 
              icon={expandedSections.languages ? FiChevronUp : FiChevronDown} 
              className="w-4 h-4 text-polynesian-blue/50" 
            />
          </button>
          
          {expandedSections.languages && (
            <div className="mt-3 space-y-2">
              {options.languages && options.languages.length > 0 ? (
                options.languages.map((language) => (
                  <label 
                    key={language} 
                    className="flex items-center space-x-2 p-1 hover:bg-anti-flash-white rounded cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      checked={filters.languages?.includes(language)}
                      onChange={() => handleLanguageChange(language)}
                      className="rounded text-picton-blue focus:ring-picton-blue"
                    />
                    <span className="text-sm text-polynesian-blue/80">{language}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-polynesian-blue/50 italic">No languages available</p>
              )}
            </div>
          )}
        </div>
        
        {/* Services Filter */}
        <div className="border-t border-gray-200 pt-4 pb-2">
          <button 
            className="flex items-center justify-between w-full text-left font-medium text-polynesian-blue"
            onClick={() => toggleSection('services')}
          >
            <div className="flex items-center">
              <SafeIcon icon={FiUsers} className="w-4 h-4 mr-2 text-picton-blue" />
              <span>Financial Services</span>
            </div>
            <SafeIcon 
              icon={expandedSections.services ? FiChevronUp : FiChevronDown} 
              className="w-4 h-4 text-polynesian-blue/50" 
            />
          </button>
          
          {expandedSections.services && (
            <div className="mt-3 space-y-2">
              {SERVICE_OPTIONS.map((service) => (
                <label 
                  key={service.value} 
                  className="flex items-center space-x-2 p-1 hover:bg-anti-flash-white rounded cursor-pointer"
                >
                  <input 
                    type="checkbox" 
                    checked={filters.services?.includes(service.value)}
                    onChange={() => handleServiceChange(service.value)}
                    className="rounded text-picton-blue focus:ring-picton-blue"
                  />
                  <span className="text-sm text-polynesian-blue/80">{service.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        {/* Availability Filter */}
        <div className="border-t border-gray-200 pt-4 pb-2">
          <button 
            className="flex items-center justify-between w-full text-left font-medium text-polynesian-blue"
            onClick={() => toggleSection('availability')}
          >
            <div className="flex items-center">
              <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2 text-picton-blue" />
              <span>Availability</span>
            </div>
            <SafeIcon 
              icon={expandedSections.availability ? FiChevronUp : FiChevronDown} 
              className="w-4 h-4 text-polynesian-blue/50" 
            />
          </button>
          
          {expandedSections.availability && (
            <div className="mt-3 space-y-2">
              <label 
                className="flex items-center space-x-2 p-1 hover:bg-anti-flash-white rounded cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  checked={filters.hasCalendly}
                  onChange={handleCalendlyChange}
                  className="rounded text-picton-blue focus:ring-picton-blue"
                />
                <span className="text-sm text-polynesian-blue/80">
                  Available for appointments
                </span>
              </label>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default DirectoryFilters