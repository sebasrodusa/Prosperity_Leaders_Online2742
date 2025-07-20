import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiChevronDown, FiChevronUp } = FiIcons

const FaqAccordionWidget = ({ config }) => {
  const {
    title,
    subtitle,
    backgroundColor,
    backgroundImage,
    padding,
    containerWidth,
    animation,
    items,
    expandedByDefault
  } = config

  const [expandedItems, setExpandedItems] = useState(
    expandedByDefault ? items.map((_, i) => i) : []
  )

  const toggleItem = (index) => {
    setExpandedItems(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

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

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {items.map((item, index) => (
            <div key={index} className="py-4">
              <button
                onClick={() => toggleItem(index)}
                className="flex justify-between items-center w-full text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-polynesian-blue">
                  {item.question}
                </span>
                <SafeIcon
                  icon={expandedItems.includes(index) ? FiChevronUp : FiChevronDown}
                  className="w-5 h-5 text-picton-blue"
                />
              </button>
              
              <AnimatePresence initial={false}>
                {expandedItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 text-polynesian-blue/70">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default FaqAccordionWidget
