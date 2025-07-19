import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { uploadResourceFile, createResource, RESOURCE_CATEGORIES, RESOURCE_TYPES, ALLOWED_FILE_TYPES } from '../../lib/resources'
import { validateFile } from '../../lib/publit'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiUpload, FiX, FiCheck, FiCode, FiImage, FiVideo, FiFile } = FiIcons

const ResourceUpload = ({ onSuccess, onCancel }) => {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'getting_started',
    resource_type: 'pdf',
    language: 'en',
    external_url: '',
    embed_code: '',
    content: '',
    tags: '',
    is_pinned: false,
    role_restrictions: []
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file
      const allowedTypes = [
        ...ALLOWED_FILE_TYPES.pdf,
        ...ALLOWED_FILE_TYPES.video,
        ...ALLOWED_FILE_TYPES.image
      ]
      
      const validation = validateFile(file, allowedTypes, 100 * 1024 * 1024) // 100MB limit
      
      if (!validation.isValid) {
        alert(validation.errors.join('\n'))
        return
      }
      
      setSelectedFile(file)
      
      // Auto-detect resource type based on file
      const fileType = file.type
      if (ALLOWED_FILE_TYPES.pdf.includes(fileType)) {
        setFormData(prev => ({ ...prev, resource_type: 'pdf' }))
      } else if (ALLOWED_FILE_TYPES.video.includes(fileType)) {
        setFormData(prev => ({ ...prev, resource_type: 'video' }))
      } else if (ALLOWED_FILE_TYPES.image.includes(fileType)) {
        setFormData(prev => ({ ...prev, resource_type: 'image' }))
      }
      
      // Auto-fill title if empty
      if (!formData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, '') // Remove extension
        setFormData(prev => ({ ...prev, title: fileName }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    setUploadProgress(10)

    try {
      // Prepare resource data
      const resourceData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }

      setUploadProgress(30)

      if (selectedFile) {
        // Upload file to Publit.io
        const resource = await uploadResourceFile(selectedFile, resourceData, user.id, user.role)
        setUploadProgress(100)
        
        setTimeout(() => {
          onSuccess()
        }, 500)
      } else {
        // Create resource without file (for links, embeds, guides)
        setUploadProgress(80)
        await createResource(resourceData, user.id, user.role)
        setUploadProgress(100)
        
        setTimeout(() => {
          onSuccess()
        }, 500)
      }
    } catch (error) {
      console.error('Error uploading resource:', error)
      alert('Failed to upload resource. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return FiFile
      case 'video': return FiVideo
      case 'image': return FiImage
      default: return FiFile
    }
  }

  const requiresFile = ['pdf', 'video', 'image'].includes(formData.resource_type)
  const requiresUrl = formData.resource_type === 'link'
  const requiresEmbed = formData.resource_type === 'embed'
  const requiresContent = formData.resource_type === 'guide'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resource Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-polynesian-blue dark:text-white mb-2">
          Resource Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {RESOURCE_TYPES.map(type => (
            <label
              key={type.id}
              className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.resource_type === type.id
                  ? 'border-picton-blue bg-picton-blue/5 dark:bg-picton-blue/20'
                  : 'border-ui-divider dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <input
                type="radio"
                name="resource_type"
                value={type.id}
                checked={formData.resource_type === type.id}
                onChange={(e) => handleInputChange('resource_type', e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiIcons[type.icon]} className={`w-5 h-5 ${formData.resource_type === type.id ? 'text-picton-blue' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className={`text-sm font-medium ${formData.resource_type === type.id ? 'text-picton-blue dark:text-picton-blue' : 'text-gray-700 dark:text-gray-200'}`}>
                  {type.name}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* File Upload */}
      {requiresFile && (
        <div>
          <label className="block text-sm font-medium text-polynesian-blue dark:text-white mb-2">
            Upload File
          </label>
          {!selectedFile ? (
            <div className="border-2 border-dashed border-ui-divider dark:border-gray-700 rounded-lg p-8 text-center hover:border-picton-blue dark:hover:border-picton-blue/70 transition-colors duration-200 relative">
              <SafeIcon icon={FiUpload} className="w-10 h-10 text-ui-muted mx-auto mb-3" />
              <p className="text-polynesian-blue/70 dark:text-white/70 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-polynesian-blue/50 dark:text-white/50">
                {formData.resource_type === 'pdf' && 'PDF files up to 100MB'}
                {formData.resource_type === 'video' && 'Video files (MP4, MOV, AVI) up to 100MB'}
                {formData.resource_type === 'image' && 'Image files (JPG, PNG, GIF, WebP) up to 100MB'}
              </p>
              <input
                type="file"
                onChange={handleFileSelect}
                accept={
                  formData.resource_type === 'pdf' ? '.pdf' :
                  formData.resource_type === 'video' ? '.mp4,.mov,.avi' :
                  formData.resource_type === 'image' ? '.jpg,.jpeg,.png,.gif,.webp' : '*'
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="border border-ui-divider dark:border-gray-700 rounded-lg p-4 bg-anti-flash-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <SafeIcon icon={getFileTypeIcon(formData.resource_type)} className="w-6 h-6 text-picton-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-polynesian-blue dark:text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-polynesian-blue/50 dark:text-white/50">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  icon={<SafeIcon icon={FiX} className="w-4 h-4" />}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* External URL */}
      {requiresUrl && (
        <Input
          label="External URL"
          value={formData.external_url}
          onChange={(e) => handleInputChange('external_url', e.target.value)}
          placeholder="https://example.com"
          required
          prefix={<SafeIcon icon={FiIcons.FiLink} className="w-5 h-5 text-gray-400" />}
          helperText="Enter the full URL including https://"
        />
      )}

      {/* Embed Code */}
      {requiresEmbed && (
        <div>
          <label className="block text-sm font-medium text-polynesian-blue dark:text-white mb-2">
            Embed Code
          </label>
          <Textarea
            value={formData.embed_code}
            onChange={(e) => handleInputChange('embed_code', e.target.value)}
            placeholder="<iframe src='...' width='560' height='315'></iframe>"
            rows={4}
            required
            helperText="Paste iframe embed code from YouTube, Vimeo, or other platforms"
          />
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
          placeholder="Resource title"
        />
        <div>
          <label className="block text-sm font-medium text-polynesian-blue dark:text-white mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-ui-divider dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue dark:bg-gray-800 dark:text-white"
            required
          >
            {RESOURCE_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        rows={3}
        required
        placeholder="Brief description of this resource"
      />

      {/* Text Content (for guide type) */}
      {requiresContent && (
        <Textarea
          label="Content"
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          rows={8}
          placeholder="Write your guide content here... Use *italic* or **bold** for formatting"
          required
          helperText="You can use *text* for italic and **text** for bold formatting"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-polynesian-blue dark:text-white mb-2">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-ui-divider dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue dark:bg-gray-800 dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <Input
          label="Tags (comma-separated)"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          placeholder="training, beginner, sales"
          helperText="Add keywords to help users find this resource"
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_pinned}
            onChange={(e) => handleInputChange('is_pinned', e.target.checked)}
            className="rounded border-ui-divider dark:border-gray-700 text-picton-blue focus:ring-picton-blue h-4 w-4"
          />
          <span className="text-sm text-polynesian-blue dark:text-white">Pin as featured resource</span>
        </label>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2 bg-anti-flash-white dark:bg-gray-800 p-4 rounded-lg border border-ui-divider dark:border-gray-700"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-polynesian-blue dark:text-white">Uploading...</span>
            <span className="text-picton-blue font-medium">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-picton-blue h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-ui-divider dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={uploading || (requiresFile && !selectedFile) || (requiresUrl && !formData.external_url) || (requiresEmbed && !formData.embed_code) || (requiresContent && !formData.content)}
          loading={uploading}
        >
          {uploading ? 'Uploading...' : 'Create Resource'}
        </Button>
      </div>
    </form>
  )
}

export default ResourceUpload