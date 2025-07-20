import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { submitReview } from '../../lib/reviews'

const { FiStar, FiSend, FiCheckCircle } = FiIcons

const ReviewForm = ({ professionalUsername, professionalId }) => {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm()

  const onSubmit = async (data) => {
    if (rating === 0) {
      alert("Please select a rating before submitting.")
      return
    }
    
    setSubmitting(true)
    try {
      await submitReview({
        professionalId,
        professionalUsername,
        reviewerName: data.name,
        reviewerEmail: data.email || null,
        rating,
        reviewText: data.reviewText
      })
      
      setSubmitted(true)
      reset()
      setRating(0)
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit your review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="p-6">
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <SafeIcon icon={FiCheckCircle} className="w-8 h-8 text-green-600" />
          </motion.div>
          <h3 className="text-xl font-semibold text-polynesian-blue mb-2">
            Thank You For Your Review!
          </h3>
          <p className="text-polynesian-blue/70 mb-6">
            Your review has been submitted and is pending approval. We appreciate your feedback!
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Write Another Review
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-polynesian-blue mb-4">
        Leave a Review
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Your Name"
          error={errors.name?.message}
          required
          {...register('name', { required: 'Name is required' })}
        />
        
        <Input
          label="Email Address (Optional)"
          type="email"
          error={errors.email?.message}
          {...register('email', { 
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        
        <div>
          <label className="block text-sm font-medium text-polynesian-blue mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none"
              >
                <SafeIcon
                  icon={FiStar}
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating === 0 && (
            <p className="text-sm text-red-500 mt-1">Please select a rating</p>
          )}
        </div>
        
        <Textarea
          label="Your Review"
          error={errors.reviewText?.message}
          rows={4}
          required
          placeholder="Share your experience working with this professional..."
          {...register('reviewText', { 
            required: 'Review text is required',
            minLength: {
              value: 10,
              message: 'Review must be at least 10 characters long'
            }
          })}
        />
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
            className="flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiSend} className="w-4 h-4" />
                <span>Submit Review</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ReviewForm
