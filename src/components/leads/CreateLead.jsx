import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { createLead } from '../../lib/leads'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiSave, FiArrowLeft, FiUser } = FiIcons

const CreateLead = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    status: 'new',
    notes: '',
    lead_source: 'manual_entry',
    tags: []
  })

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'meeting_scheduled', label: 'Meeting Scheduled' },
    { value: 'follow_up', label: 'Follow-Up' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' }
  ]

  const leadSourceOptions = [
    { value: 'manual_entry', label: 'Manual Entry' },
    { value: 'website_form', label: 'Website Form' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'networking_event', label: 'Networking Event' },
    { value: 'cold_outreach', label: 'Cold Outreach' },
    { value: 'other', label: 'Other' }
  ]

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const leadData = {
        ...formData,
        user_id: user.id
      }
      
      const newLead = await createLead(leadData)
      navigate(`/dashboard/leads/${newLead.id}`)
    } catch (error) {
      console.error('Error creating lead:', error)
      alert('Failed to create lead. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/leads')}
          className="flex items-center space-x-2"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          <span>Back to Leads</span>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <SafeIcon icon={FiUser} className="w-6 h-6 text-picton-blue" />
            <h2 className="text-xl font-semibold text-polynesian-blue">Add New Lead</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                required
                placeholder="John Smith"
              />
              
              <div>
                <label className="block text-sm font-medium text-polynesian-blue mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
                  required
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
              />
              
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-polynesian-blue mb-2">
                Lead Source
              </label>
              <select
                value={formData.lead_source}
                onChange={(e) => handleChange('lead_source', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
              >
                {leadSourceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              placeholder="Add any relevant notes about this lead..."
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/leads')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || !formData.full_name}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                <span>{saving ? 'Creating...' : 'Create Lead'}</span>
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default CreateLead