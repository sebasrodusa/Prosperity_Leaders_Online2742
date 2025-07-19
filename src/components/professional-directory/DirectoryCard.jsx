import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import ReviewsStats from '../reviews/ReviewsStats'

const { FiMapPin, FiCalendar } = FiIcons

const DirectoryCard = ({ professional }) => {
  return (
    <motion.div
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
              
              {/* Reviews Stats Component */}
              {professional.ratings && (
                <ReviewsStats 
                  averageRating={professional.ratings.average} 
                  reviewCount={professional.ratings.count}
                  className="mb-2"
                />
              )}
              
              <p className="text-sm text-polynesian-blue/70 line-clamp-2 mb-2">
                {professional.bio}
              </p>
              
              {professional.location && (
                <div className="flex items-center text-xs text-polynesian-blue/60 mb-2">
                  <SafeIcon icon={FiMapPin} className="w-3 h-3 mr-1" />
                  <span>{professional.location}</span>
                </div>
              )}
              
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
  )
}

export default DirectoryCard