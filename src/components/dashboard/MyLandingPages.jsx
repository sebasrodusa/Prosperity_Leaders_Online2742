import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { createPage, deletePage, supabase } from '../../lib/supabase'
import { getAllTemplates } from '../../data/landingPageTemplates'
import TemplateGallery from '../landingPages/TemplateGallery'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const { FiPlus, FiTrash2, FiEdit3, FiExternalLink, FiGlobe, FiInfo } = FiIcons

const MyLandingPages = () => {
  const { user } = useAuth()
  const [pages, setPages] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPage, setNewPage] = useState({
    template_type: 'recruiting',
    custom_username: '',
    title: ''
  })
  const [creating, setCreating] = useState(false)
  const availableTemplates = getAllTemplates()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.id) {
      const loadPages = async () => {
        const { data, error } = await supabase.rpc('get_user_landing_pages', {
          user_id: user.id
        })
        if (error) {
          console.error('Error loading pages:', error)
          return
        }
        setPages(data || [])
      }

      loadPages()
    } else if (!user || !user.id) {
      console.warn('user or user.id missing, skipping get_user_landing_pages')
    }
  }, [user])

  const handleCreatePage = async (e) => {
    e.preventDefault()
    setCreating(true)

    try {
      // Check if user already has a page with this template type
      const existingTemplate = pages.find(p => p.template_type === newPage.template_type)
      if (existingTemplate) {
        alert('You already have a page with this template type.')
        return
      }

      // Suggest a custom username if not provided
      let customUsername = newPage.custom_username
      if (!customUsername) {
        customUsername = `${user.username}-${newPage.template_type}`
      }

      const selectedTemplate = availableTemplates.find(t => t.id === newPage.template_type)
      const defaultContent = {
        ...selectedTemplate?.defaultContent,
        themeColor: selectedTemplate?.color,
        layout: 'default'
      }

      const pageData = {
        user_id: user.id,
        template_type: newPage.template_type,
        custom_username: customUsername,
        title: newPage.title || selectedTemplate?.name,
        created_at: new Date().toISOString(),
        content: JSON.stringify(defaultContent)
      }

      const created = await createPage(pageData)
      setPages(prev => [...prev, created])
      toast.success('Landing page created', {
        action: {
          label: 'View Page',
          onClick: () => window.open(generatePageUrl(created.custom_username), '_blank')
        },
        cancel: {
          label: 'Continue Editing',
          onClick: () => navigate(`/dashboard/landing-pages/${created.id}/edit`)
        }
      })
      navigate(`/dashboard/landing-pages/${created.id}/edit`)
    } catch (error) {
      console.error('Error creating page:', error)
      alert('Failed to create page')
    } finally {
      setCreating(false)
    }
  }

  const handleDeletePage = async (pageId) => {
    if (window.confirm('Are you sure you want to delete this landing page?')) {
      try {
        await deletePage(pageId)
        setPages(prev => prev.filter(page => page.id !== pageId))
      } catch (error) {
        console.error('Error deleting page:', error)
        alert('Failed to delete page')
      }
    }
  }

  const generatePageUrl = (customUsername) => {
    return `https://prosperityleaders.net/pages/${customUsername}`
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiGlobe} className="w-6 h-6 text-picton-blue" />
          <h2 className="text-xl font-semibold text-polynesian-blue">My Landing Pages</h2>
        </div>
        <Button
          onClick={() => {
            setNewPage({
              template_type: 'recruiting',
              custom_username: '',
              title: ''
            })
            setShowCreateModal(true)
          }}
          className="flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Create Landing Page</span>
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-700">
        <div className="font-medium mb-1 flex items-center">
          <SafeIcon icon={FiInfo} className="mr-2" />
          <span>Landing Pages vs. Professional Profile</span>
        </div>
        <p>
          Your professional profile is available at{' '}
          <span className="font-semibold">prosperityleaders.net/profile/{user?.username}</span>.
          Landing pages are additional marketing pages with specific themes you can create below.
        </p>
      </div>

      <div className="space-y-4">
        {pages.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiGlobe} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-polynesian-blue/70">No landing pages created yet</p>
            <p className="text-sm text-polynesian-blue/50 mt-1">
              Create your first landing page to attract prospects and clients
            </p>
          </div>
        ) : (
          pages.map(page => {
            const template = availableTemplates.find(t => t.id === page.template_type)
            
            return (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:bg-anti-flash-white/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${template?.color || 'bg-gray-500'}`} />
                      <h3 className="font-medium text-polynesian-blue">
                        {page.title || template?.name}
                      </h3>
                      <span className="text-sm text-polynesian-blue/60">
                        ({template?.name})
                      </span>
                    </div>
                    <p className="text-sm text-polynesian-blue/70 mt-1">
                      {generatePageUrl(page.custom_username)}
                    </p>
                    <p className="text-xs text-polynesian-blue/50 mt-2">
                      Created {new Date(page.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(generatePageUrl(page.custom_username), '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                      <span>Visit</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                      onClick={() => navigate(`/dashboard/landing-pages/${page.id}/edit`)}
                    >
                      <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeletePage(page.id)}
                      className="flex items-center space-x-1"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Create Landing Page Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Landing Page"
        size="lg"
      >
        <form onSubmit={handleCreatePage} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-polynesian-blue mb-2">
              Template Type
            </label>
            <TemplateGallery
              selected={newPage.template_type}
              onSelect={(id) => setNewPage(prev => ({ ...prev, template_type: id }))}
            />
          </div>

          <Input
            label="Custom URL Path"
            value={newPage.custom_username}
            onChange={(e) => setNewPage(prev => ({ ...prev, custom_username: e.target.value }))}
            placeholder={`${user?.username}-${newPage.template_type}`}
            required
          />

          <Input
            label="Page Title (Optional)"
            value={newPage.title}
            onChange={(e) => setNewPage(prev => ({ ...prev, title: e.target.value }))}
            placeholder={availableTemplates.find(t => t.id === newPage.template_type)?.name}
          />

          {(newPage.custom_username || user?.username) && (
            <div className="p-3 bg-anti-flash-white rounded-lg">
              <p className="text-sm text-polynesian-blue/70">
                Your landing page will be available at:
              </p>
              <p className="font-medium text-picton-blue">
                {generatePageUrl(
                  newPage.custom_username || `${user?.username}-${newPage.template_type}`
                )}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Page'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  )
}

export default MyLandingPages

