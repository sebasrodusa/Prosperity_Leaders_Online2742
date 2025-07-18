import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Card from '../ui/Card'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiSave, FiUser, FiMail, FiPhone, FiInstagram, FiFacebook, FiLinkedin, FiYoutube } = FiIcons

const ProfileEditor = () => {
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    agent_id: user?.agent_id || '',
    international_id: user?.international_id || '',
    calendly_link: user?.calendly_link || '',
    social_links: {
      instagram: user?.social_links?.instagram || '',
      facebook: user?.social_links?.facebook || '',
      linkedin: user?.social_links?.linkedin || '',
      tiktok: user?.social_links?.tiktok || '',
      youtube: user?.social_links?.youtube || ''
    }
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (field, value) => {
    if (field.startsWith('social_links.')) {
      const socialField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user context
      const updatedUser = { ...user, ...formData }
      await login(updatedUser)
      
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <SafeIcon icon={FiUser} className="w-6 h-6 text-picton-blue" />
        <h2 className="text-xl font-semibold text-polynesian-blue">Profile Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            required
          />
          <Input
            label="Username"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
            placeholder="your-username"
          />
        </div>

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

        <Textarea
          label="Bio"
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Tell visitors about your expertise and services..."
          rows={4}
        />

        {/* Professional IDs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Agent ID (US)"
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

        {/* Calendar Integration */}
        <Input
          label="Calendly Link"
          value={formData.calendly_link}
          onChange={(e) => handleChange('calendly_link', e.target.value)}
          placeholder="https://calendly.com/your-username"
        />

        {/* Social Links */}
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

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ProfileEditor