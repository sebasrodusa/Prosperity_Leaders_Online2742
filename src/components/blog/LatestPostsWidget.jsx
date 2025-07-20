import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { getLatestPosts } from '../../lib/blog'

const { FiEdit, FiArrowRight, FiCalendar } = FiIcons

const LatestPostsWidget = ({ limit = 3, showHeader = true }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLatestPosts()
  }, [limit])

  const loadLatestPosts = async () => {
    try {
      const data = await getLatestPosts(limit)
      setPosts(data)
    } catch (error) {
      console.error('Error loading latest posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <Card className="p-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiEdit} className="w-5 h-5 text-picton-blue" />
            <h3 className="text-lg font-semibold text-polynesian-blue">Latest Articles</h3>
          </div>
          <Link
            to="/blog"
            className="text-picton-blue hover:text-picton-blue/80 text-sm font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="block p-4 rounded-lg hover:bg-anti-flash-white transition-colors"
            >
              <h4 className="font-medium text-polynesian-blue mb-2 line-clamp-2 leading-snug">
                {post.title}
              </h4>
              <div className="flex items-center text-sm text-polynesian-blue/60">
                <span>{post.author_name}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

export default LatestPostsWidget
