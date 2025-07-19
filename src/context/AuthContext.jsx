import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerkAuth()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (isLoaded) {
      const role = clerkUser?.publicMetadata?.role || 'visitor'
      setUserData(clerkUser ? { ...clerkUser, role } : null)
    }
  }, [clerkUser, isLoaded])

  const updateUser = (updates) => {
    setUserData(prev => (prev ? { ...prev, ...updates } : prev))
  }

  const value = {
    user: userData,
    loading: !isLoaded,
    logout: signOut,
    updateUser,
    isAuthenticated: !!clerkUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}