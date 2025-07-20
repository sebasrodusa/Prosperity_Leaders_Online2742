import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const {
  FiSearch,
  FiCalendar,
  FiMessageSquare,
  FiCheckCircle
} = FiIcons

const SectionHowItWorks = ({ content }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Default steps if not provided by CMS
  const defaultSteps = [
    {
      title: 'Search',
      description: 'Find a professional that matches your needs and location',
      icon: FiSearch,
      color: 'bg-blue-500'
    },
    {
      title: 'Connect',
      description: 'Schedule a free consultation to discuss your goals',
      icon: FiCalendar,
      color: 'bg-green-500'
    },
    {
      title: 'Plan',
      description: 'Receive a personalized financial strategy',
      icon: FiMessageSquare,
      color: 'bg-purple-500'
    },
    {
      title: 'Succeed',
      description: 'Implement your plan and track your progress',
      icon: FiCheckCircle,
      color: 'bg-orange-500'
    }
  ]

  // Use CMS steps if available, otherwise use defaults
  const steps = content.steps || defaultSteps

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section ref={ref} className="py-24 bg-anti-flash-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-polynesian-blue mb-6">
            {content.title || 'How It Works'}
          </h2>
          <div className="h-1 w-24 bg-picton-blue mx-auto mb-6"></div>
          <p className="text-lg text-polynesian-blue/70 max-w-3xl mx-auto">
            {content.subtitle || 'Our simple process helps you connect with the right financial professional and achieve your goals.'}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => {
            // Map string icon names to actual icons if needed
            let IconComponent = step.icon
            if (typeof step.icon === 'string') {
              IconComponent = FiIcons[step.icon] || FiCheckCircle
            }
            
            return (
              <motion.div
                key={index}
                variants={item}
                className="bg-white rounded-lg shadow-sm p-6 relative"
              >
                <div className={`w-12 h-12 rounded-full ${step.color || 'bg-picton-blue'} flex items-center justify-center text-white mb-6`}>
                  <SafeIcon icon={IconComponent} className="w-6 h-6" />
                </div>
                
                {index < steps.length - 1 && (
                  <div className="absolute top-12 left-full w-full h-0.5 bg-gray-200 hidden lg:block" style={{ width: 'calc(100% - 3rem)', marginLeft: '1.5rem' }}></div>
                )}
                
                <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-picton-blue/10 z-0"></div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-picton-blue/5 z-0"></div>
                
                <h3 className="text-xl font-semibold text-polynesian-blue mb-3">
                  {step.title}
                </h3>
                <p className="text-polynesian-blue/70">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default SectionHowItWorks
