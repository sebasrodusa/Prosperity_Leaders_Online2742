import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { searchProfessionals } from '../../lib/directory'
import Card from '../ui/Card'
import Input from '../ui/Input'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiSearch, FiMapPin, FiGlobe, FiStar, FiCalendar } = FiIcons

const ProfessionalDirectory = () => {
  const [professionals, setProfessionals] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    language: '',
    service: ''
  })

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        const { professionals } = await searchProfessionals()
        setProfessionals(professionals)
      } catch (error) {
        console.error('Error loading professionals:', error)
      }
    }

    loadProfessionals()
  }, [])

  const filteredProfessionals = professionals.filter(professional => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (professional.full_name.toLowerCase().includes(searchLower) ||
        professional.bio.toLowerCase().includes(searchLower)) &&
      (!filters.location || professional.location === filters.location) &&
      (!filters.language || professional.languages?.includes(filters.language)) &&
      (!filters.service || professional.services?.includes(filters.service))
    )
  })

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<SafeIcon icon={FiSearch} className="text-gray-400" />}
            />
          </div>
          <Input
            placeholder="Filter by location"
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            prefix={<SafeIcon icon={FiMapPin} className="text-gray-400" />}
          />
          <Input
            placeholder="Filter by language"
            value={filters.language}
            onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
            prefix={<SafeIcon icon={FiGlobe} className="text-gray-400" />}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessionals.map(professional => (
          <motion.div
            key={professional.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to={`/${professional.username}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow" hover>
                <div className="flex items-start space-x-4">
                  <img
                    src={professional.profile_photo_url}
                    alt={professional.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-polynesian-blue">
                      {professional.full_name}
                    </h3>
                    <p className="text-sm text-polynesian-blue/70 mb-2">
                      {professional.title || "Financial Professional"}
                    </p>
                    
                    {professional.ratings && (
                      <div className="flex items-center space-x-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <SafeIcon 
                              key={i} 
                              icon={FiStar} 
                              className={`w-4 h-4 ${i < Math.floor(professional.ratings.average) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-polynesian-blue">
                          {professional.ratings.average.toFixed(1)}
                        </span>
                        <span className="text-sm text-polynesian-blue/60">
                          ({professional.ratings.count} reviews)
                        </span>
                      </div>
                    )}
                    
                    <p className="text-sm text-polynesian-blue/70 line-clamp-2 mb-2">
                      {professional.bio}
                    </p>
                    
                    {professional.calendly_link && (
                      <div className="mt-2 text-xs text-picton-blue flex items-center">
                        <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                        <span>Available for appointments</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProfessionalDirectory

