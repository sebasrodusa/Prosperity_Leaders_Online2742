import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { createResource, uploadResourceFile, RESOURCE_CATEGORIES, RESOURCE_TYPES } from '../../lib/resources'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiUpload, FiX, FiCheck } = FiIcons

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
    content: '',
    tags: '',
    is_pinned: false,
    role_restrictions: []
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      
      // Auto-detect resource type based on file
      const fileType = file.type
      if (fileType.includes('pdf')) {
        setFormData(prev => ({ ...prev, resource_type: 'pdf' }))
      } else if (fileType.includes('video')) {
        setFormData(prev => ({ ...prev, resource_type: 'video' }))
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
      let fileData = null

      // Upload file if selected
      if (selectedFile) {
        setUploadProgress(30)
        fileData = await uploadResourceFile(selectedFile)
        setUploadProgress(60)
      }

      // Prepare resource data
      const resourceData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        file_url: fileData?.url || null,
        file_path: fileData?.path || null,
        file_name: fileData?.fileName || null,
        file_size: fileData?.fileSize || null,
        file_type: fileData?.fileType || null
      }

      setUploadProgress(80)

      // Create resource
      await createResource(resourceData, user.id, user.role)
      
      setUploadProgress(100)
      
      setTimeout(() => {
        onSuccess()
      }, 500)

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resource Type Selection */}
      <div>
        <label className="block text-sm font-medium text-polynesian-blue mb-2">
          Resource Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {RESOURCE_TYPES.map(type => (
            <label
              key={type.id}
              className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.resource_type === type.id
                  ? 'border-picton-blue bg-picton-blue/5'
                  : 'border-gray-300 hover:border-gray-400'
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
                <SafeIcon icon={FiIcons[type.icon]} className="w-4 h-4" />
                <span className="text-sm font-medium">{type.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* File Upload */}
      {(formData.resource_type === 'pdf' || formData.resource_type === 'video') && (
        <div>
          <label className="block text-sm font-medium text-polynesian-blue mb-2">
            Upload File
          </label>
          
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <SafeIcon icon={FiUpload} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOC, MP4, MOV up to 50MB
              </p>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.mp4,.mov,.avi"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-polynesian-blue">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* External URL */}
      {formData.resource_type === 'link' && (
        <Input
          label="External URL"
          value={formData.external_url}
          onChange={(e) => handleInputChange('external_url', e.target.value)}
          placeholder="https://example.com"
          required
        />
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-polynesian-blue mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
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
      />

      {/* Text Content (for guide type) */}
      {formData.resource_type === 'guide' && (
        <Textarea
          label="Content"
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          rows={8}
          placeholder="Write your guide content here..."
          required
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-polynesian-blue mb-2">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
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
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_pinned}
            onChange={(e) => handleInputChange('is_pinned', e.target.checked)}
            className="rounded border-gray-300 text-picton-blue focus:ring-picton-blue"
          />
          <span className="text-sm text-polynesian-blue">Pin as featured resource</span>
        </label>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
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
      <div className="flex justify-end space-x-3 pt-4 border-t">
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
          disabled={uploading || (!selectedFile && formData.resource_type !== 'link' && formData.resource_type !== 'guide')}
        >
          {uploading ? 'Uploading...' : 'Create Resource'}
        </Button>
      </div>
    </form>
  )
}

export default ResourceUpload