import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const {
  FiShield,
  FiDollarSign,
  FiPieChart,
  FiTrendingUp,
  FiBookOpen,
  FiGift,
  FiTarget
} = FiIcons

const SectionServices = ({ content }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Default services if not provided by CMS
  const defaultServices = [
    {
      title: 'Life Insurance',
      description: 'Protect your family\'s financial future with comprehensive coverage options.',
      icon: 'FiShield',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Retirement Planning',
      description: 'Build a secure retirement with personalized strategies for long-term growth.',
      icon: 'FiPieChart',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Wealth Building',
      description: 'Create sustainable wealth through strategic investments and financial planning.',
      icon: 'FiTrendingUp',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'College Planning',
      description: 'Prepare for education expenses with tax-advantaged savings strategies.',
      icon: 'FiBookOpen',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Estate Planning',
      description: 'Ensure your legacy with comprehensive estate planning solutions.',
      icon: 'FiGift',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Goal-Based Planning',
      description: 'Achieve your personal financial goals with targeted strategies.',
      icon: 'FiTarget',
      color: 'from-cyan-500 to-cyan-600'
    }
  ]

  // Use CMS services if available, otherwise use defaults
  const services = content.services || defaultServices

  // Map string icon names to actual icon components
  const getIconComponent = (iconName) => {
    if (typeof iconName === 'string') {
      return FiIcons[iconName] || FiDollarSign
    }
    return iconName || FiDollarSign
  }

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
    <section ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-polynesian-blue mb-6">
            {content.title || 'Our Services'}
          </h2>
          <div className="h-1 w-24 bg-picton-blue mx-auto mb-6"></div>
          <p className="text-lg text-polynesian-blue/70 max-w-3xl mx-auto">
            {content.subtitle || 'Comprehensive financial solutions to help you achieve prosperity and security.'}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = getIconComponent(service.icon)
            
            return (
              <motion.div
                key={index}
                variants={item}
                className="relative group"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full transition-all duration-300 hover:shadow-md group-hover:border-picton-blue/30">
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${service.color || 'from-picton-blue to-secondary-cta'} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <SafeIcon icon={IconComponent} className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-polynesian-blue mb-3">
                    {service.title}
                  </h3>
                  <p className="text-polynesian-blue/70">
                    {service.description}
                  </p>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-picton-blue/5 z-0 group-hover:bg-picton-blue/10 transition-colors duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-picton-blue/5 z-0 group-hover:bg-picton-blue/10 transition-colors duration-300"></div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default SectionServices
