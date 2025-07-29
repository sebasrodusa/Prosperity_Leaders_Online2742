import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiArrowRight } = FiIcons

const SectionAbout = ({ content }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  // Render formatted content
  const renderFormattedContent = (text) => {
    if (!text) return null
    
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />')
    
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />
  }

  return (
    <section ref={ref} className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeIn}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Image Column */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-picton-blue/5 rounded-full z-0"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary-cta/5 rounded-full z-0"></div>
            
            <img
              src={content.image_url || "https://media.publit.io/file/ProsperityWebApp/SebasJenny.jpg"}
              alt="About Prosperity Online"
              className="rounded-lg shadow-xl w-full h-auto object-cover z-10 relative"
            />
          </div>
          
          {/* Content Column */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-polynesian-blue mb-6">
              {content.title || 'About Us'}
            </h2>
            
            <div className="h-1 w-24 bg-picton-blue mb-8"></div>
            
            <div className="text-polynesian-blue/80 prose prose-lg mb-8">
              {renderFormattedContent(content.body || 'Prosperity Online is a platform dedicated to helping individuals and families achieve financial independence through personalized strategies and expert guidance. Our network of professionals is committed to empowering clients with the knowledge and tools needed to build lasting wealth and security.')}
            </div>
            
            {content.cta_url && (
              <Link to={content.cta_url}>
                <button className="inline-flex items-center text-picton-blue hover:text-picton-blue/80 font-medium transition-colors">
                  <span>{content.cta_text || 'Learn more about our mission'}</span>
                  <SafeIcon icon={FiArrowRight} className="ml-2 w-4 h-4" />
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SectionAbout
