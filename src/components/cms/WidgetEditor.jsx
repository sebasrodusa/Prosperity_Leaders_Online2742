import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { getWidgetConfig } from '../../lib/widgets/types'

// Dynamic import of widget components
const widgetComponents = {
  directorySearch: React.lazy(() => import('../widgets/DirectorySearchWidget')),
  featuredProfessionals: React.lazy(() => import('../widgets/FeaturedProfessionalsWidget')),
  recentBlogPosts: React.lazy(() => import('../widgets/RecentBlogPostsWidget')),
  testimonialCarousel: React.lazy(() => import('../widgets/TestimonialCarouselWidget')),
  callToAction: React.lazy(() => import('../widgets/CallToActionWidget')),
  faqAccordion: React.lazy(() => import('../widgets/FaqAccordionWidget'))
}

const WidgetEditor = ({ widget, onSave, onDelete, onCancel }) => {
  const [config, setConfig] = useState(widget.config)
  const [showPreview, setShowPreview] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    onSave({
      ...widget,
      config
    })
  }

  const WidgetComponent = widgetComponents[widget.type]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-polynesian-blue">
          Edit Widget
        </h3>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2"
          >
            <SafeIcon
              icon={showPreview ? FiIcons.FiEdit2 : FiIcons.FiEye}
              className="w-4 h-4"
            />
            <span>{showPreview ? 'Edit' : 'Preview'}</span>
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showPreview ? (
        <div className="border rounded-lg overflow-hidden">
          <React.Suspense fallback={<div>Loading...</div>}>
            <WidgetComponent config={config} />
          </React.Suspense>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Widget Title"
              value={config.title}
              onChange={(e) => handleConfigChange('title', e.target.value)}
            />
            
            <Input
              label="Subtitle"
              value={config.subtitle}
              onChange={(e) => handleConfigChange('subtitle', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Background Color"
              type="text"
              value={config.backgroundColor}
              onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
              placeholder="bg-white or custom color"
            />
            
            <Input
              label="Background Image URL"
              type="text"
              value={config.backgroundImage}
              onChange={(e) => handleConfigChange('backgroundImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-polynesian-blue mb-2">
                Padding
              </label>
              <select
                value={config.padding}
                onChange={(e) => handleConfigChange('padding', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-picton-blue focus:ring-picton-blue"
              >
                <option value="py-8">Small</option>
                <option value="py-12">Medium</option>
                <option value="py-16">Large</option>
                <option value="py-24">Extra Large</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-polynesian-blue mb-2">
                Container Width
              </label>
              <select
                value={config.containerWidth}
                onChange={(e) => handleConfigChange('containerWidth', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-picton-blue focus:ring-picton-blue"
              >
                <option value="max-w-5xl">Small</option>
                <option value="max-w-6xl">Medium</option>
                <option value="max-w-7xl">Large</option>
                <option value="max-w-full">Full Width</option>
              </select>
            </div>
          </div>

          {/* Widget-specific configuration */}
          {/* This would be different for each widget type */}
          {/* You can add conditional rendering based on widget.type */}

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Widget"
      >
        <div className="p-6">
          <p className="text-polynesian-blue mb-6">
            Are you sure you want to delete this widget? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            
            <Button
              variant="danger"
              onClick={() => {
                onDelete(widget.id)
                setIsDeleteModalOpen(false)
              }}
            >
              Delete Widget
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default WidgetEditor