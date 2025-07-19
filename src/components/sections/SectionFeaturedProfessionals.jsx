import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { searchProfessionals } from '../../lib/directory'

const { FiArrowRight, FiStar, FiMapPin, FiCalendar } = FiIcons

const SectionFeaturedProfessionals = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedProfessionals = async () => {
      try {
        setLoading(true)
        // Get top rated professionals
        const { professionals } = await searchProfessionals(
          null,
          { hasCalendly: true },
          1,
          4
        )
        setProfessionals(professionals)
      } catch (error) {
        console.error('Error loading featured professionals:', error)
      } finally {
        setLoading(false)
      }
    }

    if (inView) {
      loadFeaturedProfessionals()
    }
  }, [inView])

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section ref={ref} className="py-24 bg-anti-flash-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-16"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-polynesian-blue mb-4">
              Featured Professionals
            </h2>
            <div className="h-1 w-24 bg-picton-blue mb-4"></div>
            <p className="text-lg text-polynesian-blue/70 max-w-2xl">
              Meet our top-rated financial professionals ready to help you achieve your financial goals.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link to="/find-a-professional">
              <Button className="flex items-center space-x-2">
                <span>View All Professionals</span>
                <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-sm h-72">
                  <div className="h-24 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full -mt-8 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {professionals.map((professional) => (
              <motion.div key={professional.id} variants={item}>
                <Link to={`/${professional.username}`}>
                  <Card className="h-full hover:shadow-md transition-all duration-300" hover>
                    <div className="h-24 bg-gradient-to-r from-polynesian-blue to-picton-blue rounded-t-lg"></div>
                    <div className="px-4 pb-4 relative">
                      <div className="flex justify-center">
                        <img
                          src={professional.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.full_name)}&background=3AA0FF&color=fff`}
                          alt={professional.full_name}
                          className="w-16 h-16 rounded-full border-4 border-white -mt-8 object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-polynesian-blue text-center mt-2">
                        {professional.full_name}
                      </h3>
                      <p className="text-sm text-polynesian-blue/60 text-center mb-4">
                        {professional.title || 'Financial Professional'}
                      </p>
                      
                      {/* Rating */}
                      {professional.average_rating > 0 && (
                        <div className="flex items-center justify-center mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`w-4 h-4 ${
                                  i < Math.floor(professional.average_rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium text-polynesian-blue">
                            {professional.average_rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      
                      {/* Location */}
                      {(professional.city || professional.state) && (
                        <div className="flex items-center justify-center text-xs text-polynesian-blue/70 mb-2">
                          <SafeIcon icon={FiMapPin} className="w-3 h-3 mr-1" />
                          <span>
                            {[professional.city, professional.state].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {/* Calendly Badge */}
                      {professional.has_calendly && (
                        <div className="flex items-center justify-center text-xs text-green-600">
                          <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                          <span>Available for appointments</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default SectionFeaturedProfessionals