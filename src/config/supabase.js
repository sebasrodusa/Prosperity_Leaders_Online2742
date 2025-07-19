import supabase from '../lib/supabase'

export { supabase }

// Database schema setup functions
export const initializeDatabase = async () => {
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table')
    if (usersError && !usersError.message.includes('already exists')) {
      console.error('Error creating users table:', usersError)
    }

    // Create pages table
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
    .select(`
      *,
      users (*)
    `)
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