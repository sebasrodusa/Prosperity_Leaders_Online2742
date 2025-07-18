import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { mockUsers } from '../../data/mockUsers'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiUser, FiLock } = FiIcons

const Login = () => {
  const { login } = useAuth()
  const [selectedUser, setSelectedUser] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!selectedUser) return

    setLoading(true)
    try {
      const user = mockUsers.find(u => u.id === selectedUser)
      await login(user)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-anti-flash-white to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 border border-gray-200"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-polynesian-blue mb-2">
            Prosperity Leaders™
          </h1>
          <p className="text-polynesian-blue/70">Sign in to your platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-polynesian-blue mb-2">
              Select User (Demo Mode)
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
              required
            >
              <option value="">Choose a user...</option>
              {mockUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.full_name} (@{user.username})
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading || !selectedUser}
            className="w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-polynesian-blue/60">
          <p>Demo Mode: Select any user to continue</p>
          <p className="mt-2">In production, this will use Clerk authentication</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login