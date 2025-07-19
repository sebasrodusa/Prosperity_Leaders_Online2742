import React from 'react'
import { motion } from 'framer-motion'
import SectionFeaturedProfessionals from '../sections/SectionFeaturedProfessionals'

const FeaturedProfessionalsWidget = ({ config }) => {
  const {
    title,
    subtitle,
    backgroundColor,
    backgroundImage,
    padding,
    containerWidth,
    animation,
    limit,
    showRatings,
    showBooking
  } = config

  return (
    <section 
      className={`${padding} ${backgroundColor}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <motion.div 
        className={`${containerWidth} mx-auto px-6`}
        initial={animation.initial}
        animate={animation.animate}
        transition={animation.transition}
      >
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold text-polynesian-blue mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-polynesian-blue/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        <SectionFeaturedProfessionals 
          limit={limit}
          showRatings={showRatings}
          showBooking={showBooking}
        />
      </motion.div>
    </section>
  )
}

export default FeaturedProfessionalsWidget