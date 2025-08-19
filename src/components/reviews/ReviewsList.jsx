import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiStar } = FiIcons

const ReviewsList = ({ reviews, averageRating = 0, reviewCount = 0, loading = false }) => {
  const rating = Number(averageRating)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-polynesian-blue/70">No reviews yet. Be the first to leave a review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <SafeIcon
                key={i}
                icon={FiStar}
                className={`w-5 h-5 ${
                  i < Math.floor(rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-lg font-medium text-polynesian-blue">
            {rating.toFixed(1)}
          </span>
        </div>
        <span className="text-sm text-polynesian-blue/60">
          Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-anti-flash-white p-4 rounded-lg"
          >
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <SafeIcon
                    key={i}
                    icon={FiStar}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-polynesian-blue/70 italic mb-2">
              "{review.review_text}"
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-polynesian-blue/50">
                - {review.reviewer_name}
              </p>
              <p className="text-xs text-polynesian-blue/50">
                {new Date(review.submitted_at).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsList
