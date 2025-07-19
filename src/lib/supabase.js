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