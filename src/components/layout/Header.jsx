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
      className="bg-polynesian-blue shadow-sm border-b border-polynesian-blue/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              Prosperity Leaders™
            </h1>
            <span className="ml-2 text-sm text-white/70">Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Switcher (Demo Only) */}
            <div className="relative">
              <select
                value={user?.id || ''}
                onChange={(e) => switchUser(e.target.value)}
                className="appearance-none bg-white/10 border border-white/20 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-picton-blue"
              >
                <option value="" className="text-polynesian-blue">Switch User (Demo)</option>
                {mockUsers.map(mockUser => (
                  <option key={mockUser.id} value={mockUser.id} className="text-polynesian-blue">
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
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                  />
                  <span className="text-sm font-medium text-white">
                    {user.full_name}
                  </span>
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-picton-blue rounded-md transition-colors"
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