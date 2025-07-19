import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { getApprovedTestimonials } from '../../lib/reviews'

const { FiStar, FiChevronLeft, FiChevronRight } = FiIcons

const SectionTestimonials = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true)
        const data = await getApprovedTestimonials()
        setTestimonials(data || [])
      } catch (error) {
        console.error('Error loading testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    if (inView) {
      loadTestimonials()
    }
  }, [inView])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  // If no testimonials are available after loading
  if (!loading && testimonials.length === 0) {
    return null
  }

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-polynesian-blue to-picton-blue text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What Our Clients Say
          </h2>
          <div className="h-1 w-24 bg-white/50 mx-auto"></div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="text-center">
                {/* Quote mark */}
                <div className="text-6xl font-serif text-white/20 leading-none mb-6">"</div>
                
                {/* Rating stars */}
                <div className="flex items-center justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <SafeIcon
                      key={i}
                      icon={FiStar}
                      className={`w-5 h-5 ${
                        i < Math.floor(testimonials[currentIndex].rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Testimonial content */}
                <p className="text-xl md:text-2xl font-light italic mb-8 px-8">
                  {testimonials[currentIndex].review_text}
                </p>
                
                <div className="mb-8">
                  <p className="font-semibold text-lg">
                    {testimonials[currentIndex].reviewer_name}
                  </p>
                  {testimonials[currentIndex].reviewer_title && (
                    <p className="text-white/70">
                      {testimonials[currentIndex].reviewer_title}
                    </p>
                  )}
                </div>
                
                {/* Navigation buttons */}
                {testimonials.length > 1 && (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={prevTestimonial}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Previous testimonial"
                    >
                      <SafeIcon icon={FiChevronLeft} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Next testimonial"
                    >
                      <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Dots indicator */}
            {testimonials.length > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentIndex === index ? 'bg-white' : 'bg-white/30'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default SectionTestimonials