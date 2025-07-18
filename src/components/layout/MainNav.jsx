import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const MainNav = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  
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
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#1C1F2A] py-2 shadow-lg' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-white font-bold text-xl">Prosperity Leaders™</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-[#3AA0FF] transition-colors">Home</Link>
            <Link to="/about" className="text-white hover:text-[#3AA0FF] transition-colors">About</Link>
            <Link to="/services" className="text-white hover:text-[#3AA0FF] transition-colors">Services</Link>
            <Link to="/careers" className="text-white hover:text-[#3AA0FF] transition-colors">Careers</Link>
            <Link to="/contact" className="text-white hover:text-[#3AA0FF] transition-colors">Contact</Link>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center text-white hover:text-[#3AA0FF] transition-colors focus:outline-none">
                  <img 
                    src={user.profile_photo_url || 'https://via.placeholder.com/40'} 
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                  <span>{user.full_name}</span>
                  <SafeIcon icon={FiIcons.FiChevronDown} className="ml-1 w-4 h-4" />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-[#3AA0FF] hover:bg-[#3AA0FF]/90 text-white py-2 px-4 rounded-md transition-colors"
              >
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <SafeIcon 
              icon={mobileMenuOpen ? FiIcons.FiX : FiIcons.FiMenu} 
              className="w-6 h-6" 
            />
          </button>
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
                  to="/careers" 
                  className="text-white hover:text-[#3AA0FF] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Careers
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
                        src={user.profile_photo_url || 'https://via.placeholder.com/40'} 
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
                  <Link 
                    to="/login"
                    className="bg-[#3AA0FF] hover:bg-[#3AA0FF]/90 text-white py-2 px-4 rounded-md transition-colors inline-block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
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