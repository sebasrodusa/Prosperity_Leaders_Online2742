import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://urzsjigszcdyhmzywvdx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyenNqaWdzemNkeWhtenl3dmR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTYwNzIsImV4cCI6MjA2NzgzMjA3Mn0.3P3unNJJnL9ee6q5UJ_fOwtjp1c65Yz8lhzxa6DY2x4'

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