import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getTemplateById } from '../../data/landingPageTemplates'
import { getPageByCustomUsername } from '../../lib/supabase'
import LandingPageTemplate from '../landingPages/LandingPageTemplate'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import NotFound from './NotFound'

const { FiArrowLeft } = FiIcons

const LandingPage = () => {
  const { custom_username, username } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [pageData, setPageData] = useState(null)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadPage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch page from Supabase using the custom username
        const landingPage = await getPageByCustomUsername(custom_username)

        if (landingPage) {
          const template = getTemplateById(landingPage.template_type)

          if (!template) {
            throw new Error('Template not found')
          }

          let content = template.defaultContent

          if (landingPage.content) {
            try {
              const parsedContent = JSON.parse(landingPage.content)
              if (
                parsedContent &&
                typeof parsedContent === 'object' &&
                Object.keys(parsedContent).length > 0
              ) {
                content = parsedContent
              }
            } catch (err) {
              console.error('Invalid page content:', err)
              throw new Error('Invalid page content')
            }
          }

          setPageData({
            page: landingPage,
            user: landingPage.users,
            template,
            content
          })
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Error loading landing page:', error)
        setError(error.message || 'Failed to load page')
      } finally {
        setIsLoading(false)
      }
    }

    loadPage()
  }, [custom_username, username])

  const handleFormSubmit = async (formData) => {
    // In production, this would submit to your backend
    console.log('Form submitted:', formData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // You could send to your CRM, email system, etc.
    return { success: true }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-anti-flash-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  if (notFound) {
    return <NotFound />
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-anti-flash-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-polynesian-blue mb-4">
            {error || 'Error Loading Page'}
          </h1>
          <p className="text-polynesian-blue/70 mb-6">
            The landing page you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-picton-blue hover:text-picton-blue/80 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    )
  }

  const { user, page, template, content } = pageData

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-polynesian-blue shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className={`w-3 h-3 rounded-full ${template.color.replace('bg-', 'bg-')}`} 
              />
              <span className="text-sm font-medium text-white/90">
                {template.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/70">
                {user.full_name}
              </span>
              <div className="text-sm text-white/70">
                Prosperity Online
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Template Content */}
      <LandingPageTemplate
        template={template}
        content={content}
        professional={user}
        onFormSubmit={handleFormSubmit}
      />

      {/* Footer */}
      <footer className="bg-polynesian-blue text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {user.full_name}
              </h3>
              <div className="space-y-2 text-sm text-white/70">
                {user.phone && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiIcons.FiPhone} className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiIcons.FiMail} className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
                Professional IDs
              </h4>
              <div className="space-y-1 text-sm text-white/70">
                {user.agent_id && (
                  <p>Agent ID: {user.agent_id}</p>
                )}
                {user.international_id && (
                  <p>International ID: {user.international_id}</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
                Connect
              </h4>
              <div className="flex space-x-3">
                {Object.entries(user.social_links || {}).map(([platform, url]) => {
                  if (!url) return null
                  
                  const icons = {
                    instagram: FiIcons.FiInstagram,
                    facebook: FiIcons.FiFacebook,
                    linkedin: FiIcons.FiLinkedin,
                    youtube: FiIcons.FiYoutube
                  }
                  
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <SafeIcon icon={icons[platform]} className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
            <p>© 2024 Prosperity Online. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

