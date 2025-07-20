import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { searchProfessionals } from '../../lib/directory'

const { FiSearch, FiX, FiUser } = FiIcons

// Simple debounce function implementation
const useDebounce = (fn, delay) => {
  const timerRef = React.useRef(null)
  
  return useCallback((...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    timerRef.current = setTimeout(() => {
      fn(...args)
    }, delay)
  }, [fn, delay])
}

const DirectorySearchWidget = ({ variant = 'default', className = '' }) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)

  // Search function
  const performSearch = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      // Search with just the query, no filters, first page, limit 5 results
      const { professionals } = await searchProfessionals(
        query,
        {},
        1,
        5
      )
      setSearchResults(professionals)
    } catch (error) {
      console.error('Error searching professionals:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  // Debounced search function
  const debouncedSearch = useDebounce(performSearch, 300)

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/find-a-professional?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowResults(false)
    }
  }

  const handleResultClick = (username) => {
    navigate(`/${username}`)
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

  const handleInputFocus = () => {
    setShowResults(true)
    if (searchQuery.length >= 2) {
      debouncedSearch(searchQuery)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  // Variant-specific styles
  const variants = {
    default: {
      container: "relative w-full max-w-2xl mx-auto",
      input: "w-full py-3 px-5 pr-12 rounded-lg shadow-lg text-polynesian-blue focus:outline-none focus:ring-2 focus:ring-picton-blue placeholder-gray-400",
      button: "absolute right-2 top-1/2 transform -translate-y-1/2 bg-picton-blue text-white p-2 rounded-md hover:bg-picton-blue/90 transition-colors"
    },
    compact: {
      container: "relative w-full",
      input: "w-full py-2 px-4 pr-10 rounded-md text-polynesian-blue focus:outline-none focus:ring-2 focus:ring-picton-blue placeholder-gray-400 text-sm",
      button: "absolute right-1 top-1/2 transform -translate-y-1/2 text-picton-blue p-1 hover:text-picton-blue/90 transition-colors"
    },
    navbar: {
      container: "relative hidden md:block w-full max-w-md",
      input: "w-full py-2 px-4 pr-10 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-picton-blue/50 placeholder-white/70 text-sm",
      button: "absolute right-1 top-1/2 transform -translate-y-1/2 text-white/70 p-1 hover:text-white transition-colors"
    }
  }

  const currentVariant = variants[variant] || variants.default

  return (
    <div className={`${currentVariant.container} ${className}`}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            placeholder="Find a financial professional..."
            className={currentVariant.input}
          />
          
          {searchQuery && (
            <button 
              type="button"
              onClick={clearSearch}
              className={`absolute ${variant === 'navbar' ? 'right-10' : 'right-12'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
            >
              <SafeIcon icon={FiX} className="w-4 h-4" />
            </button>
          )}
          
          <button
            type="submit"
            className={currentVariant.button}
          >
            <SafeIcon icon={FiSearch} className={variant === 'default' ? "w-5 h-5" : "w-4 h-4"} />
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && searchQuery.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-80 overflow-y-auto"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur event from closing dropdown when clicking inside
        >
          {loading ? (
            <div className="p-4 text-center text-polynesian-blue/70">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-picton-blue mr-2"></div>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm text-polynesian-blue/70">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
              {searchResults.map((professional) => (
                <div
                  key={professional.id}
                  className="p-3 hover:bg-anti-flash-white cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleResultClick(professional.username)}
                >
                  <div className="flex items-center space-x-3">
                    {professional.profile_photo_url ? (
                      <img
                        src={professional.profile_photo_url}
                        alt={professional.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-picton-blue/10 flex items-center justify-center">
                        <SafeIcon icon={FiUser} className="w-5 h-5 text-picton-blue" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-polynesian-blue">{professional.full_name}</p>
                      <p className="text-xs text-polynesian-blue/60">
                        {professional.title || 'Financial Professional'} {professional.city && `• ${professional.city}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-3 border-t border-gray-100 bg-anti-flash-white/50">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full text-center text-picton-blue hover:text-picton-blue/80 text-sm font-medium"
                >
                  View all results
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-polynesian-blue/70">
              No professionals found
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default DirectorySearchWidget
