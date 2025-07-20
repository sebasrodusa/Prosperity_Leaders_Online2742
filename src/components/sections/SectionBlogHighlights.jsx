import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { getLatestPosts } from '../../lib/blog'

const { 
  FiArrowRight, 
  FiCalendar,
  FiUser,
  FiClock
} = FiIcons

const SectionBlogHighlights = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const data = await getLatestPosts(3)
        setPosts(data)
      } catch (error) {
        console.error('Error loading blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    if (inView) {
      loadPosts()
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

  // If no posts are available after loading
  if (!loading && posts.length === 0) {
    return null
  }

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-16"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-polynesian-blue mb-4">
              Latest Financial Insights
            </h2>
            <div className="h-1 w-24 bg-picton-blue mb-4"></div>
            <p className="text-lg text-polynesian-blue/70 max-w-2xl">
              Expert advice and insights from our team of financial professionals.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link to="/blog">
              <Button className="flex items-center space-x-2">
                <span>View All Articles</span>
                <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-sm h-96">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={item}>
                <Link to={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-md transition-all duration-300 overflow-hidden" hover>
                    {post.featured_image_url ? (
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-picton-blue/30 to-secondary-cta/30 flex items-center justify-center">
                        <SafeIcon icon={FiIcons.FiFileText} className="w-12 h-12 text-picton-blue/50" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-sm text-polynesian-blue/60 mb-3">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiUser} className="w-4 h-4" />
                          <span>{post.author_name || 'Prosperity Leaders'}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-polynesian-blue mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-polynesian-blue/70 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-picton-blue font-medium text-sm flex items-center">
                          Read More
                          <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
                        </span>
                        {post.read_time && (
                          <span className="text-xs text-polynesian-blue/50 flex items-center">
                            <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                            {post.read_time} min read
                          </span>
                        )}
                      </div>
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

export default SectionBlogHighlights
