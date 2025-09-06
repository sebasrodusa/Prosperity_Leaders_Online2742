import { createClient } from '@supabase/supabase-js'
import { uploadFile as publitioUploadFile, deleteFile as publitioDeleteFile } from './publitio'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Throw early if the environment variables are missing or left as placeholders
if (
  !SUPABASE_URL ||
  !SUPABASE_ANON_KEY ||
  SUPABASE_URL.includes('your_supabase_project_url') ||
  SUPABASE_ANON_KEY.includes('your_supabase_anon_key')
) {
  console.error('Supabase env vars not resolved', {
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  })
  throw new Error(
    'Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

// Singleton Supabase client shared across the app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const getSupabaseClient = () => supabase
export const useSupabaseClient = getSupabaseClient

export async function getSiteContent() {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('site_content_po')
      .select('*')
    
    if (error) {
      console.error('Error fetching site content:', error)
      return {}
    }
    
    // Transform the flat array into a nested object by section and key
    const contentBySection = data.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {}
      }
      acc[item.section][item.key] = item.value
      return acc
    }, {})
    
    return contentBySection
  } catch (err) {
    console.error('Error in getSiteContent:', err)
    return {}
  }
}

export async function submitContactForm(formData) {
  // In a real implementation, this would send the form data to a server endpoint
  // For now, we'll simulate a successful submission
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Contact form submitted:', formData)
      resolve({ success: true })
    }, 1000)
  })
}

export async function findProfessional(searchQuery) {
  // In a real implementation, this would search for professionals in the database
  // For now, we'll simulate a search
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Searching for professional:', searchQuery)
      resolve({ success: true, redirectUrl: `/search?q=${encodeURIComponent(searchQuery)}` })
    }, 1000)
  })
}
// Database schema setup functions
export const initializeDatabase = async () => {
  try {
    const supabase = await getSupabaseClient()
    const { error: usersError } = await supabase.rpc('create_users_table')
    if (usersError && !usersError.message.includes('already exists')) {
      console.error('Error creating users table:', usersError)
    }

    const { error: pagesError } = await supabase.rpc('create_pages_table')
    if (pagesError && !pagesError.message.includes('already exists')) {
      console.error('Error creating pages table:', pagesError)
    }

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// User operations
export const createUser = async (userData) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('users_pf')
    .insert([userData])
    .select()

  if (error) throw error
  return data[0]
}

export const updateUser = async (userId, updates) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('users_pf')
    .update(updates)
    .eq('id', userId)
    .select()

  if (error) throw error
  return data[0]
}

export const getUserById = async (userId) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('users_pf')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const getUserByUsername = async (username) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('users_pf')
    .select('*')
    .eq('username', username)
    .single()

  if (error) throw error
  return data
}

export const createDirectoryUser = async (data) => {
  const supabase = await getSupabaseClient()
  const { data: result, error } = await supabase
    .from('users_directory_po')
    .insert([data])
    .select()

  if (error) throw error
  return result[0]
}

export const checkUsernameAvailable = async (username) => {
  const supabase = await getSupabaseClient()

  const { data: pfUsers, error: pfError } = await supabase
    .from('users_pf')
    .select('id')
    .eq('username', username)

  if (pfError) throw pfError
  if (pfUsers && pfUsers.length > 0) return false

  const { data: dirUsers, error: dirError } = await supabase
    .from('users_directory_po')
    .select('id')
    .eq('username', username)

  if (dirError) throw dirError

  return !dirUsers || dirUsers.length === 0
}

// Pages operations
export const createPage = async (pageData) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('pages_po')
    .insert([pageData])
    .select()

  if (error) throw error
  return data[0]
}

export const getUserPages = async (userId) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('pages_po')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getPageByCustomUsername = async (customUsername) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('pages_po')
    .select(
      `*,
      users (*)
    `
    )
    .eq('custom_username', customUsername)
    .single()

  if (error) throw error
  return data
}

export const deletePage = async (pageId) => {
  const supabase = await getSupabaseClient()
  const { error } = await supabase
    .from('pages_po')
    .delete()
    .eq('id', pageId)

  if (error) throw error
}

export const getPageById = async (pageId) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('pages_po')
    .select('*')
    .eq('id', pageId)
    .single()

  if (error) throw error
  return data
}

export const updatePage = async (pageId, updates) => {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('pages_po')
    .update(updates)
    .eq('id', pageId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Publit.io helpers
export const uploadMedia = async (file, options = {}) => {
  try {
    return await publitioUploadFile(file, options)
  } catch (error) {
    console.error('Publit.io upload failed:', error)
    throw error
  }
}

export const deleteMedia = async (fileId) => {
  try {
    return await publitioDeleteFile(fileId)
  } catch (error) {
    console.error('Publit.io delete failed:', error)
    throw error
  }
}
