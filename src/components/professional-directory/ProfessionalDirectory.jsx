import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import DirectoryFilters from './DirectoryFilters'
import DirectoryCard from './DirectoryCard'
import { searchProfessionals, getFilterOptions } from '../../lib/directory'

const {
  FiSearch,
  FiFilter,
  FiX,
  FiMapPin,
  FiGlobe,
  FiUsers
} = FiIcons

const ProfessionalDirectory = () => {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    state: null,
    languages: null,
    services: null,
    hasCalendly: false
  })
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    languages: [],
    services: [],
    specialties: []
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  })

  useEffect(() => {
    loadFilterOptions()
  }, [])

  useEffect(() => {
    loadProfessionals()
  }, [pagination.currentPage, filters])

  const loadFilterOptions = async () => {
    try {
      const options = await getFilterOptions()
      setFilterOptions(options)
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  const loadProfessionals = async () => {
    try {
      setLoading(true)
      const { professionals, pagination: paginationData } = await searchProfessionals(
        searchQuery,
        filters,
        pagination.currentPage
      )
      setProfessionals(professionals)
      setPagination(paginationData)
    } catch (error) {
      console.error('Error loading professionals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    loadProfessionals()
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleClearFilters = () => {
    setFilters({
      state: null,
      languages: null,
      services: null,
      hasCalendly: false
    })
    setSearchQuery('')
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(
    value => value !== null && value !== false && (Array.isArray(value) ? value.length > 0 : true)
  ) || searchQuery !== ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-polynesian-blue mb-4">
          Find a Financial Professional
        </h1>
        <p className="text-polynesian-blue/70">
          Connect with our network of experienced financial professionals
        </p>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:flex-grow">
            <form onSubmit={handleSearch} className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location, or services..."
                className="pl-10 pr-24"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
            </form>
          </div>

          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
              onClick={() => setShowMobileFilters(true)}
            >
              <SafeIcon icon={FiFilter} className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex items-center flex-wrap gap-2">
            <span className="text-sm text-polynesian-blue/70">Active Filters:</span>
            
            {searchQuery && (
              <div className="bg-picton-blue/10 text-picton-blue text-sm py-1 px-3 rounded-full flex items-center">
                <span>Search: {searchQuery}</span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-picton-blue/70 hover:text-picton-blue"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
              </div>
            )}

            {filters.state && (
              <div className="bg-picton-blue/10 text-picton-blue text-sm py-1 px-3 rounded-full flex items-center">
                <SafeIcon icon={FiMapPin} className="w-3 h-3 mr-1" />
                <span>State: {filters.state}</span>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, state: null }))}
                  className="ml-2 text-picton-blue/70 hover:text-picton-blue"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
              </div>
            )}

            {filters.languages && filters.languages.length > 0 && (
              <div className="bg-picton-blue/10 text-picton-blue text-sm py-1 px-3 rounded-full flex items-center">
                <SafeIcon icon={FiGlobe} className="w-3 h-3 mr-1" />
                <span>Languages: {filters.languages.join(', ')}</span>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, languages: null }))}
                  className="ml-2 text-picton-blue/70 hover:text-picton-blue"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
              </div>
            )}

            {filters.services && filters.services.length > 0 && (
              <div className="bg-picton-blue/10 text-picton-blue text-sm py-1 px-3 rounded-full flex items-center">
                <SafeIcon icon={FiUsers} className="w-3 h-3 mr-1" />
                <span>Services: {filters.services.length} selected</span>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, services: null }))}
                  className="ml-2 text-picton-blue/70 hover:text-picton-blue"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
              </div>
            )}

            {filters.hasCalendly && (
              <div className="bg-picton-blue/10 text-picton-blue text-sm py-1 px-3 rounded-full flex items-center">
                <span>Available for Appointment</span>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, hasCalendly: false }))}
                  className="ml-2 text-picton-blue/70 hover:text-picton-blue"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-sm"
            >
              Clear All
            </Button>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block">
          <DirectoryFilters 
            options={filterOptions}
            filters={filters}
            onChange={handleFilterChange}
          />
        </div>

        {/* Mobile Filters (Slide-in Panel) */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-40 lg:hidden overflow-hidden">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowMobileFilters(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-screen max-w-md h-full bg-white shadow-xl flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-medium text-polynesian-blue">Filters</h2>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <DirectoryFilters 
                    options={filterOptions}
                    filters={filters}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="border-t p-4 flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    Apply
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-polynesian-blue/70">
              Found {pagination.totalCount} professional{pagination.totalCount !== 1 ? 's' : ''}
            </p>
            <div className="text-sm text-polynesian-blue/70">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-polynesian-blue/70">No professionals found</p>
              <p className="text-sm text-polynesian-blue/50 mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {professionals.map((professional) => (
                  <DirectoryCard key={professional.id} professional={professional} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-1">
                      {[...Array(pagination.totalPages)].map((_, index) => (
                        <Button
                          key={index}
                          variant={pagination.currentPage === index + 1 ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(index + 1)}
                          className={pagination.currentPage === index + 1 ? 'bg-picton-blue' : ''}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfessionalDirectory
