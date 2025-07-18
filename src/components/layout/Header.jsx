import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { mockUsers } from '../../data/mockUsers'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiUser, FiLogOut, FiUsers } = FiIcons

const Header = () => {
  const { user, logout, switchUser } = useAuth()

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              Prosperity Leaders™
            </h1>
            <span className="ml-2 text-sm text-gray-500">Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Switcher (Demo Only) */}
            <div className="relative">
              <select
                value={user?.id || ''}
                onChange={(e) => switchUser(e.target.value)}
                className="appearance-none bg-gray-100 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Switch User (Demo)</option>
                {mockUsers.map(mockUser => (
                  <option key={mockUser.id} value={mockUser.id}>
                    {mockUser.full_name}
                  </option>
                ))}
              </select>
            </div>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.profile_photo_url}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.full_name}
                  </span>
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                  title="Logout"
                >
                  <SafeIcon icon={FiLogOut} className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header