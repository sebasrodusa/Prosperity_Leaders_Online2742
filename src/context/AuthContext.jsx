import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (session) => {
    const { user } = session
    if (!user) return

    try {
      let { data: profile } = await supabase
        .from('users_pf')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) {
        ;({ data: profile } = await supabase
          .from('users_pf')
          .select('*')
          .eq('email', user.email)
          .single())
      }

      if (!profile) {
        const meta = user.user_metadata || {}
        const newProfile = {
          id: user.id,
          email: user.email,
          role: meta.role || null,
          first_name: meta.first_name || null,
          last_name: meta.last_name || null,
          full_name:
            meta.full_name ||
            [meta.first_name, meta.last_name].filter(Boolean).join(' ') ||
            null,
          phone: meta.phone || null,
          agent_id: meta.agent_id || null,
          team: meta.team || null,
          username: meta.username || null,
          title: meta.title || null,
          city: meta.city || null,
          state: meta.state || null,
          languages: meta.languages || null,
          services_offered: meta.services_offered || null
        }

        const { data: inserted, error: insertError } = await supabase
          .from('users_pf')
          .insert(newProfile)
          .select()
          .single()

        if (insertError) {
          if (insertError.code === '23505') {
            const { data: updated, error: updateError } = await supabase
              .from('users_pf')
              .update(newProfile)
              .eq('id', user.id)
              .select()
              .single()
            if (updateError) throw updateError
            profile = updated
          } else {
            throw insertError
          }
        } else {
          profile = inserted
        }
      }

      if (profile && profile.role === 'advisor') {
        const dirData = {
          user_id: profile.id,
          username: profile.username,
          full_name: profile.full_name,
          title: profile.title,
          city: profile.city,
          state: profile.state,
          languages: profile.languages,
          services_offered: profile.services_offered,
          profile_photo_url: profile.profile_photo_url || null,
          has_calendly: !!profile.calendly_link
        }

        const { error: insertDirError } = await supabase
          .from('users_directory_po')
          .insert(dirData)

        if (insertDirError && insertDirError.code === '23505') {
          await supabase
            .from('users_directory_po')
            .update(dirData)
            .eq('user_id', profile.id)
        }
      }

      setUserData({ ...user, ...profile })
    } catch (error) {
      console.error('Error fetching profile:', error)
      setUserData(user)
    }
  }

  useEffect(() => {
    const init = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      if (session) {
        await fetchProfile(session)
      }
      setLoading(false)
    }
    init()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setLoading(true)
        fetchProfile(session).finally(() => setLoading(false))
      } else {
        setUserData(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUserData(null)
  }

  const updateUser = (updates) => {
    setUserData((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  const value = {
    user: userData,
    loading,
    logout,
    updateUser,
    isAuthenticated: !!userData
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
