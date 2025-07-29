import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { getPostBySlug, getLatestPosts } from '../../lib/blog'

const {
  FiCalendar,
  FiUser,
  FiClock,
  FiArrowLeft,
  FiShare2,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiLink
} = FiIcons

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [latestPosts, setLatestPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPost()
    loadLatestPosts()
  }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)
      const data = await getPostBySlug(slug)
      setPost(data)
    } catch (error) {
      console.error('Error loading post:', error)
      setError('Post not found')
    } finally {
      setLoading(false)
    }
  }

  const loadLatestPosts = async () => {
    try {
      const data = await getLatestPosts(5)
      setLatestPosts(data)
    } catch (error) {
      console.error('Error loading latest posts:', error)
    }
  }

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(post.title)
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      copy: () => {
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    }

    if (platform === 'copy') {
      shareUrls.copy()
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-anti-flash-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-anti-flash-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-polynesian-blue mb-4">Post Not Found</h1>
          <p className="text-polynesian-blue/70 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button className="flex items-center space-x-2">
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
              <span>Back to Blog</span>
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const authorProfileUrl = post.author_username ? `/${post.author_username}` : '/about'

  return (
    <div className="min-h-screen bg-anti-flash-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center text-picton-blue hover:text-picton-blue/80 mb-8">
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <article>
          {/* Featured Image */}
          {post.featured_image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          )}

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-polynesian-blue mb-4">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-polynesian-blue/60 mb-6">
              <Link
                to={authorProfileUrl}
                className="flex items-center space-x-2 hover:text-picton-blue transition-colors"
              >
                <SafeIcon icon={FiUser} className="w-4 h-4" />
                <span>{post.author_name}</span>
                {post.author_type === 'admin' && (
                  <span className="px-2 py-1 bg-picton-blue/10 text-picton-blue text-xs rounded-full">
                    Staff
                  </span>
                )}
              </Link>
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiClock} className="w-4 h-4" />
                <span>{post.read_time} min read</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-picton-blue/10 text-picton-blue text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-polynesian-blue/60 mr-2">Share:</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('facebook')}
                className="flex items-center space-x-1"
              >
                <SafeIcon icon={FiFacebook} className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('twitter')}
                className="flex items-center space-x-1"
              >
                <SafeIcon icon={FiTwitter} className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('linkedin')}
                className="flex items-center space-x-1"
              >
                <SafeIcon icon={FiLinkedin} className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('copy')}
                className="flex items-center space-x-1"
              >
                <SafeIcon icon={FiLink} className="w-4 h-4" />
              </Button>
            </div>
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none mb-12"
          >
            <div
              className="text-polynesian-blue/80 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: post.content.replace(/\n/g, '<br />')
              }}
            />
          </motion.div>

          {/* Author Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-picton-blue/10 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="w-8 h-8 text-picton-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-polynesian-blue">
                    About {post.author_name}
                  </h3>
                  <p className="text-polynesian-blue/70 text-sm">
                    {post.author_type === 'admin' 
                      ? 'Member of the Prosperity Online editorial team'
                      : 'Financial Professional at Prosperity Online'
                    }
                  </p>
                  <Link
                    to={authorProfileUrl}
                    className="text-picton-blue hover:text-picton-blue/80 text-sm font-medium"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </article>

        {/* Related Posts */}
        {latestPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-polynesian-blue mb-6">Latest Articles</h3>
              <div className="space-y-4">
                {latestPosts
                  .filter(p => p.id !== post.id)
                  .slice(0, 4)
                  .map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="block p-4 rounded-lg hover:bg-anti-flash-white transition-colors"
                    >
                      <h4 className="font-medium text-polynesian-blue mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <div className="flex items-center text-sm text-polynesian-blue/60">
                        <span>{relatedPost.author_name}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(relatedPost.published_at).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </Card>
          </motion.section>
        )}
      </div>
    </div>
  )
}

export default BlogPost
