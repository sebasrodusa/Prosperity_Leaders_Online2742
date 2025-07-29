import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiUser, FiLogOut, FiChevronDown } = FiIcons

const Header = () => {
  const { user, logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-polynesian-blue shadow-sm border-b border-polynesian-blue/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="https://media.publit.io/file/ProsperityWebApp/Prosperity-Elephant-WIDE-BLUEPNG.png"
              alt="Prosperity Online"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-sm text-white/70">Platform</span>
          </div>

          <div className="flex items-center space-x-4">

            {user && (
              <div className="flex items-center space-x-3 relative">
                <div 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <img
                    src={user.profile_photo_url}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                  />
                  <span className="text-sm font-medium text-white">
                    {user.full_name}
                  </span>
                  <SafeIcon 
                    icon={userMenuOpen ? FiIcons.FiChevronUp : FiChevronDown} 
                    className="w-4 h-4 text-white/70"
                  />
                </div>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <a 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        setUserMenuOpen(false);
                        // Add navigation logic here
                      }}
                    >
                      <SafeIcon icon={FiUser} className="inline-block mr-2 w-4 h-4" />
                      Profile Settings
                    </a>
                    <button 
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiLogOut} className="inline-block mr-2 w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}

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
