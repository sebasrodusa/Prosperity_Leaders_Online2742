import React from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { RESOURCE_TYPES } from '../../lib/resources'

const { FiDownload, FiExternalLink, FiFile, FiVideo, FiBookOpen } = FiIcons

const ResourceViewer = ({ resource, onClose, onDownload }) => {
  const resourceType = RESOURCE_TYPES.find(t => t.id === resource.resource_type)
  
  const formatRelativeTime = (date) => {
    const now = new Date()
    const then = new Date(date)
    const seconds = Math.floor((now - then) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) return `${years}y ago`
    if (months > 0) return `${months}mo ago`
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'just now'
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const renderContent = () => {
    switch (resource.resource_type) {
      case 'pdf':
        return (
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <SafeIcon icon={FiFile} className="w-16 h-16 text-picton-blue mx-auto mb-4" />
              <p className="text-polynesian-blue/70 mb-4">PDF Document</p>
              {resource.file_url && (
                <Button
                  onClick={onDownload}
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  <span>Download PDF</span>
                </Button>
              )}
            </div>
          </div>
        )
      
      case 'video':
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            {resource.file_url ? (
              <video
                controls
                className="w-full rounded-lg"
                poster={resource.thumbnail_url}
              >
                <source src={resource.file_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <SafeIcon icon={FiVideo} className="w-16 h-16 text-picton-blue mx-auto mb-4" />
                  <p className="text-polynesian-blue/70">Video not available</p>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'link':
        return (
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <SafeIcon icon={FiExternalLink} className="w-16 h-16 text-picton-blue mx-auto mb-4" />
              <p className="text-polynesian-blue/70 mb-4">External Resource</p>
              <Button
                onClick={() => window.open(resource.external_url, '_blank')}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                <span>Visit Resource</span>
              </Button>
            </div>
          </div>
        )
      
      case 'guide':
        return (
          <div className="bg-white rounded-lg p-6">
            <div className="prose max-w-none">
              <SafeIcon icon={FiBookOpen} className="w-8 h-8 text-picton-blue mb-4" />
              <div dangerouslySetInnerHTML={{ __html: resource.content?.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        )
      
      default:
        return (
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
            <p className="text-polynesian-blue/70">Content not available</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Resource Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-polynesian-blue mb-2">
            {resource.title}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-polynesian-blue/60">
            <span>{resourceType?.name}</span>
            {resource.file_size && (
              <span>{formatFileSize(resource.file_size)}</span>
            )}
            <span>Added {formatRelativeTime(resource.created_at)}</span>
          </div>
        </div>
        {resource.file_url && (
          <Button
            onClick={onDownload}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Download</span>
          </Button>
        )}
      </div>

      {/* Resource Description */}
      {resource.description && (
        <p className="text-polynesian-blue/70 bg-anti-flash-white rounded-lg p-4">
          {resource.description}
        </p>
      )}

      {/* Resource Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>

      {/* Resource Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-picton-blue/10 text-picton-blue text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResourceViewer