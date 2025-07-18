import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiHome, FiLayout, FiUsers, FiSettings, FiEdit3, FiBox, FiUser, FiFileText } = FiIcons

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { name: 'My Professional Profile', icon: FiUser, path: '/dashboard/professional-profile' },
    { name: 'My Landing Pages', icon: FiLayout, path: '/dashboard/landing-pages' },
    { name: 'Team', icon: FiUsers, path: '/dashboard/team' },
    ...(isAdmin
      ? [{ name: 'Content Manager', icon: FiEdit3, path: '/dashboard/cms' }]
      : []),
    { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' }
  ]

  return (
    <nav className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <SafeIcon icon={FiBox} className="w-6 h-6 text-picton-blue" />
          <span className="text-lg font-bold text-polynesian-blue">
            Prosperity Leaders™
          </span>
        </Link>
      </div>
      <div className="px-4 py-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-picton-blue/10 text-picton-blue'
                  : 'text-polynesian-blue/70 hover:bg-anti-flash-white'
              }`}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="w-1 h-6 bg-picton-blue absolute right-0 rounded-l-full"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default Sidebar