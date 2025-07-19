import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const {
  FiMapPin,
  FiCalendar,
  FiGlobe,
  FiStar,
  FiMessageSquare
} = FiIcons

const DirectoryCard = ({ professional }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300" hover>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src={professional.profile_photo_url || 'https://via.placeholder.com/60?text=Profile'} 
              alt={professional.full_name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-picton-blue/20"
            />
            <div>
              <h3 className="font-semibold text-polynesian-blue">
                {professional.full_name}
              </h3>
              <p className="text-sm text-polynesian-blue/70">
                {professional.title || 'Financial Professional'}
              </p>
              
              {/* Rating Stars */}
              {professional.average_rating > 0 && (
                <div className="flex items-center space-x-1 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <SafeIcon 
                        key={i} 
                        icon={FiStar} 
                        className={`w-3 h-3 ${
                          i < Math.floor(professional.average_rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-polynesian-blue/60">
                    ({professional.review_count})
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 flex-1 mb-4">
            {/* Location */}
            {(professional.city || professional.state) && (
              <div className="flex items-start space-x-2 text-sm text-polynesian-blue/70">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  {[
                    professional.city, 
                    professional.state,
                    professional.country !== 'USA' ? professional.country : null
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            
            {/* Languages */}
            {professional.languages && professional.languages.length > 0 && (
              <div className="flex items-start space-x-2 text-sm text-polynesian-blue/70">
                <SafeIcon icon={FiGlobe} className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Speaks: {professional.languages.join(', ')}</span>
              </div>
            )}
            
            {/* Services */}
            {professional.services_offered && professional.services_offered.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {professional.services_offered.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-picton-blue/10 text-picton-blue text-xs rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                  {professional.services_offered.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{professional.services_offered.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* Calendly Badge */}
            {professional.has_calendly && (
              <div className="mt-2 flex items-center space-x-1 text-green-600 text-xs">
                <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                <span>Available for appointments</span>
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
            <Link to={`/${professional.username}`} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center space-x-1"
              >
                <span>View Profile</span>
              </Button>
            </Link>
            
            {professional.has_calendly && (
              <Button
                className="flex-1 flex items-center justify-center space-x-1"
                onClick={() => window.open(`/${professional.username}#schedule`, '_blank')}
              >
                <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                <span>Book Now</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default DirectoryCard