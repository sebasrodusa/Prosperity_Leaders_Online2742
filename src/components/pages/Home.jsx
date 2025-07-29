import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import DirectorySearchWidget from '../professional-directory/DirectorySearchWidget'
import SectionAbout from '../sections/SectionAbout'
import SectionHowItWorks from '../sections/SectionHowItWorks'
import SectionServices from '../sections/SectionServices'
import SectionFeaturedProfessionals from '../sections/SectionFeaturedProfessionals'
import SectionTestimonials from '../sections/SectionTestimonials'
import SectionBlogHighlights from '../sections/SectionBlogHighlights'
import MainNav from '../layout/MainNav'
import Loader from '../ui/Loader'
import { getSiteContent } from '../../lib/supabase'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiChevronRight } = FiIcons

const Home = () => {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState({})

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  // Intersection observer hooks for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    async function loadContent() {
      try {
        const siteContent = await getSiteContent()
        setContent(siteContent)
        
        // Set visible sections based on CMS configuration
        if (siteContent.homepage_sections) {
          setVisibleSections(siteContent.homepage_sections)
        } else {
          // Default visibility if not configured in CMS
          setVisibleSections({
            about: true,
            how_it_works: true,
            services: true,
            featured_professionals: true,
            testimonials: true,
            blog: true
          })
        }
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-anti-flash-white">
      <MainNav variant="public" />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-br from-picton-blue to-polynesian-blue text-white pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute right-0 top-0 h-full w-full opacity-10"
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3AA0FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#26B4A3" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path
              d="M0,160 C320,300 420,0 800,180 L800,800 L0,800 Z"
              fill="url(#hero-gradient)"
            />
            <circle cx="220" cy="220" r="140" fill="#3AA0FF" opacity="0.1" />
            <circle cx="550" cy="520" r="180" fill="#26B4A3" opacity="0.1" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              {content.hero?.headline || 'Welcome to Prosperity Online'}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow">
              {content.hero?.subheadline || 'Empowering families and professionals to grow, protect, and multiply their wealth — with clarity and purpose.'}
            </p>
            
            {/* Directory Search Widget */}
            <div className="max-w-2xl mx-auto mb-12">
              <DirectorySearchWidget />
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/find-a-professional">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary-cta hover:bg-primary-cta/90 text-white py-3 px-8 rounded-md font-medium shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>{content.hero?.cta_primary || 'Find a Professional'}</span>
                  <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/join">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-transparent hover:bg-white/10 border-2 border-white text-white py-3 px-8 rounded-md font-medium"
                >
                  {content.hero?.cta_secondary || 'Join the Team'}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path 
              d="M0 120L48 108C96 96 192 72 288 60C384 48 480 48 576 54C672 60 768 72 864 78C960 84 1056 84 1152 72C1248 60 1344 36 1392 24L1440 12V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V120Z" 
              fill="#F5F7FA"
            />
          </svg>
        </div>
      </section>

      {/* Modular Content Sections */}
      {visibleSections.about && (
        <SectionAbout content={content.about || {}} />
      )}
      
      {visibleSections.how_it_works && (
        <SectionHowItWorks content={content.how_it_works || {}} />
      )}
      
      {visibleSections.services && (
        <SectionServices content={content.services || {}} />
      )}
      
      {visibleSections.featured_professionals && (
        <SectionFeaturedProfessionals />
      )}
      
      {visibleSections.testimonials && (
        <SectionTestimonials />
      )}
      
      {visibleSections.blog && (
        <SectionBlogHighlights />
      )}

      {/* Footer - Kept outside modular sections as it's always present */}
      <footer className="bg-primary-bg text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Prosperity Online</h3>
              <p className="text-gray-300 mb-4 text-lg italic">
                {content.footer?.tagline || 'Faith. Family. Finance.'}
              </p>
              <div className="text-gray-400 mb-6 max-w-md">
                {content.footer?.description || 'Our mission is to empower individuals and families to achieve financial independence through personalized strategies and expert guidance.'}
              </div>
              <div className="flex space-x-4">
                <a href={content.footer?.facebook_url || '#'} className="text-gray-400 hover:text-white transition-colors">
                  <SafeIcon icon={FiIcons.FiFacebook} className="w-6 h-6" />
                </a>
                <a href={content.footer?.twitter_url || '#'} className="text-gray-400 hover:text-white transition-colors">
                  <SafeIcon icon={FiIcons.FiTwitter} className="w-6 h-6" />
                </a>
                <a href={content.footer?.instagram_url || '#'} className="text-gray-400 hover:text-white transition-colors">
                  <SafeIcon icon={FiIcons.FiInstagram} className="w-6 h-6" />
                </a>
                <a href={content.footer?.linkedin_url || '#'} className="text-gray-400 hover:text-white transition-colors">
                  <SafeIcon icon={FiIcons.FiLinkedin} className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><Link to="/find-a-professional" className="text-gray-400 hover:text-white transition-colors">Find a Professional</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Disclosures</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Licensing</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              {content.footer?.disclaimer || '© 2023 Prosperity Online. All rights reserved.'}
            </div>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">English</a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Español</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
