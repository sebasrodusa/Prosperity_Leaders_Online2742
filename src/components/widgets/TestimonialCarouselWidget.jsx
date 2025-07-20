import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { getApprovedTestimonials } from '../../lib/reviews'

const { FiChevronLeft, FiChevronRight, FiStar } = FiIcons

const TestimonialCarouselWidget = ({ config }) => {
  const {
    title,
    subtitle,
    backgroundColor,
    backgroundImage,
    padding,
    containerWidth,
    animation,
    autoPlay,
    interval,
    showRatings,
    limit = 5
  } = config

  const [testimonials, setTestimonials] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Load testimonials from Supabase
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await getApprovedTestimonials(limit)
        setTestimonials(data)
      } catch (error) {
        console.error('Error loading testimonials:', error)
      }
    }

    loadTestimonials()
  }, [limit])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
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

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {testimonials[currentIndex] && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center px-8"
              >
                {showRatings && (
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <SafeIcon
                        key={i}
                        icon={FiStar}
                        className={`w-5 h-5 ${
                          i < testimonials[currentIndex].rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                <p className="text-xl italic text-polynesian-blue mb-6">
                  "{testimonials[currentIndex].text}"
                </p>
                
                <p className="font-semibold text-polynesian-blue">
                  {testimonials[currentIndex].author}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
              >
                <SafeIcon icon={FiChevronLeft} className="w-6 h-6 text-polynesian-blue" />
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
              >
                <SafeIcon icon={FiChevronRight} className="w-6 h-6 text-polynesian-blue" />
              </button>
            </>
          )}
        </div>

        {/* Dots navigation */}
        {testimonials.length > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-picton-blue'
                    : 'bg-gray-300 hover:bg-picton-blue/50'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}

export default TestimonialCarouselWidget
