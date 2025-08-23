import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../ui/ThemeToggle'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiUser, FiLogOut, FiUsers, FiChevronDown, FiMenu, FiX, FiHome, FiLayout, FiSettings, FiEdit3, FiBox } = FiIcons

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0Ii8+PHBhdGggZD0iTTQgMjBjMC00IDQtNiA4LTZzOCAyIDggNiIvPjwvc3ZnPg=='

const MainNav = ({ variant = 'public' }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const isAdmin = user?.role === 'admin'

  const dashboardMenuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { name: 'My Pages', icon: FiLayout, path: '/dashboard/pages' },
    { name: 'Team', icon: FiUsers, path: '/dashboard/team' },
    ...(isAdmin ? [
      { name: 'Content Manager', icon: FiEdit3, path: '/dashboard/cms' }
    ] : []),
    { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' }
  ]

  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dashboard sidebar variant
  if (variant === 'sidebar') {
    return (
      <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <Link to="/" className="flex items-center">
            <img
              src="https://media.publit.io/file/ProsperityWebApp/Prosperity-Elephant-WIDE-BLUEPNG.png"
              alt="Prosperity Online"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="px-4 py-2">
          {dashboardMenuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-picton-blue/10 text-picton-blue'
                    : 'text-polynesian-blue/70 dark:text-gray-300 hover:bg-anti-flash-white dark:hover:bg-gray-700'
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
          
          <div className="mt-8 px-4 flex items-center justify-between">
            <span className="text-sm text-polynesian-blue/60 dark:text-gray-400">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    )
  }

  // Dashboard header variant
  if (variant === 'dashboard') {
    return (
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-polynesian-blue shadow-sm border-b border-polynesian-blue/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="https://media.publit.io/file/ProsperityWebApp/Prosperity-Elephant-WIDE-BLUEPNG.png"
                  alt="Prosperity Online"
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-sm text-white/70">Platform</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle className="border border-white/20" />
              

              
              {user && (
                <div className="flex items-center space-x-3 relative">
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <img
                      src={user.profile_photo_url || defaultAvatar}
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
                      className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <SafeIcon icon={FiUser} className="inline-block mr-2 w-4 h-4" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <SafeIcon icon={FiLogOut} className="inline-block mr-2 w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>
    )
  }

  // Default public header variant
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#1C1F2A] py-2 shadow-lg' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="https://media.publit.io/file/ProsperityWebApp/Prosperity-Elephant-WIDE-BLUEPNG.png"
              alt="Prosperity Online"
              className="h-8 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-[#3AA0FF] transition-colors">Home</Link>
            <Link to="/about" className="text-white hover:text-[#3AA0FF] transition-colors">About</Link>
            <Link to="/services" className="text-white hover:text-[#3AA0FF] transition-colors">Services</Link>
            <Link to="/find-a-professional" className="text-white hover:text-[#3AA0FF] transition-colors">Find a Professional</Link>
            <Link to="/blog" className="text-white hover:text-[#3AA0FF] transition-colors">Blog</Link>
            <Link to="/agents" className="text-white hover:text-[#3AA0FF] transition-colors">Agents</Link>
            <Link to="/contact" className="text-white hover:text-[#3AA0FF] transition-colors">Contact</Link>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center text-white hover:text-[#3AA0FF] transition-colors focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <img
                    src={user.profile_photo_url || defaultAvatar}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                  <span>{user.full_name}</span>
                  <SafeIcon
                    icon={userMenuOpen ? FiIcons.FiChevronUp : FiChevronDown}
                    className="ml-1 w-4 h-4"
                  />
                </button>
                
                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="text-white hover:text-[#3AA0FF] transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-[#3AA0FF] hover:bg-[#3AA0FF]/90 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              <SafeIcon icon={mobileMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1C1F2A] overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-white hover:text-[#3AA0FF] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-white hover:text-[#3AA0FF] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/services"
                  className="text-white hover:text-[#3AA0FF] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="/find-a-professional"
                  className="text-white hover:text-[#3AA0FF] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find a Professional
                </Link>
                <Link
                  to="/blog"
                  className="text-white hover:text-[#3AA0FF] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  to="/contact"
                  className="text-white hover:text-[#3AA0FF] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                {user ? (
                  <>
                    <hr className="border-gray-700" />
                    <div className="flex items-center py-2">
                      <img
                        src={user.profile_photo_url || defaultAvatar}
                        alt={user.full_name}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                      <span className="text-white">{user.full_name}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="text-white hover:text-[#3AA0FF] transition-colors py-2 pl-10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="text-white hover:text-[#3AA0FF] transition-colors py-2 pl-10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-[#3AA0FF] transition-colors py-2 pl-10 text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="text-white hover:text-[#3AA0FF] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/login"
                      className="bg-[#3AA0FF] hover:bg-[#3AA0FF]/90 text-white py-2 px-4 rounded-md transition-colors inline-block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default MainNav
