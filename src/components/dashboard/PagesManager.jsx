import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { mockPages, templateTypes } from '../../data/mockUsers'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiPlus, FiEye, FiTrash2, FiEdit3, FiExternalLink, FiGlobe } = FiIcons

const PagesManager = () => {
  const { user } = useAuth()
  const [pages, setPages] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPage, setNewPage] = useState({
    template_type: 'standard',
    custom_username: '',
    title: ''
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (user) {
      const userPages = mockPages.filter(page => page.user_id === user.id)
      setPages(userPages)
    }
  }, [user])

  const handleCreatePage = async (e) => {
    e.preventDefault()
    setCreating(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const pageData = {
        id: `page_${Date.now()}`,
        user_id: user.id,
        ...newPage,
        created_at: new Date().toISOString()
      }
      
      setPages(prev => [...prev, pageData])
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
          <SafeIcon icon={FiGlobe} className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">My Pages</h2>
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
        {pages.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiGlobe} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No pages created yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first landing page to get started</p>
          </div>
        ) : (
          pages.map(page => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${templateTypes[page.template_type].color}`} />
                    <h3 className="font-medium text-gray-900">
                      {page.title || `${templateTypes[page.template_type].name} Page`}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({templateTypes[page.template_type].name})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {generatePageUrl(page.custom_username)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(templateTypes).map(([key, template]) => (
                <label
                  key={key}
                  className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    newPage.template_type === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="template_type"
                    value={key}
                    checked={newPage.template_type === key}
                    onChange={(e) => setNewPage(prev => ({ ...prev, template_type: e.target.value }))}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${template.color}`} />
                    <div>
                      <p className="font-medium text-gray-900">{template.name}</p>
                      <p className="text-sm text-gray-500">{template.description}</p>
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
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Your page will be available at:
              </p>
              <p className="font-medium text-blue-600">
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