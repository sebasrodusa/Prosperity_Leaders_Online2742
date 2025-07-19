// Publit.io API Integration
const PUBLIT_API_KEY = import.meta.env.VITE_PUBLIT_API_KEY || 'your-publit-api-key'
const PUBLIT_API_URL = 'https://api.publit.io/v1/files'

export class PublitError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'PublitError'
    this.status = status
  }
}

// Upload file to Publit.io
export const uploadToPublit = async (file, options = {}) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    // Add optional parameters
    if (options.title) formData.append('title', options.title)
    if (options.description) formData.append('description', options.description)
    if (options.tags) formData.append('tags', options.tags.join(','))
    if (options.folder) formData.append('folder', options.folder)
    
    // Auto-generate thumbnail for videos and images
    formData.append('auto_optimize', 'true')
    formData.append('generate_thumbnails', 'true')
    
    const response = await fetch(PUBLIT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PUBLIT_API_KEY}`,
      },
      body: formData
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new PublitError(
        errorData.message || `Upload failed: ${response.statusText}`,
        response.status
      )
    }
    
    const data = await response.json()
    
    // Return standardized response
    return {
      id: data.id,
      url: data.url,
      downloadUrl: data.download_url || data.url,
      thumbnailUrl: data.thumbnail_url,
      previewUrl: data.preview_url,
      fileName: data.original_filename || file.name,
      fileSize: data.file_size || file.size,
      fileType: data.content_type || file.type,
      width: data.width,
      height: data.height,
      duration: data.duration, // For videos
      metadata: data.metadata || {}
    }
  } catch (error) {
    if (error instanceof PublitError) {
      throw error
    }
    console.error('Publit upload error:', error)
    throw new PublitError('Failed to upload file to Publit.io')
  }
}

// Delete file from Publit.io
export const deleteFromPublit = async (fileId) => {
  try {
    const response = await fetch(`${PUBLIT_API_URL}/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${PUBLIT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new PublitError(
        errorData.message || `Delete failed: ${response.statusText}`,
        response.status
      )
    }
    
    return true
  } catch (error) {
    if (error instanceof PublitError) {
      throw error
    }
    console.error('Publit delete error:', error)
    throw new PublitError('Failed to delete file from Publit.io')
  }
}

// Get file info from Publit.io
export const getPublitFileInfo = async (fileId) => {
  try {
    const response = await fetch(`${PUBLIT_API_URL}/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${PUBLIT_API_KEY}`,
      }
    })
    
    if (!response.ok) {
      throw new PublitError(`Failed to get file info: ${response.statusText}`, response.status)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Publit get file info error:', error)
    throw error
  }
}

// Generate optimized image URL with transformations
export const getOptimizedImageUrl = (baseUrl, options = {}) => {
  if (!baseUrl) return null
  
  const params = new URLSearchParams()
  
  // Common image transformations
  if (options.width) params.append('w', options.width)
  if (options.height) params.append('h', options.height)
  if (options.quality) params.append('q', options.quality)
  if (options.format) params.append('f', options.format)
  if (options.crop) params.append('c', options.crop)
  
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

// Validate file type and size
export const validateFile = (file, allowedTypes = [], maxSize = 50 * 1024 * 1024) => {
  const errors = []
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`)
  }
  
  if (file.size > maxSize) {
    errors.push(`File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds limit of ${(maxSize / 1024 / 1024)}MB`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}