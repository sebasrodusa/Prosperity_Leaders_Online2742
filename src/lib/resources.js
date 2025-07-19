import supabase from './supabase'
import {
  uploadFile,
  deleteFile,
  getOptimizedUrl as getOptimizedUrlFromPublitio
} from './publitio'

// Re-export optimised image helper
export const getOptimizedImageUrl = getOptimizedUrlFromPublitio

// Resource metadata used across the app
export const RESOURCE_CATEGORIES = [
  { id: 'getting_started', name: 'Getting Started', icon: 'FiPlay' },
  { id: 'product_knowledge', name: 'Product Knowledge', icon: 'FiArchive' },
  { id: 'sales_scripts', name: 'Sales Scripts', icon: 'FiFileText' },
  { id: 'marketing_branding', name: 'Marketing & Branding', icon: 'FiStar' },
  { id: 'video_trainings', name: 'Video Trainings', icon: 'FiVideo' },
  { id: 'forms_disclosures', name: 'Forms & Disclosures', icon: 'FiFile' }
]

export const RESOURCE_TYPES = [
  { id: 'pdf', name: 'PDF', icon: 'FiFile' },
  { id: 'video', name: 'Video', icon: 'FiVideo' },
  { id: 'image', name: 'Image', icon: 'FiImage' },
  { id: 'link', name: 'Link', icon: 'FiExternalLink' },
  { id: 'embed', name: 'Embed', icon: 'FiCode' },
  { id: 'guide', name: 'Guide', icon: 'FiBookOpen' }
]

export const ALLOWED_FILE_TYPES = {
  pdf: ['application/pdf'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}

// Helper used to set the current user for row level security
const setUserContext = async (userId) => {
  const { error } = await supabase.rpc('set_config', {
    setting_name: 'app.current_user_id',
    setting_value: userId,
    is_local: true
  })
  if (error) console.error('Error setting user context:', error)
}

export async function getResources(userId, role = 'professional', filters = {}) {
  try {
    await setUserContext(userId)

    let query = supabase.from('resources_12345').select('*')

    if (filters.search) query = query.ilike('title', `%${filters.search}%`)
    if (filters.category) query = query.eq('category', filters.category)
    if (filters.type) query = query.eq('resource_type', filters.type)
    if (filters.language) query = query.eq('language', filters.language)

    query = query
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching resources:', error)
    throw error
  }
}

export async function createResource(resourceData, userId) {
  try {
    await setUserContext(userId)
    const { data, error } = await supabase
      .from('resources_12345')
      .insert([
        {
          ...resourceData,
          created_by: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating resource:', error)
    throw error
  }
}

export async function uploadResourceFile(file, resourceData, userId) {
  try {
    const uploaded = await uploadFile(file, {
      title: resourceData.title,
      description: resourceData.description
    })

    const data = {
      ...resourceData,
      publit_id: uploaded.id,
      file_url: uploaded.url,
      download_url: uploaded.downloadUrl,
      thumbnail_url: uploaded.thumbnailUrl,
      preview_url: uploaded.previewUrl,
      file_name: uploaded.fileName,
      file_size: uploaded.fileSize,
      file_type: uploaded.fileType,
      width: uploaded.width,
      height: uploaded.height,
      duration: uploaded.duration,
      publit_metadata: uploaded.metadata
    }

    return await createResource(data, userId)
  } catch (error) {
    console.error('Error uploading resource file:', error)
    throw error
  }
}

// Update an existing resource
export async function updateResource(resourceId, updates, userId) {
  try {
    await setUserContext(userId)
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

export async function deleteResource(resourceId, userId) {
  try {
    await setUserContext(userId)

    const { data: resource, error: fetchError } = await supabase
      .from('resources_12345')
      .select('publit_id')
      .eq('id', resourceId)
      .single()

    if (fetchError) throw fetchError

    if (resource?.publit_id) {
      try {
        await deleteFile(resource.publit_id)
      } catch (err) {
        console.error('Publit.io delete error:', err)
      }
    }

    const { error } = await supabase
      .from('resources_12345')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', resourceId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting resource:', error)
    throw error
  }
}

export async function trackResourceAccess(resourceId, userId, actionType) {
  try {
    await setUserContext(userId)
    const { error } = await supabase.from('resource_analytics_12345').insert([
      { resource_id: resourceId, user_id: userId, action_type: actionType }
    ])
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error tracking resource access:', error)
    return false
  }
}
