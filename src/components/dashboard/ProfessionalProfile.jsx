import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Modal from '../ui/Modal'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import ReviewsStats from '../reviews/ReviewsStats'
import { getProfessionalRating } from '../../lib/reviews'

const {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiInstagram,
  FiFacebook,
  FiLinkedin,
  FiYoutube,
  FiExternalLink,
  FiEdit3,
  FiSave,
  FiEye,
  FiStar,
  FiMessageSquare,
  FiCheck,
  FiX,
  FiInfo,
  FiPlus,
  FiToggleLeft,
  FiToggleRight
} = FiIcons

const ProfessionalProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [testimonials, setTestimonials] = useState([])
  const [showAddTestimonialModal, setShowAddTestimonialModal] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({ clientName: '', rating: 5, content: '', approved: false })
  const [ratingData, setRatingData] = useState({ averageRating: 0, reviewCount: 0 })
  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    agent_id: '',
    international_id: '',
    specialties: [],
    languages: [],
    states_licensed: [],
    calendly_link: '',
    calendar_embed_code: '',
    reviews_enabled: true,
    social_links: { instagram: '', facebook: '', linkedin: '', youtube: '' }
  })

  useEffect(() => {
    if (user) {
      // In a real app, fetch profile from API
      setProfile({
        ...user,
        title: user.title || 'Financial Professional',
        ratings: user.ratings || { average: 4.8, count: 24 },
        reviews_enabled: user.reviews_enabled !== false // default to true if not specified
      })

      setFormData({
        full_name: user.full_name || '',
        title: user.title || 'Financial Professional',
        bio: user.bio || '',
        email: user.email || '',
        phone: user.phone || '',
        agent_id: user.agent_id || '',
        international_id: user.international_id || '',
        specialties: user.specialties || [],
        languages: user.languages || [],
        states_licensed: user.states_licensed || [],
        calendly_link: user.calendly_link || '',
        calendar_embed_code: user.calendar_embed_code || '',
        reviews_enabled: user.reviews_enabled !== false, // default to true if not specified
        social_links: user.social_links || {}
      })

      // Load actual rating data
      loadRatingData(user.username)

      // Mock testimonials data
      setTestimonials([
        {
          id: 't1',
          clientName: 'Maria S.',
          rating: 5,
          content: 'Working with this professional has been transformative for our family\'s financial future. The personalized approach and attention to detail made all the difference.',
          approved: true,
          since: '2022'
        },
        {
          id: 't2',
          clientName: 'James T.',
          rating: 5,
          content: 'I appreciate the clear communication and expert guidance. My financial plan is now aligned with my long-term goals, giving me peace of mind.',
          approved: true,
          since: '2021'
        },
        {
          id: 't3',
          clientName: 'Robert K.',
          rating: 4,
          content: 'Great service and solid advice. Would recommend to friends and family.',
          approved: false,
          since: '2023'
        }
      ])
    }
  }, [user])

  const loadRatingData = async (username) => {
    try {
      const { averageRating, reviewCount } = await getProfessionalRating(username)
      setRatingData({ averageRating, reviewCount })
    } catch (error) {
      console.error('Error loading rating data:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProfile(prev => ({ ...prev, ...formData }))
      setEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    if (field.startsWith('social_links.')) {
      const socialField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        social_links: { ...prev.social_links, [socialField]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleApproveTestimonial = (testimonialId) => {
    setTestimonials(prev => 
      prev.map(t => t.id === testimonialId ? { ...t, approved: true } : t)
    )
  }

  const handleRejectTestimonial = (testimonialId) => {
    setTestimonials(prev => prev.filter(t => t.id !== testimonialId))
  }

  const handleAddTestimonial = () => {
    // In a real app, this would send the testimonial to the server
    const newId = `t${Date.now()}`
    const testimonial = {
      id: newId,
      clientName: newTestimonial.clientName,
      rating: newTestimonial.rating,
      content: newTestimonial.content,
      approved: false,
      since: new Date().getFullYear().toString()
    }
    setTestimonials(prev => [...prev, testimonial])
    setNewTestimonial({ clientName: '', rating: 5, content: '', approved: false })
    setShowAddTestimonialModal(false)
  }

  const profileUrl = `https://prosperityleaders.net/${user?.username}`

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiUser} className="w-6 h-6 text-picton-blue" />
            <h2 className="text-xl font-semibold text-polynesian-blue">My Professional Profile</h2>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={previewMode ? FiEdit3 : FiEye} className="w-4 h-4" />
              <span>{previewMode ? 'Edit Mode' : 'Preview Mode'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(profileUrl, '_blank')}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
              <span>View Public Profile</span>
            </Button>
            {!editing && !previewMode && (
              <Button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-700">
          <div className="font-medium mb-1 flex items-center">
            <SafeIcon icon={FiInfo} className="mr-2" />
            <span>Your Professional Profile</span>
          </div>
          <p>
            This is your primary public profile, always available at <span className="font-semibold">prosperityleaders.net/{user?.username}</span>. It represents you in the professional directory and is linked from all your landing pages.
          </p>
        </div>

        {previewMode ? (
          // Preview Mode
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
                <img
                  src={profile.profile_photo_url}
                  alt={profile.full_name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-picton-blue/20"
                />
                <h1 className="text-2xl font-bold text-polynesian-blue mb-1">{profile.full_name}</h1>
                <p className="text-polynesian-blue/70 mb-2">{formData.title}</p>

                {/* Ratings */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <ReviewsStats
                    averageRating={ratingData.averageRating ?? profile.ratings.average ?? 0}
                    reviewCount={ratingData.reviewCount ?? profile.ratings.count ?? 0}
                  />
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-polynesian-blue/70">
                    <SafeIcon icon={FiMail} className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{formData.email}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex items-center justify-center space-x-2 text-polynesian-blue/70">
                      <SafeIcon icon={FiPhone} className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{formData.phone}</span>
                    </div>
                  )}
                </div>

                {/* Calendar Button */}
                {formData.calendly_link && (
                  <div className="inline-flex items-center justify-center w-full px-4 py-2 bg-picton-blue text-white rounded-lg mb-4">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                    Book Appointment
                  </div>
                )}

                {/* Leave a Review Button - Only if reviews are enabled */}
                {formData.reviews_enabled && (
                  <div className="inline-flex items-center justify-center w-full px-4 py-2 bg-white border border-picton-blue text-picton-blue rounded-lg mb-6">
                    <SafeIcon icon={FiMessageSquare} className="w-4 h-4 mr-2" />
                    Leave a Review
                  </div>
                )}

                {/* Social Links */}
                {Object.values(formData.social_links).some(Boolean) && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-polynesian-blue mb-3">Connect With Me</h3>
                    <div className="flex justify-center space-x-3">
                      {Object.entries(formData.social_links).map(([platform, url]) => {
                        if (!url) return null
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
                          <div
                            key={platform}
                            className={`p-2 rounded-full bg-anti-flash-white ${colors[platform]}`}
                          >
                            <SafeIcon icon={icons[platform]} className="w-5 h-5" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Professional IDs */}
                {(formData.agent_id || formData.international_id) && (
                  <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-polynesian-blue/60">
                    {formData.agent_id && <div>Agent ID: {formData.agent_id}</div>}
                    {formData.international_id && <div>International ID: {formData.international_id}</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* About Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-polynesian-blue mb-4">About Me</h2>
                  <p className="text-polynesian-blue/70">{formData.bio}</p>
                </div>

                {/* Testimonials Section - Only if reviews are enabled */}
                {formData.reviews_enabled && (
                  <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-polynesian-blue">Client Testimonials</h2>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <SafeIcon
                              key={i}
                              icon={FiStar}
                              className={`w-4 h-4 ${
                                i < Math.floor(ratingData.averageRating ?? profile.ratings.average ?? 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-polynesian-blue">
                          {(ratingData.averageRating ?? profile.ratings.average ?? 0).toFixed(1)}
                        </span>
                        <span className="text-sm text-polynesian-blue/60">
                          ({ratingData.reviewCount ?? profile.ratings.count ?? 0} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {testimonials.filter(t => t.approved).map(testimonial => (
                        <div key={testimonial.id} className="bg-anti-flash-white p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <SafeIcon
                                  key={i}
                                  icon={FiStar}
                                  className={`w-4 h-4 ${
                                    i < testimonial.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-polynesian-blue/70 italic">
                            "{testimonial.content}"
                          </p>
                          <p className="text-xs text-polynesian-blue/50 mt-2">
                            - {testimonial.clientName}, Client since {testimonial.since}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Calendar Section */}
                {formData.calendar_embed_code && (
                  <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-polynesian-blue mb-4">Schedule a Consultation</h2>
                    <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                      [Calendar Widget Embedded Here]
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : editing ? (
          // Edit Mode
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                required
              />
              <Input
                label="Professional Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                placeholder="Financial Professional"
              />
            </div>

            <Textarea
              label="Professional Bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              required
              placeholder="Tell visitors about your expertise and services..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Agent ID"
                value={formData.agent_id}
                onChange={(e) => handleChange('agent_id', e.target.value)}
                placeholder="AG123456"
              />
              <Input
                label="International ID"
                value={formData.international_id}
                onChange={(e) => handleChange('international_id', e.target.value)}
                placeholder="INT123"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-polynesian-blue">Calendar Integration</h3>
              <Input
                label="Calendly Link"
                value={formData.calendly_link}
                onChange={(e) => handleChange('calendly_link', e.target.value)}
                placeholder="https://calendly.com/your-username"
              />
              <Textarea
                label="Calendar Embed Code (Optional)"
                value={formData.calendar_embed_code}
                onChange={(e) => handleChange('calendar_embed_code', e.target.value)}
                placeholder="<div class='calendly-inline-widget' data-url='your-calendly-url'></div>"
                rows={3}
              />
            </div>

            {/* Reviews Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-polynesian-blue">Reviews Settings</h3>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleChange('reviews_enabled', !formData.reviews_enabled)}
                  className="focus:outline-none"
                >
                  <SafeIcon
                    icon={formData.reviews_enabled ? FiToggleRight : FiToggleLeft}
                    className={`w-10 h-6 ${
                      formData.reviews_enabled ? 'text-picton-blue' : 'text-gray-400'
                    }`}
                  />
                </button>
                <span className="text-polynesian-blue">Enable client reviews on your profile</span>
              </div>
              <p className="text-sm text-polynesian-blue/70">
                When enabled, clients can submit reviews that will appear on your profile after approval.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-polynesian-blue">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiInstagram} className="w-5 h-5 text-pink-500" />
                  <Input
                    placeholder="Instagram URL"
                    value={formData.social_links.instagram || ''}
                    onChange={(e) => handleChange('social_links.instagram', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiFacebook} className="w-5 h-5 text-blue-500" />
                  <Input
                    placeholder="Facebook URL"
                    value={formData.social_links.facebook || ''}
                    onChange={(e) => handleChange('social_links.facebook', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiLinkedin} className="w-5 h-5 text-blue-600" />
                  <Input
                    placeholder="LinkedIn URL"
                    value={formData.social_links.linkedin || ''}
                    onChange={(e) => handleChange('social_links.linkedin', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiYoutube} className="w-5 h-5 text-red-500" />
                  <Input
                    placeholder="YouTube URL"
                    value={formData.social_links.youtube || ''}
                    onChange={(e) => handleChange('social_links.youtube', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </form>
        ) : (
          // View Mode (not preview, not editing)
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={profile.profile_photo_url}
                alt={profile.full_name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-2xl font-bold text-polynesian-blue">{profile.full_name}</h3>
                <p className="text-polynesian-blue/70">{profile.title}</p>
                
                {/* Show actual ratings from reviews */}
                <ReviewsStats 
                  averageRating={ratingData.averageRating} 
                  reviewCount={ratingData.reviewCount} 
                  className="mt-2" 
                />
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-polynesian-blue/70">{profile.bio}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-polynesian-blue mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <p className="flex items-center space-x-2 text-polynesian-blue/70">
                    <SafeIcon icon={FiMail} className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </p>
                  {profile.phone && (
                    <p className="flex items-center space-x-2 text-polynesian-blue/70">
                      <SafeIcon icon={FiPhone} className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-polynesian-blue mb-2">Professional IDs</h4>
                <div className="space-y-2">
                  {profile.agent_id && (
                    <p className="text-polynesian-blue/70">Agent ID: {profile.agent_id}</p>
                  )}
                  {profile.international_id && (
                    <p className="text-polynesian-blue/70">International ID: {profile.international_id}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <SafeIcon
                icon={profile.reviews_enabled !== false ? FiToggleRight : FiToggleLeft}
                className={`w-10 h-6 ${
                  profile.reviews_enabled !== false ? 'text-picton-blue' : 'text-gray-400'
                }`}
              />
              <span className="text-polynesian-blue">
                Client reviews are {profile.reviews_enabled !== false ? 'enabled' : 'disabled'}
              </span>
            </div>

            {profile.calendly_link && (
              <div>
                <h4 className="font-medium text-polynesian-blue mb-2">Schedule a Consultation</h4>
                <Button
                  onClick={() => window.open(profile.calendly_link, '_blank')}
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                  <span>Book an Appointment</span>
                </Button>
              </div>
            )}

            {Object.values(profile.social_links || {}).some(Boolean) && (
              <div>
                <h4 className="font-medium text-polynesian-blue mb-2">Connect With Me</h4>
                <div className="flex space-x-4">
                  {profile.social_links?.instagram && (
                    <a
                      href={profile.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-600"
                    >
                      <SafeIcon icon={FiInstagram} className="w-6 h-6" />
                    </a>
                  )}
                  {profile.social_links?.facebook && (
                    <a
                      href={profile.social_links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <SafeIcon icon={FiFacebook} className="w-6 h-6" />
                    </a>
                  )}
                  {profile.social_links?.linkedin && (
                    <a
                      href={profile.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <SafeIcon icon={FiLinkedin} className="w-6 h-6" />
                    </a>
                  )}
                  {profile.social_links?.youtube && (
                    <a
                      href={profile.social_links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-600"
                    >
                      <SafeIcon icon={FiYoutube} className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Testimonials Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiStar} className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-polynesian-blue">Client Testimonials</h2>
          </div>
          <Button
            onClick={() => setShowAddTestimonialModal(true)}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Testimonial</span>
          </Button>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiStar} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-polynesian-blue/70">No testimonials yet</p>
            <p className="text-sm text-polynesian-blue/50 mt-1">
              Add testimonials to showcase client experiences
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-polynesian-blue mb-2">Approved Testimonials</h3>
            {testimonials.filter(t => t.approved).length > 0 ? (
              <div className="space-y-4">
                {testimonials
                  .filter(t => t.approved)
                  .map(testimonial => (
                    <div key={testimonial.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <SafeIcon
                              key={i}
                              icon={FiStar}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-polynesian-blue/70 italic mb-2">"{testimonial.content}"</p>
                      <p className="text-sm text-polynesian-blue/50">
                        - {testimonial.clientName}, Client since {testimonial.since}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-polynesian-blue/50 italic">No approved testimonials yet</p>
            )}

            <h3 className="text-lg font-medium text-polynesian-blue mt-6 mb-2">Pending Approval</h3>
            {testimonials.filter(t => !t.approved).length > 0 ? (
              <div className="space-y-4">
                {testimonials
                  .filter(t => !t.approved)
                  .map(testimonial => (
                    <div key={testimonial.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <SafeIcon
                              key={i}
                              icon={FiStar}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveTestimonial(testimonial.id)}
                            className="flex items-center space-x-1"
                          >
                            <SafeIcon icon={FiCheck} className="w-3 h-3" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRejectTestimonial(testimonial.id)}
                            className="flex items-center space-x-1"
                          >
                            <SafeIcon icon={FiX} className="w-3 h-3" />
                            <span>Reject</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-polynesian-blue/70 italic mb-2">"{testimonial.content}"</p>
                      <p className="text-sm text-polynesian-blue/50">
                        - {testimonial.clientName}, Client since {testimonial.since}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-polynesian-blue/50 italic">No pending testimonials</p>
            )}
          </div>
        )}
      </Card>

      {/* Add Testimonial Modal */}
      <Modal
        isOpen={showAddTestimonialModal}
        onClose={() => setShowAddTestimonialModal(false)}
        title="Add Client Testimonial"
      >
        <form className="space-y-4">
          <Input
            label="Client Name"
            value={newTestimonial.clientName}
            onChange={(e) => setNewTestimonial(prev => ({ ...prev, clientName: e.target.value }))}
            placeholder="John Smith"
            required
          />
          <div>
            <label className="block text-sm font-medium text-polynesian-blue mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setNewTestimonial(prev => ({ ...prev, rating }))}
                  className="p-1 focus:outline-none"
                >
                  <SafeIcon
                    icon={FiStar}
                    className={`w-6 h-6 ${
                      rating <= newTestimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            label="Testimonial Content"
            value={newTestimonial.content}
            onChange={(e) => setNewTestimonial(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Share what the client said about your services..."
            rows={4}
            required
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddTestimonialModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddTestimonial}
              disabled={!newTestimonial.clientName || !newTestimonial.content}
            >
              Add Testimonial
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ProfessionalProfile
