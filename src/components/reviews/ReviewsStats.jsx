import React from 'react'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiStar } = FiIcons

const ReviewsStats = ({ averageRating = 0, reviewCount = 0, className = '' }) => {
  const rating = Number(averageRating)
  if (!Number.isFinite(rating) || !reviewCount) {
    return null
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <SafeIcon
            key={i}
            icon={FiStar}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-polynesian-blue">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm text-polynesian-blue/60">
        ({reviewCount})
      </span>
    </div>
  )
}

export default ReviewsStats
