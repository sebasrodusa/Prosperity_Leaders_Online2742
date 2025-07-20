import React from 'react'
import { motion } from 'framer-motion'
import DirectorySearch from '../professional-directory/DirectorySearchWidget'

const DirectorySearchWidget = ({ config }) => {
  const {
    title,
    subtitle,
    backgroundColor,
    backgroundImage,
    padding,
    containerWidth,
    animation
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
        
        <DirectorySearch variant="default" />
      </motion.div>
    </section>
  )
}

export default DirectorySearchWidget
