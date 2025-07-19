import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { 
  getAllReviews, 
  approveReview, 
  rejectReview, 
  deleteReview 
} from '../../lib/reviews'

const { 
  FiStar, 
  FiCheck, 
  FiX, 
  FiTrash2, 
  FiFilter, 
  FiSearch, 
  FiAlertCircle 
} = FiIcons

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [processingAction, setProcessingAction] = useState(false)
  
  const statusFilters = [
    { value: 'all', label: 'All Reviews' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  useEffect(() => {
    loadReviews()
  }, [filter])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const data = await getAllReviews(filter)
      setReviews(data)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId) => {
    setProcessingAction(true)
    try {
      await approveReview(reviewId)
      loadReviews()
    } catch (error) {
      console.error('Error approving review:', error)
      alert('Failed to approve review')
    } finally {
      setProcessingAction(false)
    }
  }

  const handleReject = async (reviewId) => {
    setProcessingAction(true)
    try {
      await rejectReview(reviewId)
      loadReviews()
    } catch (error) {
      console.error('Error rejecting review:', error)
      alert('Failed to reject review')
    } finally {
      setProcessingAction(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedReview) return
    
    setProcessingAction(true)
    try {
      await deleteReview(selectedReview.id)
      setShowDeleteModal(false)
      loadReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    } finally {
      setProcessingAction(false)
    }
  }

  const confirmDelete = (review) => {
    setSelectedReview(review)
    setShowDeleteModal(true)
  }

  const filteredReviews = reviews.filter((review) => {
    if (!searchQuery) return true
    
    return (
      review.reviewer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.professional_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.review_text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiStar} className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-semibold text-polynesian-blue">Reviews Management</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center space-x-2 md:w-auto w-full">
          <SafeIcon icon={FiFilter} className="text-gray-500 w-4 h-4" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
          >
            {statusFilters.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative flex-1 max-w-md">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Reviews Table */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiStar} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-polynesian-blue/70">
            {filter !== 'all' ? `No ${filter} reviews found` : 'No reviews found'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-anti-flash-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                  Reviewer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                  Professional
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                  Review
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-polynesian-blue uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review, index) => (
                <motion.tr
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-anti-flash-white/30 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-polynesian-blue">
                      {review.reviewer_name}
                    </div>
                    {review.reviewer_email && (
                      <div className="text-xs text-polynesian-blue/60">
                        {review.reviewer_email}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-polynesian-blue">
                    {review.professional_username}
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
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
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm text-polynesian-blue/70 max-w-xs truncate">
                      {review.review_text}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(review.status)}
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-polynesian-blue/70">
                    {new Date(review.submitted_at).toLocaleDateString()}
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {review.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            disabled={processingAction}
                            className="flex items-center space-x-1"
                          >
                            <SafeIcon icon={FiCheck} className="w-3 h-3" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(review.id)}
                            disabled={processingAction}
                            className="flex items-center space-x-1"
                          >
                            <SafeIcon icon={FiX} className="w-3 h-3" />
                            <span>Reject</span>
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => confirmDelete(review)}
                        disabled={processingAction}
                        className="flex items-center space-x-1"
                      >
                        <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Review"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-red-600">
            <SafeIcon icon={FiAlertCircle} className="w-6 h-6" />
            <p className="font-medium">Are you sure you want to delete this review?</p>
          </div>
          
          {selectedReview && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <SafeIcon
                    key={i}
                    icon={FiStar}
                    className={`w-4 h-4 ${
                      i < selectedReview.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-polynesian-blue/70 mb-2">"{selectedReview.review_text}"</p>
              <p className="text-xs text-polynesian-blue/50">- {selectedReview.reviewer_name}</p>
            </div>
          )}
          
          <p className="text-polynesian-blue/70">
            This action cannot be undone. The review will be permanently removed from the system.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={processingAction}
            >
              {processingAction ? 'Deleting...' : 'Delete Review'}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  )
}

export default ReviewsManagement