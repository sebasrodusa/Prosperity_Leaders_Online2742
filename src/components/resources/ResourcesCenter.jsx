import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getResources, RESOURCE_CATEGORIES, RESOURCE_TYPES, trackResourceAccess, deleteResource } from '../../lib/resources'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import Loader from '../ui/Loader'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import ResourceCard from './ResourceCard'
import ResourceUpload from './ResourceUpload'
import ResourceViewer from './ResourceViewer'

const { FiSearch, FiFilter, FiPlus, FiGrid, FiList, FiBookOpen, FiTrendingUp, FiMail } = FiIcons

const ResourcesCenter = () => {
  const { user } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showResourceViewer, setShowResourceViewer] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [editingResource, setEditingResource] = useState(null)
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    language: ''
  })
  
  const isAdmin = user?.role === 'admin'
  
  useEffect(() => {
    loadResources()
  }, [filters, user])
  
  const loadResources = async () => {
    try {
      setLoading(true)
      const data = await getResources(user.id, user.role || 'professional', filters)
      setResources(data)
    } catch (error) {
      console.error('Error loading resources:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  
  const handleResourceClick = async (resource) => {
    try {
      // Track resource access
      await trackResourceAccess(resource.id, user.id, 'view')
      setSelectedResource(resource)
      setShowResourceViewer(true)
    } catch (error) {
      console.error('Error opening resource:', error)
    }
  }
  
  const handleResourceDownload = async (resource) => {
    try {
      // Track download
      await trackResourceAccess(resource.id, user.id, 'download')
      // Open download link
      if (resource.file_url) {
        window.open(resource.file_url, '_blank')
      }
    } catch (error) {
      console.error('Error downloading resource:', error)
    }
  }
  
  const handleDeleteResource = async (resource) => {
    setDeleteConfirmation(resource)
  }
  
  const confirmDelete = async () => {
    try {
      // Delete resource
      await deleteResource(deleteConfirmation.id, user.id, user.role)
      // Refresh resources
      loadResources()
      // Close confirmation modal
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting resource:', error)
      alert('Failed to delete resource')
    }
  }
  
  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = []
    }
    acc[resource.category].push(resource)
    return acc
  }, {})
  
  const pinnedResources = resources.filter(r => r.is_pinned)
  
  // No results found state
  const noResults = !loading && resources.length === 0 && (filters.search || filters.category || filters.type || filters.language)
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiBookOpen} className="w-8 h-8 text-picton-blue" />
          <div>
            <h1 className="text-3xl font-bold text-polynesian-blue dark:text-white">Resources Center</h1>
            <p className="text-polynesian-blue/70 dark:text-white/70">Training, marketing, and sales materials</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-ui-divider dark:border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-picton-blue text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label="Grid view"
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-picton-blue text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label="List view"
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
          </div>
          {isAdmin && (
            <Button
              onClick={() => setShowUploadModal(true)}
              icon={<SafeIcon icon={FiPlus} className="w-4 h-4" />}
            >
              Add Resource
            </Button>
          )}
        </div>
      </div>
      
      {/* External Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          icon={<SafeIcon icon={FiTrendingUp} className="w-5 h-5" />}
          onClick={() => window.open('https://fin.prosperityleaders.net', '_blank')}
        >
          Prosperity FNA
        </Button>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          icon={<SafeIcon icon={FiMail} className="w-5 h-5" />}
          onClick={() => window.open('https://email.prosperityleaders.net', '_blank')}
        >
          Email Templates
        </Button>
      </div>

      {/* Filters */}
      <Card shadow="md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search resources..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-ui-divider dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            {RESOURCE_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 border border-ui-divider dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="px-3 py-2 border border-ui-divider dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </Card>
      
      {/* Pinned Resources */}
      {pinnedResources.length > 0 && (
        <Card shadow="md">
          <h2 className="text-xl font-semibold text-polynesian-blue dark:text-white mb-4 flex items-center">
            <SafeIcon icon={FiIcons.FiStar} className="w-5 h-5 mr-2 text-yellow-500" />
            Featured Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                viewMode="grid"
                onView={() => handleResourceClick(resource)}
                onDownload={() => handleResourceDownload(resource)}
                isAdmin={isAdmin}
                onEdit={() => setEditingResource(resource)}
                onDelete={() => handleDeleteResource(resource)}
              />
            ))}
          </div>
        </Card>
      )}
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" color="primary" text="Loading resources..." />
        </div>
      ) : noResults ? (
        <Card className="py-12 text-center">
          <SafeIcon icon={FiSearch} className="w-16 h-16 text-ui-muted mx-auto mb-4" />
          <h3 className="text-xl font-medium text-polynesian-blue dark:text-white mb-2">No resources found</h3>
          <p className="text-polynesian-blue/70 dark:text-white/70 max-w-md mx-auto">
            We couldn't find any resources matching your search criteria. Try adjusting your filters or search terms.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {RESOURCE_CATEGORIES.map(category => {
            const categoryResources = groupedResources[category.id] || []
            if (categoryResources.length === 0 && filters.category !== category.id) return null
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiIcons[category.icon]} className="w-6 h-6 text-picton-blue" />
                  <h2 className="text-2xl font-bold text-polynesian-blue dark:text-white">{category.name}</h2>
                  <span className="text-sm text-polynesian-blue/60 dark:text-white/60">
                    ({categoryResources.length})
                  </span>
                </div>
                
                {categoryResources.length === 0 ? (
                  <Card className="p-8 text-center">
                    <SafeIcon icon={FiIcons[category.icon]} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-polynesian-blue/70 dark:text-white/70">No resources in this category yet</p>
                    {isAdmin && (
                      <p className="text-sm text-polynesian-blue/50 dark:text-white/50 mt-2">
                        Click "Add Resource" to upload content for this category
                      </p>
                    )}
                  </Card>
                ) : (
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {categoryResources
                      .filter(resource => !resource.is_pinned) // Don't show pinned resources again
                      .map(resource => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          viewMode={viewMode}
                          onView={() => handleResourceClick(resource)}
                          onDownload={() => handleResourceDownload(resource)}
                          isAdmin={isAdmin}
                          onEdit={() => setEditingResource(resource)}
                          onDelete={() => handleDeleteResource(resource)}
                        />
                      ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
      
      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Add New Resource"
        size="lg"
      >
        <ResourceUpload
          onSuccess={() => {
            setShowUploadModal(false)
            loadResources()
          }}
          onCancel={() => setShowUploadModal(false)}
        />
        </Modal>

        {/* Resource Viewer */}
        <Modal
        isOpen={showResourceViewer}
        onClose={() => setShowResourceViewer(false)}
        title={selectedResource?.title}
        size="xl"
      >
        {selectedResource && (
          <ResourceViewer
            resource={selectedResource}
            onClose={() => setShowResourceViewer(false)}
            onDownload={() => handleResourceDownload(selectedResource)}
          />
        )}
        </Modal>

        {/* Edit Resource Modal */}
        <Modal
          isOpen={!!editingResource}
          onClose={() => setEditingResource(null)}
          title="Edit Resource"
          size="lg"
        >
          {editingResource && (
            <ResourceUpload
              resource={editingResource}
              onSuccess={() => {
                setEditingResource(null)
                loadResources()
              }}
              onCancel={() => setEditingResource(null)}
            />
          )}
        </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        title="Delete Resource"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-polynesian-blue/70 dark:text-white/70">
            Are you sure you want to delete "{deleteConfirmation?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmation(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete Resource
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ResourcesCenter
