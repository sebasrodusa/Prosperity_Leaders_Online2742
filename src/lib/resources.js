import supabase from './supabase'

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
  { id: 'link', name: 'External Link', icon: 'FiExternalLink' },
  { id: 'guide', name: 'Text Guide', icon: 'FiBookOpen' }
]

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

// Upload file to Supabase storage
export const uploadResourceFile = async (file, folder = 'resources') => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabase.storage
      .from('resources')
      .upload(filePath, file)

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('resources')
      .getPublicUrl(filePath)

    return {
      path: filePath,
      url: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Delete file from Supabase storage
export const deleteResourceFile = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('resources')
      .remove([filePath])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
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