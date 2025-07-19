import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase

export async function getSiteContent() {
  try {
    const { data, error } = await supabase
      .from('site_content_12345')
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
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()

  if (error) throw error
  return data[0]
}

export const updateUser = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()

  if (error) throw error
  return data[0]
}

export const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const getUserByUsername = async (username) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (error) throw error
  return data
}

// Pages operations
export const createPage = async (pageData) => {
  const { data, error } = await supabase
    .from('pages')
    .insert([pageData])
    .select()

  if (error) throw error
  return data[0]
}

export const getUserPages = async (userId) => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getPageByCustomUsername = async (customUsername) => {
  const { data, error } = await supabase
    .from('pages')
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
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId)

  if (error) throw error
}
