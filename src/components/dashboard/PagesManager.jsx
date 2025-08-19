import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { createPage, deletePage, supabase } from '../../lib/supabase'
import { getTemplateById, getAllTemplates } from '../../data/landingPageTemplates'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiPlus, FiTrash2, FiEdit3, FiExternalLink, FiGlobe } = FiIcons

const PagesManager = () => {
  const { user } = useAuth()
  const [pages, setPages] = useState([])
  const availableTemplates = getAllTemplates()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPage, setNewPage] = useState({
    template_type: 'standard',
    custom_username: '',
    title: ''
  })
  const [creating, setCreating] = useState(false)

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
      const pageData = {
        user_id: user.id,
        ...newPage,
        created_at: new Date().toISOString()
      }

      const created = await createPage(pageData)
      setPages(prev => [...prev, created])
      setShowCreateModal(false)
      setNewPage({
        template_type: 'standard',
        custom_username: '',
        title: ''
      })
    } catch (error) {
      console.error('Error creating page:', error)
      alert('Failed to create page')
    } finally {
      setCreating(false)
    }
  }

  const handleDeletePage = async (pageId) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
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
    return `https://prosperityleaders.net/${customUsername}`
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiGlobe} className="w-6 h-6 text-picton-blue" />
          <h2 className="text-xl font-semibold text-polynesian-blue">My Pages</h2>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Create Page</span>
        </Button>
      </div>

      <div className="space-y-4">
        {!Array.isArray(pages) || pages.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiGlobe} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-polynesian-blue/70">No pages found</p>
            <p className="text-sm text-polynesian-blue/50 mt-1">Create your first landing page to get started</p>
          </div>
        ) : (
          pages.map(page => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:bg-anti-flash-white/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                  {(() => {
                    const template = getTemplateById(page.template_type)
                    return (
                      <>
                        <div className={`w-3 h-3 rounded-full ${template?.color || 'bg-gray-500'}`} />
                        <h3 className="font-medium text-polynesian-blue">
                          {page.title || `${template?.name} Page`}
                        </h3>
                        <span className="text-sm text-polynesian-blue/60">
                          ({template?.name})
                        </span>
                      </>
                    )
                  })()}
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
          ))
        )}
      </div>

      {/* Create Page Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Page"
        size="lg"
      >
        <form onSubmit={handleCreatePage} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-polynesian-blue mb-2">
              Template Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableTemplates.map((template) => (
                <label
                  key={template.id}
                  className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-anti-flash-white/50 transition-colors ${
                    newPage.template_type === template.id ? 'border-picton-blue bg-picton-blue/5' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="template_type"
                    value={template.id}
                    checked={newPage.template_type === template.id}
                    onChange={(e) => setNewPage(prev => ({ ...prev, template_type: e.target.value }))}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${template.color}`} />
                    <div>
                      <p className="font-medium text-polynesian-blue">{template.name}</p>
                      <p className="text-sm text-polynesian-blue/70">{template.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Custom Username"
            value={newPage.custom_username}
            onChange={(e) => setNewPage(prev => ({ ...prev, custom_username: e.target.value }))}
            placeholder="your-page-name"
            required
          />

          <Input
            label="Page Title (Optional)"
            value={newPage.title}
            onChange={(e) => setNewPage(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Custom page title"
          />

          {newPage.custom_username && (
            <div className="p-3 bg-anti-flash-white rounded-lg">
              <p className="text-sm text-polynesian-blue/70">
                Your page will be available at:
              </p>
              <p className="font-medium text-picton-blue">
                {generatePageUrl(newPage.custom_username)}
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
            <Button
              type="submit"
              disabled={creating || !newPage.custom_username}
            >
              {creating ? 'Creating...' : 'Create Page'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  )
}

export default PagesManager

