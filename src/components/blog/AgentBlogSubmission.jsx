import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import BlogPostEditor from './BlogPostEditor'
import { getPostsByAuthor } from '../../lib/blog'

const {
  FiEdit,
  FiPlus,
  FiCalendar,
  FiEye,
  FiClock,
  FiCheck,
  FiX,
  FiSend
} = FiIcons

const AgentBlogSubmission = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState(null)

  useEffect(() => {
    loadMyPosts()
  }, [user])

  const loadMyPosts = async () => {
    try {
      setLoading(true)
      const data = await getPostsByAuthor(user.id, user.id, 'professional')
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: FiEdit },
      submitted: { color: 'bg-blue-100 text-blue-800', icon: FiSend },
      approved: { color: 'bg-green-100 text-green-800', icon: FiCheck },
      published: { color: 'bg-emerald-100 text-emerald-800', icon: FiEye },
      rejected: { color: 'bg-red-100 text-red-800', icon: FiX }
    }

    const config = statusConfig[status] || statusConfig.draft

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <SafeIcon icon={config.icon} className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (showEditor) {
    return (
      <BlogPostEditor
        post={editingPost}
        onSave={() => {
          setShowEditor(false)
          setEditingPost(null)
          loadMyPosts()
        }}
        onCancel={() => {
          setShowEditor(false)
          setEditingPost(null)
        }}
        isAdmin={false}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiEdit} className="w-6 h-6 text-picton-blue" />
            <h2 className="text-xl font-semibold text-polynesian-blue">Submit a Blog</h2>
          </div>
          <Button
            onClick={() => setShowEditor(true)}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Write New Article</span>
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-700">
          <div className="font-medium mb-1 flex items-center">
            <SafeIcon icon={FiIcons.FiInfo} className="mr-2" />
            <span>Article Submission Guidelines</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-blue-600">
            <li>Write high-quality, original content about financial topics</li>
            <li>Articles must be at least 500 words long</li>
            <li>Include relevant tags to help readers find your content</li>
            <li>All submissions are reviewed by our editorial team before publication</li>
            <li>Published articles will include your author bio and link to your profile</li>
          </ul>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiEdit} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-polynesian-blue/70">No articles submitted yet</p>
            <p className="text-sm text-polynesian-blue/50 mt-1">
              Start sharing your expertise by writing your first article
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-polynesian-blue mb-4">My Articles</h3>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg p-6 hover:bg-anti-flash-white/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-polynesian-blue">
                        {post.title}
                      </h4>
                      {getStatusBadge(post.status)}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-polynesian-blue/60 mb-3">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                        <span>
                          {post.published_at
                            ? `Published ${new Date(post.published_at).toLocaleDateString()}`
                            : `Updated ${new Date(post.updated_at).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiClock} className="w-4 h-4" />
                        <span>{post.read_time} min read</span>
                      </div>
                    </div>

                    {post.excerpt && (
                      <p className="text-sm text-polynesian-blue/70 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-picton-blue/10 text-picton-blue text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {post.status === 'rejected' && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">
                          <strong>Feedback:</strong> This article was not approved for publication. 
                          Please review our guidelines and make necessary improvements before resubmitting.
                        </p>
                      </div>
                    )}

                    {post.status === 'approved' && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>Great news!</strong> Your article has been approved and will be published soon.
                        </p>
                      </div>
                    )}

                    {post.status === 'published' && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-sm text-emerald-700">
                          <strong>Published!</strong> Your article is now live and helping others learn about finance.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {(post.status === 'draft' || post.status === 'rejected') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingPost(post)
                          setShowEditor(true)
                        }}
                        className="flex items-center space-x-1"
                      >
                        <SafeIcon icon={FiEdit} className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>
                    )}

                    {post.status === 'published' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        className="flex items-center space-x-1"
                      >
                        <SafeIcon icon={FiEye} className="w-3 h-3" />
                        <span>View</span>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default AgentBlogSubmission
