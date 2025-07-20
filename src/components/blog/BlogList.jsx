import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { getPublishedPosts, getCategories } from '../../lib/blog'

const {
  FiSearch,
  FiCalendar,
  FiUser,
  FiClock,
  FiArrowRight,
  FiTag
} = FiIcons

const BlogList = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  })

  useEffect(() => {
    loadPosts()
    loadCategories()
  }, [pagination.currentPage, selectedTag])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const { posts, pagination: paginationData } = await getPublishedPosts(
        pagination.currentPage,
        9, // Posts per page
        selectedTag
      )
      setPosts(posts)
      setPagination(paginationData)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // In a real implementation, this would trigger a search
    console.log('Searching for:', searchQuery)
  }

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true
    return (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-anti-flash-white">
      {/* Header */}
      <div className="bg-polynesian-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Financial Insights & Expertise
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Expert advice and insights from our team of financial professionals
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-12 py-3 text-lg"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      !selectedTag
                        ? 'bg-picton-blue text-white'
                        : 'bg-white text-polynesian-blue border border-gray-300 hover:bg-picton-blue/5'
                    }`}
                  >
                    All Articles
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedTag(category.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedTag === category.name
                          ? 'text-white'
                          : 'bg-white text-polynesian-blue border border-gray-300 hover:bg-opacity-5'
                      }`}
                      style={{
                        backgroundColor: selectedTag === category.name ? category.color : undefined,
                        borderColor: category.color
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <SafeIcon icon={FiSearch} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-polynesian-blue/70">No articles found</p>
                <p className="text-sm text-polynesian-blue/50 mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/blog/${post.slug}`}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden" hover>
                          {post.featured_image_url && (
                            <img
                              src={post.featured_image_url}
                              alt={post.title}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-6">
                            <div className="flex items-center space-x-2 text-sm text-polynesian-blue/60 mb-3">
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiUser} className="w-4 h-4" />
                                <span>{post.author_name}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                                <span>{new Date(post.published_at).toLocaleDateString()}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiClock} className="w-4 h-4" />
                                <span>{post.read_time} min</span>
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

                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-1 bg-picton-blue/10 text-picton-blue text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{post.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <span className="text-picton-blue font-medium text-sm flex items-center">
                                Read More
                                <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
                              </span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <nav className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                      >
                        Previous
                      </Button>
                      
                      {[...Array(pagination.totalPages)].map((_, index) => (
                        <Button
                          key={index}
                          variant={pagination.currentPage === index + 1 ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories Widget */}
              {categories.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-polynesian-blue mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedTag(category.name)}
                        className="flex items-center justify-between w-full p-2 text-left rounded-lg hover:bg-anti-flash-white transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-polynesian-blue">{category.name}</span>
                        </div>
                        <SafeIcon icon={FiTag} className="w-4 h-4 text-polynesian-blue/50" />
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Recent Posts Widget */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-polynesian-blue mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {posts.slice(0, 5).map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="block hover:bg-anti-flash-white p-2 rounded-lg transition-colors"
                    >
                      <h4 className="font-medium text-polynesian-blue text-sm line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center text-xs text-polynesian-blue/60">
                        <span>{post.author_name}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogList
