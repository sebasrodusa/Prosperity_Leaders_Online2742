import React from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { mockUsers, mockPages, templateTypes } from '../../data/mockUsers'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiMail, FiPhone, FiCalendar, FiInstagram, FiFacebook, FiLinkedin, FiYoutube, FiExternalLink } = FiIcons

const LandingPage = () => {
  const { username } = useParams()
  
  // Find the page by custom username
  const page = mockPages.find(p => p.custom_username === username)
  const user = page ? mockUsers.find(u => u.id === page.user_id) : null

  if (!page || !user) {
    return (
      <div className="min-h-screen bg-anti-flash-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-polynesian-blue mb-4">Page Not Found</h1>
          <p className="text-polynesian-blue/70">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const template = templateTypes[page.template_type]
  const socialLinks = Object.entries(user.social_links || {}).filter(([key, value]) => value)

  return (
    <div className="min-h-screen bg-gradient-to-br from-anti-flash-white to-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-polynesian-blue shadow-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${template.color}`} />
              <span className="text-sm font-medium text-white/90">
                {template.name}
              </span>
            </div>
            <div className="text-sm text-white/70">
              Prosperity Leaders™
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
              <img
                src={user.profile_photo_url}
                alt={user.full_name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-picton-blue/20"
              />
              <h1 className="text-2xl font-bold text-polynesian-blue mb-2">
                {user.full_name}
              </h1>
              <p className="text-polynesian-blue/70 mb-4">{user.bio}</p>
              
              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-center space-x-2 text-polynesian-blue/70">
                  <SafeIcon icon={FiMail} className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center justify-center space-x-2 text-polynesian-blue/70">
                    <SafeIcon icon={FiPhone} className="w-4 h-4" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
              </div>

              {/* Calendar Button */}
              {user.calendly_link && (
                <motion.a
                  href={user.calendly_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-picton-blue text-white rounded-lg hover:bg-picton-blue/90 transition-colors mb-6"
                >
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                  Schedule Consultation
                </motion.a>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-polynesian-blue mb-3">Connect With Me</h3>
                  <div className="flex justify-center space-x-3">
                    {socialLinks.map(([platform, url]) => {
                      const icons = {
                        instagram: FiInstagram,
                        facebook: FiFacebook,
                        linkedin: FiLinkedin,
                        youtube: FiYoutube
                      }
                      const colors = {
                        instagram: 'text-pink-500',
                        facebook: 'text-blue-600',
                        linkedin: 'text-blue-700',
                        youtube: 'text-red-500'
                      }
                      return (
                        <motion.a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className={`p-2 rounded-full bg-anti-flash-white hover:bg-gray-200 transition-colors ${colors[platform]}`}
                        >
                          <SafeIcon icon={icons[platform]} className="w-5 h-5" />
                        </motion.a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-polynesian-blue mb-6">
                {page.title || `${template.name} Services`}
              </h2>
              
              {/* Template-specific content */}
              {page.template_type === 'recruiting' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-polynesian-blue mb-3">Join Our Growing Team</h3>
                    <p className="text-polynesian-blue/70 mb-4">
                      Are you ready to take control of your financial future? Join our team of successful financial professionals and build a career that offers unlimited earning potential.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-picton-blue/10 p-4 rounded-lg border border-picton-blue/20">
                      <h4 className="font-semibold text-polynesian-blue mb-2">Why Join Us?</h4>
                      <ul className="text-sm text-polynesian-blue/80 space-y-1">
                        <li>• Unlimited earning potential</li>
                        <li>• Comprehensive training program</li>
                        <li>• Flexible work schedule</li>
                        <li>• Ongoing support and mentorship</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">What We Offer</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Industry-leading compensation</li>
                        <li>• Advanced marketing tools</li>
                        <li>• Team collaboration</li>
                        <li>• Career advancement opportunities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {page.template_type === 'client' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-polynesian-blue mb-3">Client Resources</h3>
                    <p className="text-polynesian-blue/70 mb-4">
                      Access your account information, policy documents, and financial planning tools all in one place.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-picton-blue/20 rounded-lg p-4 hover:shadow-md transition-shadow hover:bg-picton-blue/5">
                      <h4 className="font-semibold text-polynesian-blue mb-2">Policy Management</h4>
                      <p className="text-sm text-polynesian-blue/70">View and manage your insurance policies</p>
                    </div>
                    <div className="border border-picton-blue/20 rounded-lg p-4 hover:shadow-md transition-shadow hover:bg-picton-blue/5">
                      <h4 className="font-semibold text-polynesian-blue mb-2">Financial Planning</h4>
                      <p className="text-sm text-polynesian-blue/70">Access your personalized financial plan</p>
                    </div>
                  </div>
                </div>
              )}

              {page.template_type === 'latino_usa' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-polynesian-blue mb-3">Servicios Financieros para la Comunidad Latina</h3>
                    <p className="text-polynesian-blue/70 mb-4">
                      Ofrecemos servicios financieros especializados para ayudar a las familias latinas a construir un futuro próspero y seguro.
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-3">Nuestros Servicios</h4>
                    <ul className="text-orange-800 space-y-2">
                      <li>• Seguros de vida y salud</li>
                      <li>• Planificación financiera familiar</li>
                      <li>• Consultoría en español</li>
                      <li>• Productos de inversión</li>
                    </ul>
                  </div>
                </div>
              )}

              {page.template_type === 'international' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-polynesian-blue mb-3">International Financial Services</h3>
                    <p className="text-polynesian-blue/70 mb-4">
                      Specialized financial solutions for international clients, including cross-border wealth management and global investment strategies.
                    </p>
                  </div>
                  
                  <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-3">Global Expertise</h4>
                    <ul className="text-indigo-800 space-y-2">
                      <li>• Cross-border financial planning</li>
                      <li>• International investment portfolios</li>
                      <li>• Multi-currency strategies</li>
                      <li>• Global tax optimization</li>
                    </ul>
                  </div>
                </div>
              )}

              {page.template_type === 'standard' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-polynesian-blue mb-3">Professional Financial Services</h3>
                    <p className="text-polynesian-blue/70 mb-4">
                      I provide comprehensive financial planning and insurance solutions to help you achieve your financial goals and protect your family's future.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-picton-blue/10 p-4 rounded-lg border border-picton-blue/20">
                      <h4 className="font-semibold text-polynesian-blue mb-2">Services Offered</h4>
                      <ul className="text-sm text-polynesian-blue/80 space-y-1">
                        <li>• Life Insurance</li>
                        <li>• Financial Planning</li>
                        <li>• Retirement Planning</li>
                        <li>• Investment Strategies</li>
                      </ul>
                    </div>
                    
                    <div className="bg-anti-flash-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-polynesian-blue mb-2">Why Choose Me?</h4>
                      <ul className="text-sm text-polynesian-blue/80 space-y-1">
                        <li>• Personalized approach</li>
                        <li>• Years of experience</li>
                        <li>• Trusted advisor</li>
                        <li>• Comprehensive solutions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional IDs */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-sm text-polynesian-blue/60">
                  {user.agent_id && (
                    <span>Agent ID: {user.agent_id}</span>
                  )}
                  {user.international_id && (
                    <span>International ID: {user.international_id}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage