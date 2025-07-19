import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getResources, RESOURCE_CATEGORIES, RESOURCE_TYPES, trackResourceAccess } from '../../lib/resources'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import ResourceCard from './ResourceCard'
import ResourceUpload from './ResourceUpload'
import ResourceViewer from './ResourceViewer'

const { FiSearch, FiFilter, FiPlus, FiGrid, FiList, FiBookOpen } = FiIcons

const ResourcesCenter = () => {
  const { user } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showResourceViewer, setShowResourceViewer] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  
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
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
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

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = []
    }
    acc[resource.category].push(resource)
    return acc
  }, {})

  const pinnedResources = resources.filter(r => r.is_pinned)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiBookOpen} className="w-8 h-8 text-picton-blue" />
          <div>
            <h1 className="text-3xl font-bold text-polynesian-blue">Resources Center</h1>
            <p className="text-polynesian-blue/70">Training, marketing, and sales materials</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-picton-blue text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-picton-blue text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
          </div>

          {isAdmin && (
            <Button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Add Resource</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
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
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
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
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
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
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
          >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </Card>

      {/* Pinned Resources */}
      {pinnedResources.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-polynesian-blue mb-4 flex items-center">
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
                onEdit={() => {/* TODO: Implement edit */}}
                onDelete={() => {/* TODO: Implement delete */}}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Resources by Category */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
        </div>
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
                  <h2 className="text-2xl font-bold text-polynesian-blue">{category.name}</h2>
                  <span className="text-sm text-polynesian-blue/60">
                    ({categoryResources.length})
                  </span>
                </div>

                {categoryResources.length === 0 ? (
                  <Card className="p-8 text-center">
                    <SafeIcon icon={FiIcons[category.icon]} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-polynesian-blue/70">No resources in this category yet</p>
                    {isAdmin && (
                      <p className="text-sm text-polynesian-blue/50 mt-2">
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
                          onEdit={() => {/* TODO: Implement edit */}}
                          onDelete={() => {/* TODO: Implement delete */}}
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
    </div>
  )
}

export default ResourcesCenter