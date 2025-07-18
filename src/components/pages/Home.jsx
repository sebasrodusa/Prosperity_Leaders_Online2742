import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useForm } from 'react-hook-form'
import { getSiteContent, submitContactForm, findProfessional } from '../../lib/supabase'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const {
  FiShield,
  FiDollarSign,
  FiBriefcase,
  FiHeart,
  FiPieChart,
  FiTrendingUp,
  FiBookOpen,
  FiUmbrella,
  FiGift,
  FiTarget,
  FiBook,
  FiUsers,
  FiSearch,
  FiArrowRight
} = FiIcons

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
      const siteContent = await getSiteContent()
      setContent(siteContent)
      setLoading(false)
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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
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
    FiHeart,      // Life Insurance
    FiPieChart,   // Retirement Planning
    FiTrendingUp, // Wealth Accumulation
    FiBookOpen,   // College Savings
    FiUmbrella,   // Income Protection
    FiGift        // Legacy Transfer
  ]
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5F7FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3AA0FF]"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
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
                <stop offset="0%" stopColor="#3AA0FF" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#26B4A3" stopOpacity="0.4"/>
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
      
      {/* What We Do Section */}
      <section 
        ref={whatWeDoRef}
        className="py-20 bg-white"
      >
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
                <p className="text-gray-600">
                  {content.what_we_do?.card1_description || 'Comprehensive financial strategies tailored to your unique goals and circumstances.'}
                </p>
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
                <p className="text-gray-600">
                  {content.what_we_do?.card2_description || 'Safeguard your family\'s future with our expert protection solutions.'}
                </p>
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
                <p className="text-gray-600">
                  {content.what_we_do?.card3_description || 'Join our team and build a rewarding career helping others achieve financial independence.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Services Section */}
      <section 
        ref={servicesRef}
        className="py-20 bg-[#F5F7FA]"
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">
              {content.services?.title || 'Our Services'}
            </h2>
            <div className="h-1 w-24 bg-[#3AA0FF] mx-auto"></div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* Generate service cards dynamically */}
            {Array.from({ length: 6 }).map((_, index) => {
              const num = index + 1
              const title = content.services?.[`service${num}_title`] || `Service ${num}`
              const description = content.services?.[`service${num}_description`] || 'Service description'
              const Icon = serviceIcons[index]
              
              return (
                <motion.div 
                  key={`service-${index}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                  variants={fadeIn}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-[#3AA0FF]/10 mr-4">
                      <SafeIcon icon={Icon} className="w-6 h-6 text-[#3AA0FF]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2E2E2E]">{title}</h3>
                  </div>
                  <p className="text-gray-600">{description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
      
      {/* Join the Team Section */}
      <section 
        ref={joinTeamRef}
        className="py-20 bg-gradient-to-r from-[#1C1F2A] to-[#2A3042] text-white"
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={joinTeamInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {content.join_team?.title || 'Join Our Team'}
            </h2>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto">
              {content.join_team?.description || 'Build a rewarding career helping others achieve financial independence while creating your own success story.'}
            </p>
            <div className="h-1 w-24 bg-[#3AA0FF] mx-auto mt-6"></div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            initial="hidden"
            animate={joinTeamInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* Benefit 1 */}
            <motion.div 
              className="text-center"
              variants={fadeIn}
            >
              <div className="bg-[#3AA0FF] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <SafeIcon icon={FiTarget} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {content.join_team?.benefit1_title || 'Unlimited Earning Potential'}
              </h3>
              <p className="text-gray-300">
                {content.join_team?.benefit1_description || 'Compensation that grows with your success and dedication.'}
              </p>
            </motion.div>
            
            {/* Benefit 2 */}
            <motion.div 
              className="text-center"
              variants={fadeIn}
            >
              <div className="bg-[#26B4A3] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <SafeIcon icon={FiBook} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {content.join_team?.benefit2_title || 'Comprehensive Training'}
              </h3>
              <p className="text-gray-300">
                {content.join_team?.benefit2_description || 'World-class education to build your expertise and confidence.'}
              </p>
            </motion.div>
            
            {/* Benefit 3 */}
            <motion.div 
              className="text-center"
              variants={fadeIn}
            >
              <div className="bg-[#3AA0FF] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <SafeIcon icon={FiUsers} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {content.join_team?.benefit3_title || 'Supportive Community'}
              </h3>
              <p className="text-gray-300">
                {content.join_team?.benefit3_description || 'Join a team of professionals committed to your success.'}
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-center"
            initial="hidden"
            animate={joinTeamInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#26B4A3] hover:bg-[#26B4A3]/90 text-white py-3 px-8 rounded-md font-medium shadow-lg inline-flex items-center"
            >
              <span>{content.join_team?.cta || 'Start Your Career'}</span>
              <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
      
      {/* Find a Professional Section */}
      <section 
        ref={findProRef}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial="hidden"
            animate={findProInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">
              {content.find_professional?.title || 'Find a Professional'}
            </h2>
            <p className="text-gray-600 mb-8">
              {content.find_professional?.description || 'Connect with a Prosperity Leaders™ financial professional in your area.'}
            </p>
            
            <form onSubmit={handleFindProfessional} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder={content.find_professional?.placeholder || 'Enter name or location'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow px-4 py-3 rounded-md border border-[#E0E6ED] focus:outline-none focus:ring-2 focus:ring-[#3AA0FF]"
              />
              <button
                type="submit"
                disabled={searchSubmitting || !searchQuery.trim()}
                className="bg-[#3AA0FF] hover:bg-[#3AA0FF]/90 text-white py-3 px-6 rounded-md font-medium shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <SafeIcon icon={FiSearch} className="mr-2 w-5 h-5" />
                    <span>{content.find_professional?.cta || 'Search'}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Us Section */}
      <section 
        ref={contactRef}
        className="py-20 bg-[#F5F7FA]"
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">
              {content.contact?.title || 'Contact Us'}
            </h2>
            <p className="text-gray-600">
              {content.contact?.description || 'Have questions? We\'re here to help. Reach out to our team today.'}
            </p>
            <div className="h-1 w-24 bg-[#3AA0FF] mx-auto mt-6"></div>
          </motion.div>
          
          <motion.div 
            className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8"
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            {contactSuccess ? (
              <div className="text-center py-8">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <SafeIcon icon={FiIcons.FiCheck} className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-[#2E2E2E] mb-3">Message Sent!</h3>
                <p className="text-gray-600 mb-6">Thank you for contacting us. We'll be in touch shortly.</p>
                <button
                  onClick={() => setContactSuccess(false)}
                  className="text-[#3AA0FF] hover:underline font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleContactSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {content.contact?.name_label || 'Full Name'}
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className={`w-full px-4 py-3 rounded-md border ${
                        errors.name ? 'border-red-500' : 'border-[#E0E6ED]'
                      } focus:outline-none focus:ring-2 focus:ring-[#3AA0FF]`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {content.contact?.email_label || 'Email Address'}
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className={`w-full px-4 py-3 rounded-md border ${
                        errors.email ? 'border-red-500' : 'border-[#E0E6ED]'
                      } focus:outline-none focus:ring-2 focus:ring-[#3AA0FF]`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {content.contact?.phone_label || 'Phone Number'}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 rounded-md border border-[#E0E6ED] focus:outline-none focus:ring-2 focus:ring-[#3AA0FF]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                      {content.contact?.interest_label || 'I\'m interested in'}
                    </label>
                    <select
                      id="interest"
                      {...register('interest')}
                      className="w-full px-4 py-3 rounded-md border border-[#E0E6ED] focus:outline-none focus:ring-2 focus:ring-[#3AA0FF]"
                    >
                      <option value="">Select an option</option>
                      <option value="financial-planning">Financial Planning</option>
                      <option value="insurance">Insurance</option>
                      <option value="career">Career Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {content.contact?.message_label || 'Your Message'}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message', { required: 'Message is required' })}
                    className={`w-full px-4 py-3 rounded-md border ${
                      errors.message ? 'border-red-500' : 'border-[#E0E6ED]'
                    } focus:outline-none focus:ring-2 focus:ring-[#3AA0FF] resize-none`}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="bg-[#3AA0FF] hover:bg-[#3AA0FF]/90 text-white py-3 px-8 rounded-md font-medium shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {contactSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <span>{content.contact?.submit_button || 'Send Message'}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Footer Section */}
      <footer className="bg-[#1C1F2A] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Prosperity Leaders™</h3>
              <p className="text-gray-300 mb-4 text-lg italic">
                {content.footer?.tagline || 'Faith. Family. Finance.'}
              </p>
              <p className="text-gray-400 mb-6 max-w-md">
                Our mission is to empower individuals and families to achieve financial independence through personalized strategies and expert guidance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SafeIcon icon={FiIcons.FiFacebook} className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SafeIcon icon={FiIcons.FiTwitter} className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SafeIcon icon={FiIcons.FiInstagram} className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              {content.footer?.copyright || '© 2023 Prosperity Leaders™. All rights reserved.'}
            </p>
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