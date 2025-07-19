import React from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { RESOURCE_TYPES } from '../../lib/resources'
import { getOptimizedImageUrl } from '../../lib/publit'

const { FiDownload, FiEye, FiEdit3, FiTrash2, FiStar, FiExternalLink, FiCode } = FiIcons

const ResourceCard = ({ resource, viewMode = 'grid', onView, onDownload, onEdit, onDelete, isAdmin = false }) => {
  const resourceType = RESOURCE_TYPES.find(t => t.id === resource.resource_type)
  
  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const getLanguageFlag = (lang) => {
    switch (lang) {
      case 'en': return '🇺🇸'
      case 'es': return '🇪🇸'
      default: return ''
    }
  }

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

  const getThumbnailUrl = () => {
    if (resource.thumbnail_url) {
      return getOptimizedImageUrl(resource.thumbnail_url, {
        width: 300,
        height: 200,
        crop: 'fill',
        quality: 80
      })
    }
    return null
  }

  const getActionButton = () => {
    switch (resource.resource_type) {
      case 'link':
        return (
          <Button
            size="sm"
            onClick={() => window.open(resource.external_url, '_blank')}
            className="flex items-center space-x-1"
          >
            <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
            <span className="hidden sm:inline">Open</span>
          </Button>
        )
      case 'embed':
        return (
          <Button
            size="sm"
            onClick={onView}
            className="flex items-center space-x-1"
          >
            <SafeIcon icon={FiCode} className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </Button>
        )
      default:
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex items-center space-x-1"
          >
            <SafeIcon icon={FiEye} className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </Button>
        )
    }
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex-shrink-0">
                {getThumbnailUrl() ? (
                  <img
                    src={getThumbnailUrl()}
                    alt={resource.title}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-picton-blue/10 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiIcons[resourceType?.icon]} className="w-6 h-6 text-picton-blue" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-polynesian-blue truncate">
                    {resource.title}
                  </h3>
                  {resource.is_pinned && (
                    <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-500" />
                  )}
                  {resource.language && (
                    <span className="text-sm">
                      {getLanguageFlag(resource.language)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-polynesian-blue/70 mt-1 line-clamp-2">
                  {resource.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-polynesian-blue/50">
                  <span>{resourceType?.name}</span>
                  {resource.file_size && <span>{formatFileSize(resource.file_size)}</span>}
                  {resource.duration && <span>{Math.ceil(resource.duration / 60)}min</span>}
                  <span>{formatRelativeTime(resource.created_at)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {getActionButton()}
              {(resource.file_url || resource.download_url) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="flex items-center space-x-1"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              )}
              {isAdmin && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    className="flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={onDelete}
                    className="flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
        {/* Thumbnail/Preview */}
        <div className="h-32 bg-gradient-to-br from-picton-blue/20 to-polynesian-blue/20 relative">
          {getThumbnailUrl() ? (
            <img
              src={getThumbnailUrl()}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <SafeIcon icon={FiIcons[resourceType?.icon]} className="w-12 h-12 text-picton-blue" />
            </div>
          )}
          {resource.is_pinned && (
            <div className="absolute top-2 right-2">
              <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-500" />
            </div>
          )}
          {resource.language && (
            <div className="absolute top-2 left-2 text-lg">
              {getLanguageFlag(resource.language)}
            </div>
          )}
          {resource.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {Math.ceil(resource.duration / 60)}min
            </div>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-polynesian-blue line-clamp-2 flex-1">
              {resource.title}
            </h3>
          </div>
          
          <p className="text-sm text-polynesian-blue/70 line-clamp-3 flex-1 mb-4">
            {resource.description}
          </p>
          
          <div className="space-y-2 text-xs text-polynesian-blue/50 mb-4">
            <div className="flex items-center justify-between">
              <span>{resourceType?.name}</span>
              {resource.file_size && <span>{formatFileSize(resource.file_size)}</span>}
            </div>
            <div>
              {formatRelativeTime(resource.created_at)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-auto">
            {getActionButton()}
            {(resource.file_url || resource.download_url) && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="flex items-center justify-center"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {isAdmin && (
            <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <SafeIcon icon={FiEdit3} className="w-3 h-3" />
                <span>Edit</span>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={onDelete}
                className="flex items-center justify-center"
              >
                <SafeIcon icon={FiTrash2} className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default ResourceCard