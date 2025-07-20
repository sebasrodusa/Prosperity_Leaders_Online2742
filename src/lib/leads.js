import { getSupabaseClient } from '@/lib/supabase.js'

// Helper function to set user context for RLS
const setUserContext = async (userId) => {
  const supabase = await getSupabaseClient()
  const { error } = await supabase.rpc('set_config', {
    setting_name: 'app.current_user_id',
    setting_value: userId,
    is_local: true
  })
  if (error) console.error('Error setting user context:', error)
}

// Lead CRUD operations
export const getLeads = async (userId) => {
  try {
    await setUserContext(userId)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('leads_12345')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching leads:', error)
    throw error
  }
}

export const getLead = async (leadId, userId) => {
  try {
    await setUserContext(userId)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('leads_12345')
      .select('*')
      .eq('id', leadId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching lead:', error)
    throw error
  }
}

export const createLead = async (leadData) => {
  try {
    await setUserContext(leadData.user_id)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('leads_12345')
      .insert([{
        ...leadData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating lead:', error)
    throw error
  }
}

export const updateLead = async (leadId, updates, userId) => {
  try {
    await setUserContext(userId)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('leads_12345')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating lead:', error)
    throw error
  }
}

export const deleteLead = async (leadId, userId) => {
  try {
    await setUserContext(userId)
    const supabase = await getSupabaseClient()
    const { error } = await supabase
      .from('leads_12345')
      .delete()
      .eq('id', leadId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting lead:', error)
    throw error
  }
}

// Lead statistics
export const getLeadStats = async (userId) => {
  try {
    await setUserContext(userId)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('leads_12345')
      .select('status')
    
    if (error) throw error
    
    const stats = {
      total: data.length,
      new: data.filter(l => l.status === 'new').length,
      active: data.filter(l => ['contacted', 'meeting_scheduled', 'follow_up'].includes(l.status)).length,
      closed_won: data.filter(l => l.status === 'closed_won').length,
      closed_lost: data.filter(l => l.status === 'closed_lost').length
    }
    
    return stats
  } catch (error) {
    console.error('Error fetching lead stats:', error)
    return { total: 0, new: 0, active: 0, closed_won: 0, closed_lost: 0 }
  }
}

// Lead notes operations
export const getLeadNotes = async (leadId, userId) => {
  try {
    await setUserContext(userId)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('lead_notes_12345')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching lead notes:', error)
    throw error
  }
}

export const createLeadNote = async (leadId, content, userId) => {
  try {
    await setUserContext(userId)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('lead_notes_12345')
      .insert([{
        lead_id: leadId,
        user_id: userId,
        content,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating lead note:', error)
    throw error
  }
}

// Lead tasks operations
export const getLeadTasks = async (leadId, userId) => {
  try {
    await setUserContext(userId)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('lead_tasks_12345')
      .select('*')
      .eq('lead_id', leadId)
      .order('due_date', { ascending: true, nullsLast: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching lead tasks:', error)
    throw error
  }
}

export const createLeadTask = async (leadId, taskData, userId) => {
  try {
    await setUserContext(userId)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('lead_tasks_12345')
      .insert([{
        lead_id: leadId,
        user_id: userId,
        ...taskData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating lead task:', error)
    throw error
  }
}

export const updateLeadTask = async (taskId, updates, userId) => {
  try {
    await setUserContext(userId)
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('lead_tasks_12345')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating lead task:', error)
    throw error
  }
}

// Mock data functions for development (since we don't have real data yet)
export const generateMockLeads = async (userId) => {
  const mockLeads = [
    {
      user_id: userId,
      full_name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      status: 'new',
      notes: 'Interested in life insurance and retirement planning. Has young family.',
      lead_source: 'website_form',
      tags: ['family', 'life_insurance'],
      score: 8
    },
    {
      user_id: userId,
      full_name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 987-6543',
      status: 'contacted',
      notes: 'Business owner looking for comprehensive financial planning.',
      lead_source: 'referral',
      tags: ['business_owner', 'high_value'],
      score: 9
    },
    {
      user_id: userId,
      full_name: 'Michael Davis',
      email: 'michael.davis@email.com',
      phone: '+1 (555) 456-7890',
      status: 'meeting_scheduled',
      notes: 'Scheduled consultation for next week. Interested in investment options.',
      lead_source: 'networking_event',
      tags: ['investments'],
      score: 7
    }
  ]

  try {
    for (const lead of mockLeads) {
      await createLead(lead)
    }
    return true
  } catch (error) {
    console.error('Error generating mock leads:', error)
    return false
  }
}
