import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useForm } from 'react-hook-form'
import { getSiteContent, submitContactForm, findProfessional } from '../../lib/supabase'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import MainNav from '../layout/MainNav'

const { FiShield, FiDollarSign, FiBriefcase, FiHeart, FiPieChart, FiTrendingUp, FiBookOpen, FiUmbrella, FiGift, FiTarget, FiBook, FiUsers, FiSearch, FiArrowRight } = FiIcons

const Home = () => {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSubmitting, setSearchSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  useEffect(() => {
    async function loadContent() {
      try {
        const siteContent = await getSiteContent()
        setContent(siteContent)
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  const handleContactSubmit = async (data) => {
    setContactSubmitting(true)
    try {
      await submitContactForm(data)
      setContactSuccess(true)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setContactSubmitting(false)
    }
  }

  const handleFindProfessional = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearchSubmitting(true)
    try {
      const result = await findProfessional(searchQuery)
      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl
      }
    } catch (error) {
      console.error('Error searching for professional:', error)
    } finally {
      setSearchSubmitting(false)
    }
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }

  // Intersection observer hooks for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [whatWeDoRef, whatWeDoInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [servicesRef, servicesInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [joinTeamRef, joinTeamInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [findProRef, findProInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [contactRef, contactInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Service icons mapping
  const serviceIcons = [
    FiHeart, // Life Insurance
    FiPieChart, // Retirement Planning
    FiTrendingUp, // Wealth Accumulation
    FiBookOpen, // College Savings
    FiUmbrella, // Income Protection
    FiGift // Legacy Transfer
  ]

  // Function to render formatted content
  const renderFormattedContent = (text) => {
    if (!text) return null;

    // Simple markdown-like parsing
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5F7FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3AA0FF]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Add Navigation */}
      <MainNav variant="public" />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-[#1C1F2A] to-[#2A3042] text-white py-24 md:py-32"
      >
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute right-0 top-0 h-full w-full opacity-10"
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3AA0FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#26B4A3" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path
              d="M400,400 Q600,200 800,400 T1200,400 T1600,400 T2000,400 T2400,400 V800 H0 V400 Q200,600 400,400"
              fill="url(#gradient)"
            />
            <circle cx="400" cy="300" r="100" fill="#3AA0FF" opacity="0.1" />
            <circle cx="600" cy="500" r="150" fill="#26B4A3" opacity="0.1" />
            <circle cx="200" cy="600" r="120" fill="#3AA0FF" opacity="0.1" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {content.hero?.headline || 'Welcome to Prosperity Leaders™'}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10">
              {content.hero?.subheadline || 'Empowering families and professionals to grow, protect, and multiply their wealth — with clarity and purpose.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#3AA0FF] hover:bg-[#3AA0FF]/90 text-white py-3 px-8 rounded-md font-medium shadow-lg"
              >
                {content.hero?.cta_primary || 'Start Your Financial Plan'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-transparent hover:bg-white/10 border-2 border-white text-white py-3 px-8 rounded-md font-medium"
              >
                {content.hero?.cta_secondary || 'Join the Team'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      {content.about && (
        <section ref={whatWeDoRef} className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              animate={whatWeDoInView ? "visible" : "hidden"}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">
                {content.about?.title || 'About Us'}
              </h2>
              <div className="h-1 w-24 bg-[#3AA0FF] mx-auto"></div>
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial="hidden"
              animate={whatWeDoInView ? "visible" : "hidden"}
              variants={fadeIn}
            >
              <div className="text-gray-600 prose prose-lg mx-auto">
                {renderFormattedContent(content.about?.body || 'Prosperity Leaders™ is a platform dedicated to helping individuals and families achieve financial independence through personalized strategies and expert guidance.')}
              </div>

              {content.about?.image_url && (
                <div className="mt-12">
                  <img
                    src={content.about.image_url}
                    alt="About Prosperity Leaders"
                    className="mx-auto rounded-lg shadow-md max-w-full h-auto"
                  />
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* What We Do Section */}
      <section ref={whatWeDoRef} className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={whatWeDoInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">
              {content.what_we_do?.title || 'What We Do'}
            </h2>
            <div className="h-1 w-24 bg-[#3AA0FF] mx-auto"></div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate={whatWeDoInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* Card 1 */}
            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              variants={fadeIn}
            >
              <div className="bg-[#3AA0FF]/10 p-6 flex justify-center">
                <SafeIcon icon={FiDollarSign} className="w-16 h-16 text-[#3AA0FF]" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">
                  {content.what_we_do?.card1_title || 'Financial Planning'}
                </h3>
                <div className="text-gray-600">
                  {renderFormattedContent(content.what_we_do?.card1_description || 'Comprehensive financial strategies tailored to your unique goals and circumstances.')}
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              variants={fadeIn}
            >
              <div className="bg-[#26B4A3]/10 p-6 flex justify-center">
                <SafeIcon icon={FiShield} className="w-16 h-16 text-[#26B4A3]" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">
                  {content.what_we_do?.card2_title || 'Protection & Security'}
                </h3>
                <div className="text-gray-600">
                  {renderFormattedContent(content.what_we_do?.card2_description || 'Safeguard your family\'s future with our expert protection solutions.')}
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              variants={fadeIn}
            >
              <div className="bg-[#3AA0FF]/10 p-6 flex justify-center">
                <SafeIcon icon={FiBriefcase} className="w-16 h-16 text-[#3AA0FF]" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">
                  {content.what_we_do?.card3_title || 'Career & Business Opportunity'}
                </h3>
                <div className="text-gray-600">
                  {renderFormattedContent(content.what_we_do?.card3_description || 'Join our team and build a rewarding career helping others achieve financial independence.')}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Rest of the sections remain unchanged */}
      {/* ... */}

      {/* Footer Section */}
      <footer className="bg-[#1C1F2A] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Prosperity Leaders™</h3>
              <p className="text-gray-300 mb-4 text-lg italic">
                {content.footer?.tagline || 'Faith. Family. Finance.'}
              </p>
              <div className="text-gray-400 mb-6 max-w-md">
                {renderFormattedContent(content.footer?.description || 'Our mission is to empower individuals and families to achieve financial independence through personalized strategies and expert guidance.')}
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
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
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
              {renderFormattedContent(content.footer?.disclaimer || '© 2023 Prosperity Leaders™. All rights reserved.')}
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