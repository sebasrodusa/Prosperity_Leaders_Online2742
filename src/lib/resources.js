import supabase from './supabase'
import { uploadToPublit, deleteFromPublit } from './publit'

// Helper function to set user context for RLS
const setUserContext = async (userId, userRole = 'professional') => {
  await supabase.rpc('set_config', {
    setting_name: 'app.current_user_id',
    setting_value: userId,
    is_local: true
  })
  await supabase.rpc('set_config', {
    setting_name: 'app.user_role',
    setting_value: userRole,
    is_local: true
  })
}

// Resource categories
export const RESOURCE_CATEGORIES = [
  { id: 'getting_started', name: 'Getting Started', icon: 'FiPlay' },
  { id: 'product_knowledge', name: 'Product Knowledge', icon: 'FiBook' },
  { id: 'sales_scripts', name: 'Sales Scripts', icon: 'FiMessageSquare' },
  { id: 'marketing_branding', name: 'Marketing & Branding', icon: 'FiTrendingUp' },
  { id: 'video_trainings', name: 'Video Trainings', icon: 'FiVideo' },
  { id: 'forms_disclosures', name: 'Forms & Disclosures', icon: 'FiFileText' }
]

// Resource types
export const RESOURCE_TYPES = [
  { id: 'pdf', name: 'PDF Document', icon: 'FiFile' },
  { id: 'video', name: 'Video', icon: 'FiVideo' },
  { id: 'image', name: 'Image', icon: 'FiImage' },
  { id: 'link', name: 'External Link', icon: 'FiExternalLink' },
  { id: 'embed', name: 'Embedded Content', icon: 'FiCode' },
  { id: 'guide', name: 'Text Guide', icon: 'FiBookOpen' }
]

// Allowed file types for upload
export const ALLOWED_FILE_TYPES = {
  pdf: ['application/pdf'],
  video: ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'],
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}

// Get all resources with filters
export const getResources = async (userId, userRole = 'professional', filters = {}) => {
  try {
    await setUserContext(userId, userRole)
    
    let query = supabase
      .from('resources_12345')
      .select('*')
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.type) {
      query = query.eq('resource_type', filters.type)
    }
    if (filters.language) {
      query = query.eq('language', filters.language)
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.ilike.%${filters.search}%`)
    }
    
    const { data, error } = await query
    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('Error fetching resources:', error)
    throw error
  }
}

// Get single resource by ID
export const getResource = async (resourceId, userId, userRole = 'professional') => {
  try {
    await setUserContext(userId, userRole)
    
    const { data, error } = await supabase
      .from('resources_12345')
      .select('*')
      .eq('id', resourceId)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching resource:', error)
    throw error
  }
}

// Create new resource (admin only)
export const createResource = async (resourceData, userId, userRole = 'admin') => {
  try {
    await setUserContext(userId, userRole)
    
    const { data, error } = await supabase
      .from('resources_12345')
      .insert([{
        ...resourceData,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating resource:', error)
    throw error
  }
}

// Update resource (admin only)
export const updateResource = async (resourceId, updates, userId, userRole = 'admin') => {
  try {
    await setUserContext(userId, userRole)
    
    const { data, error } = await supabase
      .from('resources_12345')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', resourceId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating resource:', error)
    throw error
  }
}

// Delete resource (admin only)
export const deleteResource = async (resourceId, userId, userRole = 'admin') => {
  try {
    await setUserContext(userId, userRole)
    
    // Get resource to delete associated Publit file
    const resource = await getResource(resourceId, userId, userRole)
    
    // Delete from Publit.io if it has a publit_id
    if (resource.publit_id) {
      try {
        await deleteFromPublit(resource.publit_id)
      } catch (publitError) {
        console.warn('Failed to delete from Publit.io:', publitError)
        // Continue with database deletion even if Publit deletion fails
      }
    }
    
    // Soft delete from database
    const { error } = await supabase
      .from('resources_12345')
      .update({ is_active: false })
      .eq('id', resourceId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting resource:', error)
    throw error
  }
}

// Upload file to Publit.io and create resource
export const uploadResourceFile = async (file, resourceData, userId, userRole = 'admin') => {
  try {
    // Upload to Publit.io
    const publitData = await uploadToPublit(file, {
      title: resourceData.title,
      description: resourceData.description,
      tags: resourceData.tags,
      folder: `resources/${resourceData.category}`
    })
    
    // Create resource with Publit data
    const resource = await createResource({
      ...resourceData,
      publit_id: publitData.id,
      file_url: publitData.url,
      download_url: publitData.downloadUrl,
      thumbnail_url: publitData.thumbnailUrl,
      preview_url: publitData.previewUrl,
      file_name: publitData.fileName,
      file_size: publitData.fileSize,
      file_type: publitData.fileType,
      width: publitData.width,
      height: publitData.height,
      duration: publitData.duration,
      publit_metadata: publitData.metadata
    }, userId, userRole)
    
    return resource
  } catch (error) {
    console.error('Error uploading resource file:', error)
    throw error
  }
}

// Track resource view/download
export const trackResourceAccess = async (resourceId, userId, actionType = 'view') => {
  try {
    const { error } = await supabase
      .from('resource_analytics_12345')
      .insert([{
        resource_id: resourceId,
        user_id: userId,
        action_type: actionType,
        accessed_at: new Date().toISOString()
      }])
    
    if (error) throw error
  } catch (error) {
    console.error('Error tracking resource access:', error)
    // Don't throw error for analytics tracking
  }
}

// Get resource analytics (admin only)
export const getResourceAnalytics = async (userId, userRole = 'admin') => {
  try {
    await setUserContext(userId, userRole)
    
    const { data, error } = await supabase
      .rpc('get_resource_analytics')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching resource analytics:', error)
    throw error
  }
}