import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockUsers } from '../data/mockUsers'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate Clerk authentication check
    const checkAuth = async () => {
      try {
        // For demo purposes, auto-login with first mock admin user
        const mockUser = { ...mockUsers[0], role: 'admin' }
        setUser(mockUser)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const login = async (userData) => {
    setUser(userData)
    return userData
  }

  const logout = async () => {
    setUser(null)
  }

  const switchUser = (userId) => {
    const mockUser = mockUsers.find(u => u.id === userId)
    if (mockUser) {
      setUser({ ...mockUser, role: 'admin' })
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    switchUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}