import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { getUserByUsername } from '../../lib/supabase'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import ReviewsSection from '../reviews/ReviewsSection'
import ReviewsStats from '../reviews/ReviewsStats'
import { getProfessionalRating } from '../../lib/reviews'

const {
  FiMail,
  FiPhone,
  FiCalendar,
  FiInstagram,
  FiFacebook,
  FiLinkedin,
  FiYoutube,
  FiExternalLink,
  FiStar,
  FiMessageSquare
} = FiIcons

const ProfilePage = () => {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [ratingData, setRatingData] = useState({
    averageRating: 0,
    reviewCount: 0
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        // Fetch user by username from Supabase
        const user = await getUserByUsername(username)

        if (user) {
          setProfile({
            ...user,
            title: user.title || 'Financial Professional',
            ratings: user.ratings || { average: 4.8, count: 24 }
          })
          
          // Get actual reviews data
          const { averageRating, reviewCount } = await getProfessionalRating(username)
          setRatingData({
            averageRating,
            reviewCount
          })
        } else {
          // Not found
          setProfile(null)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProfile()
  }, [username])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-anti-flash-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-anti-flash-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-polynesian-blue mb-4">Profile Not Found</h1>
          <p className="text-polynesian-blue/70">The professional you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const socialLinks = Object.entries(profile.social_links || {}).filter(([_, value]) => value)

  return (
    <div className="min-h-screen bg-gradient-to-br from-anti-flash-white to-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-polynesian-blue shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-picton-blue" />
              <span className="text-sm font-medium text-white/90">Professional Profile</span>
            </div>
            <div className="text-sm text-white/70">Prosperity Online</div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="text-center">
                <img
                  src={profile.profile_photo_url}
                  alt={profile.full_name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-picton-blue/20"
                />
                <h1 className="text-2xl font-bold text-polynesian-blue mb-1">{profile.full_name}</h1>
                <p className="text-polynesian-blue/70 mb-2">{profile.title}</p>
                
                {/* Ratings - now using actual data */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <ReviewsStats 
                    averageRating={ratingData.averageRating} 
                    reviewCount={ratingData.reviewCount} 
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2 text-polynesian-blue/70">
                  <SafeIcon icon={FiMail} className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-2 text-polynesian-blue/70">
                    <SafeIcon icon={FiPhone} className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
              </div>

              {/* Calendar Button */}
              {profile.calendly_link && (
                <motion.a
                  href={profile.calendly_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-picton-blue text-white rounded-lg hover:bg-picton-blue/90 transition-colors mb-4"
                >
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                  Book Appointment
                </motion.a>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-polynesian-blue mb-3">Connect With Me</h3>
                  <div className="flex justify-center space-x-3">
                    {socialLinks.map(([platform, url]) => {
                      const icons = {
                        instagram: FiInstagram,
                        facebook: FiFacebook,
                        linkedin: FiLinkedin,
                        youtube: FiYoutube
                      }
                      const colors = {
                        instagram: 'text-pink-500',
                        facebook: 'text-blue-600',
                        linkedin: 'text-blue-700',
                        youtube: 'text-red-500'
                      }
                      return (
                        <motion.a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className={`p-2 rounded-full bg-anti-flash-white hover:bg-gray-200 transition-colors ${colors[platform]}`}
                        >
                          <SafeIcon icon={icons[platform]} className="w-5 h-5" />
                        </motion.a>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Professional IDs */}
              {(profile.agent_id || profile.international_id) && (
                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-polynesian-blue/60">
                  {profile.agent_id && <div>Agent ID: {profile.agent_id}</div>}
                  {profile.international_id && <div>International ID: {profile.international_id}</div>}
                </div>
              )}
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-polynesian-blue mb-4">About Me</h2>
                <p className="text-polynesian-blue/70">{profile.bio}</p>
              </div>

              {/* Services Section */}
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-polynesian-blue mb-4">Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-picton-blue/10 p-4 rounded-lg border border-picton-blue/20">
                    <h4 className="font-semibold text-polynesian-blue mb-2">Financial Planning</h4>
                    <p className="text-sm text-polynesian-blue/70">
                      Comprehensive financial strategies tailored to your unique goals
                    </p>
                  </div>
                  <div className="bg-picton-blue/10 p-4 rounded-lg border border-picton-blue/20">
                    <h4 className="font-semibold text-polynesian-blue mb-2">Life Insurance</h4>
                    <p className="text-sm text-polynesian-blue/70">
                      Protection solutions to secure your family's financial future
                    </p>
                  </div>
                  <div className="bg-picton-blue/10 p-4 rounded-lg border border-picton-blue/20">
                    <h4 className="font-semibold text-polynesian-blue mb-2">Retirement Planning</h4>
                    <p className="text-sm text-polynesian-blue/70">
                      Strategies to help you achieve the retirement lifestyle you desire
                    </p>
                  </div>
                  <div className="bg-picton-blue/10 p-4 rounded-lg border border-picton-blue/20">
                    <h4 className="font-semibold text-polynesian-blue mb-2">Estate Planning</h4>
                    <p className="text-sm text-polynesian-blue/70">
                      Solutions to protect and transfer your wealth efficiently
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviews Section - New Component */}
              <ReviewsSection 
                professionalUsername={profile.username} 
                professionalId={profile.id}
                showForm={true}
              />

              {/* Calendar Section */}
              {profile.calendar_embed_code && (
                <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-polynesian-blue mb-4">Schedule a Consultation</h2>
                  <div className="calendly-container" dangerouslySetInnerHTML={{ __html: profile.calendar_embed_code }} />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage

