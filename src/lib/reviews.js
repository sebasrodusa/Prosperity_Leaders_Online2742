import { getSupabaseClient } from '@/lib/supabase.js'

// Get approved reviews for a professional
export const getApprovedReviews = async (professionalUsername) => {
  try {
    const supabase = await getSupabaseClient()
    const { data: reviews, error } = await supabase
      .from('reviews_12345')
      .select('*')
      .eq('professional_username', professionalUsername)
      .eq('status', 'approved')
      .order('submitted_at', { ascending: false })

    if (error) throw error

    // Get average rating using the function we created
    const { data: ratingData, error: ratingError } = await supabase
      .rpc('get_professional_rating', { p_username: professionalUsername })
    
    if (ratingError) throw ratingError

    // Get review count using the function we created
    const { data: countData, error: countError } = await supabase
      .rpc('count_professional_reviews', { p_username: professionalUsername })
    
    if (countError) throw countError

    return {
      reviews: reviews || [],
      averageRating: ratingData || 0,
      reviewCount: countData || 0
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return { reviews: [], averageRating: 0, reviewCount: 0 }
  }
}

// Get approved testimonials for homepage
export const getApprovedTestimonials = async (limit = 5) => {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('reviews_12345')
      .select('*')
      .eq('status', 'approved')
      .eq('featured', true)
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

// Get professional rating summary
export const getProfessionalRating = async (professionalUsername) => {
  try {
    // Get average rating
    const supabase = await getSupabaseClient()
    const { data: averageRating, error: ratingError } = await supabase
      .rpc('get_professional_rating', { p_username: professionalUsername })
    
    if (ratingError) throw ratingError

    // Get review count
    const { data: reviewCount, error: countError } = await supabase
      .rpc('count_professional_reviews', { p_username: professionalUsername })
    
    if (countError) throw countError

    return {
      averageRating: averageRating || 0,
      reviewCount: reviewCount || 0
    }
  } catch (error) {
    console.error('Error fetching professional rating:', error)
    return { averageRating: 0, reviewCount: 0 }
  }
}

// Submit a new review (public access)
export const submitReview = async (reviewData) => {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('reviews_12345')
      .insert([{
        professional_id: reviewData.professionalId,
        professional_username: reviewData.professionalUsername,
        reviewer_name: reviewData.reviewerName,
        reviewer_email: reviewData.reviewerEmail,
        rating: reviewData.rating,
        review_text: reviewData.reviewText,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])

    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error submitting review:', error)
    throw error
  }
}

// Admin functions

// Get all reviews (admin only)
export const getAllReviews = async (statusFilter = 'all') => {
  try {
    const supabase = await getSupabaseClient()
    let query = supabase
      .from('reviews_12345')
      .select('*')
      .order('submitted_at', { ascending: false })
    
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('Error fetching all reviews:', error)
    throw error
  }
}

// Approve a review (admin only)
export const approveReview = async (reviewId) => {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('reviews_12345')
      .update({ 
        status: 'approved', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', reviewId)
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error approving review:', error)
    throw error
  }
}

// Reject a review (admin only)
export const rejectReview = async (reviewId) => {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('reviews_12345')
      .update({ 
        status: 'rejected', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', reviewId)
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error rejecting review:', error)
    throw error
  }
}

// Delete a review (admin only)
export const deleteReview = async (reviewId) => {
  try {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
      .from('reviews_12345')
      .delete()
      .eq('id', reviewId)
    
    if (error) throw error
    
    return true
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error
  }
}

// Feature or unfeature a review for homepage (admin only)
export const toggleFeatureReview = async (reviewId, featured) => {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('reviews_12345')
      .update({ 
        featured,
        updated_at: new Date().toISOString() 
      })
      .eq('id', reviewId)
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error updating review feature status:', error)
    throw error
  }
}