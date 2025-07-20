import { getSupabaseClient } from '@/lib/supabase.js'

// Helper function to set user context for RLS
const setUserContext = async (userId, userRole = 'professional') => {
  const supabase = await getSupabaseClient()
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

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// Calculate read time (200 words per minute)
const calculateReadTime = (content) => {
  const wordCount = content.split(' ').length
  return Math.max(1, Math.ceil(wordCount / 200))
}

// Generate excerpt from content
const generateExcerpt = (content, maxLength = 150) => {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '')
  if (plainText.length <= maxLength) return plainText
  
  return plainText.substr(0, maxLength).split(' ').slice(0, -1).join(' ') + '...'
}

// Blog Posts CRUD Operations

// Get published posts for public view
export const getPublishedPosts = async (page = 1, limit = 10, tagFilter = null) => {
  try {
    const offset = (page - 1) * limit
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .rpc('get_published_posts', {
        page_limit: limit,
        page_offset: offset,
        tag_filter: tagFilter
      })
    
    if (error) throw error
    
    const posts = data || []
    const totalCount = posts.length > 0 ? posts[0].total_count : 0
    const totalPages = Math.ceil(totalCount / limit)
    
    return {
      posts: posts.map(({ total_count, ...post }) => post),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  } catch (error) {
    console.error('Error fetching published posts:', error)
    throw error
  }
}

// Get single post by slug
export const getPostBySlug = async (slug) => {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts_12345')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

// Admin functions - get all posts with filters
export const getAllPosts = async (userId, userRole = 'admin', statusFilter = 'all') => {
  try {
    await setUserContext(userId, userRole)
    const supabase = await getSupabaseClient()
    let query = supabase
      .from('blog_posts_12345')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching all posts:', error)
    throw error
  }
}

// Get posts by author
export const getPostsByAuthor = async (authorId, userId, userRole = 'professional') => {
  try {
    await setUserContext(userId, userRole)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts_12345')
      .select('*')
      .eq('author_id', authorId)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching posts by author:', error)
    throw error
  }
}

// Create new post
export const createPost = async (postData, userId, userRole = 'professional') => {
  try {
    await setUserContext(userId, userRole)
    const supabase = await getSupabaseClient()
    
    const slug = generateSlug(postData.title)
    const readTime = calculateReadTime(postData.content)
    const excerpt = !postData.excerpt ? generateExcerpt(postData.content) : postData.excerpt
    
    const { data, error } = await supabase
      .from('blog_posts_12345')
      .insert([{
        ...postData,
        slug,
        excerpt,
        read_time: readTime,
        author_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

// Update post
export const updatePost = async (postId, updates, userId, userRole = 'professional') => {
  try {
    await setUserContext(userId, userRole)
    const supabase = await getSupabaseClient()
    
    const updateData = { ...updates }
    
    // Regenerate slug if title changed
    if (updates.title) {
      updateData.slug = generateSlug(updates.title)
    }
    
    // Regenerate read time if content changed
    if (updates.content) {
      updateData.read_time = calculateReadTime(updates.content)
      if (!updates.excerpt) {
        updateData.excerpt = generateExcerpt(updates.content)
      }
    }
    
    updateData.updated_at = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('blog_posts_12345')
      .update(updateData)
      .eq('id', postId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

// Delete post (admin only)
export const deletePost = async (postId, userId, userRole = 'admin') => {
  try {
    await setUserContext(userId, userRole)
    const supabase = await getSupabaseClient()
    const { error } = await supabase
      .from('blog_posts_12345')
      .delete()
      .eq('id', postId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

// Admin actions
export const approvePost = async (postId, userId, userRole = 'admin') => {
  try {
    await setUserContext(userId, userRole)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts_12345')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error approving post:', error)
    throw error
  }
}

export const rejectPost = async (postId, userId, userRole = 'admin') => {
  try {
    await setUserContext(userId, userRole)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts_12345')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error rejecting post:', error)
    throw error
  }
}

export const publishPost = async (postId, userId, userRole = 'admin') => {
  try {
    await setUserContext(userId, userRole)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts_12345')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error publishing post:', error)
    throw error
  }
}

export const unpublishPost = async (postId, userId, userRole = 'admin') => {
  try {
    await setUserContext(userId, userRole)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts_12345')
      .update({
        status: 'approved',
        published_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error unpublishing post:', error)
    throw error
  }
}

// Categories
export const getCategories = async () => {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('blog_categories_12345')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const createCategory = async (categoryData, userId, userRole = 'admin') => {
  try {
    await setUserContext(userId, userRole)
    const supabase = await getSupabaseClient()
    
    const slug = generateSlug(categoryData.name)
    
    const { data, error } = await supabase
      .from('blog_categories_12345')
      .insert([{
        ...categoryData,
        slug,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

// Get latest posts for widgets
export const getLatestPosts = async (limit = 5) => {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts_12345')
      .select('id, title, slug, author_name, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching latest posts:', error)
    return []
  }
}

// Search posts
export const searchPosts = async (query, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('blog_posts_12345')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%, content.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching posts:', error)
    return []
  }
}
