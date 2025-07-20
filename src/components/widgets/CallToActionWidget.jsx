import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const CallToActionWidget = ({ config }) => {
  const {
    title,
    subtitle,
    backgroundColor,
    backgroundImage,
    padding,
    containerWidth,
    animation,
    buttonText,
    buttonUrl,
    buttonVariant,
    icon
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
        <div className="text-center">
          {title && (
            <h2 className="text-3xl font-bold text-polynesian-blue mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-polynesian-blue/70 max-w-2xl mx-auto mb-8">
              {subtitle}
            </p>
          )}
          
          <Link to={buttonUrl}>
            <Button
              variant={buttonVariant}
              size="lg"
              className="inline-flex items-center space-x-2"
            >
              {icon && <SafeIcon icon={FiIcons[icon]} className="w-5 h-5" />}
              <span>{buttonText}</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export default CallToActionWidget
