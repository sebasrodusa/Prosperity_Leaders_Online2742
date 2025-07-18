import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

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
  FiSave
} = FiIcons

const ProfessionalProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    agent_id: '',
    international_id: '',
    calendly_link: '',
    calendar_embed_code: '',
    social_links: {
      instagram: '',
      facebook: '',
      linkedin: '',
      youtube: ''
    }
  })

  useEffect(() => {
    if (user) {
      // In a real app, fetch profile from API
      setProfile({
        ...user,
        title: 'Financial Professional',
        ratings: {
          average: 4.8,
          count: 24
        }
      })
      setFormData({
        full_name: user.full_name || '',
        title: user.title || 'Financial Professional',
        bio: user.bio || '',
        email: user.email || '',
        phone: user.phone || '',
        agent_id: user.agent_id || '',
        international_id: user.international_id || '',
        calendly_link: user.calendly_link || '',
        calendar_embed_code: user.calendar_embed_code || '',
        social_links: user.social_links || {}
      })
    }
  }, [user])

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

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  const profileUrl = `https://prosperityleaders.net/${user.username}`

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiUser} className="w-6 h-6 text-picton-blue" />
            <h2 className="text-xl font-semibold text-polynesian-blue">Professional Profile</h2>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => window.open(profileUrl, '_blank')}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
              <span>View Public Profile</span>
            </Button>
            {!editing && (
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

        {editing ? (
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
              />
            </div>

            <Textarea
              label="Professional Bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              required
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

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-polynesian-blue">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiInstagram} className="w-5 h-5 text-pink-500" />
                  <Input
                    placeholder="Instagram URL"
                    value={formData.social_links.instagram}
                    onChange={(e) => handleChange('social_links.instagram', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiFacebook} className="w-5 h-5 text-blue-500" />
                  <Input
                    placeholder="Facebook URL"
                    value={formData.social_links.facebook}
                    onChange={(e) => handleChange('social_links.facebook', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiLinkedin} className="w-5 h-5 text-blue-600" />
                  <Input
                    placeholder="LinkedIn URL"
                    value={formData.social_links.linkedin}
                    onChange={(e) => handleChange('social_links.linkedin', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiYoutube} className="w-5 h-5 text-red-500" />
                  <Input
                    placeholder="YouTube URL"
                    value={formData.social_links.youtube}
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
                {profile.ratings && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-${i < Math.floor(profile.ratings.average) ? 'yellow' : 'gray'}-400`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-polynesian-blue/60">
                      ({profile.ratings.count} reviews)
                    </span>
                  </div>
                )}
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
    </div>
  )
}

export default ProfessionalProfile