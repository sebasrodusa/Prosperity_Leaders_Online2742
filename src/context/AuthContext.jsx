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

  useEffect(() => {
    const init = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUserData(user)
      setLoading(false)
    }
    init()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserData(session?.user ?? null)
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
