import React from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { RESOURCE_TYPES } from '../../lib/resources'

const { FiDownload, FiExternalLink, FiFile, FiVideo, FiBookOpen, FiImage, FiCode } = FiIcons

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
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center">
              <SafeIcon icon={FiFile} className="w-16 h-16 text-picton-blue mx-auto mb-4" />
              <p className="text-polynesian-blue/70 dark:text-white/70 mb-6">PDF Document</p>
              {resource.file_url && (
                <div className="space-y-3">
                  <Button
                    onClick={() => window.open(resource.file_url, '_blank')}
                    icon={<SafeIcon icon={FiExternalLink} className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Open in New Tab
                  </Button>
                  <Button
                    onClick={onDownload}
                    variant="outline"
                    icon={<SafeIcon icon={FiDownload} className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Download PDF
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'video':
        return (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            {resource.file_url ? (
              <div className="aspect-video">
                <video
                  controls
                  className="w-full h-full rounded-lg"
                  poster={resource.thumbnail_url}
                >
                  <source src={resource.file_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <SafeIcon icon={FiVideo} className="w-16 h-16 text-picton-blue mx-auto mb-4" />
                  <p className="text-polynesian-blue/70 dark:text-white/70">Video not available</p>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'image':
        return (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            {resource.file_url ? (
              <div className="flex justify-center">
                <img
                  src={resource.file_url}
                  alt={resource.title}
                  className="max-w-full max-h-[600px] object-contain rounded-lg mx-auto"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <SafeIcon icon={FiImage} className="w-16 h-16 text-picton-blue mx-auto mb-4" />
                  <p className="text-polynesian-blue/70 dark:text-white/70">Image not available</p>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'link':
        return (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <SafeIcon icon={FiExternalLink} className="w-16 h-16 text-picton-blue mx-auto mb-4" />
              <p className="text-polynesian-blue/70 dark:text-white/70 mb-6">External Resource</p>
              <Button
                onClick={() => window.open(resource.external_url, '_blank')}
                icon={<SafeIcon icon={FiExternalLink} className="w-4 h-4" />}
              >
                Visit Resource
              </Button>
            </div>
          </div>
        )
      
      case 'embed':
        return (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            {resource.embed_code ? (
              <div className="aspect-video">
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: resource.embed_code }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <SafeIcon icon={FiCode} className="w-16 h-16 text-picton-blue mx-auto mb-4" />
                  <p className="text-polynesian-blue/70 dark:text-white/70">Embedded content not available</p>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'guide':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="prose prose-picton-blue dark:prose-invert max-w-none">
              <SafeIcon icon={FiBookOpen} className="w-8 h-8 text-picton-blue mb-4" />
              <div 
                className="text-polynesian-blue/90 dark:text-white/90"
                dangerouslySetInnerHTML={{ 
                  __html: resource.content
                    ?.replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                }} 
              />
            </div>
          </div>
        )
      
      default:
        return (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex items-center justify-center min-h-[200px]">
            <p className="text-polynesian-blue/70 dark:text-white/70">Content not available</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Resource Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-polynesian-blue dark:text-white mb-2">
            {resource.title}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-polynesian-blue/60 dark:text-white/60">
            <span className="flex items-center">
              <SafeIcon icon={FiIcons[resourceType?.icon]} className="w-4 h-4 mr-1" />
              {resourceType?.name}
            </span>
            {resource.file_size && (
              <span>{formatFileSize(resource.file_size)}</span>
            )}
            {resource.duration && (
              <span>{Math.ceil(resource.duration / 60)} min</span>
            )}
            <span>Added {formatRelativeTime(resource.created_at)}</span>
          </div>
        </div>
        {(resource.file_url || resource.download_url) && (
          <Button
            onClick={onDownload}
            icon={<SafeIcon icon={FiDownload} className="w-4 h-4" />}
          >
            Download
          </Button>
        )}
      </div>

      {/* Resource Description */}
      {resource.description && (
        <p className="text-polynesian-blue/70 dark:text-white/70 bg-anti-flash-white dark:bg-gray-700/30 rounded-lg p-4 border border-ui-divider dark:border-gray-700">
          {resource.description}
        </p>
      )}

      {/* Resource Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border border-ui-divider dark:border-gray-700 rounded-lg overflow-hidden"
      >
        {renderContent()}
      </motion.div>

      {/* Resource Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {resource.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-picton-blue/10 dark:bg-picton-blue/20 text-picton-blue dark:text-picton-blue/90 text-sm rounded-full"
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
