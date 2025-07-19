import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ReviewsList from './ReviewsList'
import ReviewForm from './ReviewForm'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { getApprovedReviews, getProfessionalRating } from '../../lib/reviews'

const { FiStar, FiMessageSquare } = FiIcons

const ReviewsSection = ({ professionalUsername, professionalId, showForm = true }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 5

  useEffect(() => {
    loadReviews()
  }, [professionalUsername])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const { reviews, averageRating, reviewCount } = await getApprovedReviews(professionalUsername)
      setReviews(reviews)
      setAverageRating(averageRating)
      setReviewCount(reviewCount)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  )
  
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiStar} className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-polynesian-blue">Client Testimonials</h2>
          </div>
          
          {showForm && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
              <span>Leave a Review</span>
            </Button>
          )}
        </div>

        {/* Reviews List */}
        <ReviewsList 
          reviews={paginatedReviews} 
          averageRating={averageRating} 
          reviewCount={reviewCount}
          loading={loading}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? 'bg-picton-blue text-white'
                      : 'bg-gray-100 text-polynesian-blue hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </Card>

      {/* Review Form */}
      {showForm && showReviewForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ReviewForm
            professionalUsername={professionalUsername}
            professionalId={professionalId}
          />
        </motion.div>
      )}
    </div>
  )
}

export default ReviewsSection