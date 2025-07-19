import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import BlogPostEditor from './BlogPostEditor'
import {
  getAllPosts,
  approvePost,
  rejectPost,
  publishPost,
  unpublishPost,
  deletePost
} from '../../lib/blog'

const {
  FiEdit,
  FiPlus,
  FiSearch,
  FiFilter,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiCalendar,
  FiUser,
  FiAlertCircle
} = FiIcons

const BlogManager = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [processingAction, setProcessingAction] = useState(false)

  const statusOptions = [
    { value: 'all', label: 'All Posts' },
    { value: 'draft', label: 'Drafts' },
    { value: 'submitted', label: 'Submitted for Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'published', label: 'Published' },
    { value: 'rejected', label: 'Rejected' }
  ]

  useEffect(() => {
    loadPosts()
  }, [statusFilter, user])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await getAllPosts(user.id, user.role || 'admin', statusFilter)
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action, postId) => {
    setProcessingAction(true)
    try {
      switch (action) {
        case 'approve':
          await approvePost(postId, user.id, user.role || 'admin')
          break
        case 'reject':
          await rejectPost(postId, user.id, user.role || 'admin')
          break
        case 'publish':
          await publishPost(postId, user.id, user.role || 'admin')
          break
        case 'unpublish':
          await unpublishPost(postId, user.id, user.role || 'admin')
          break
        case 'delete':
          await deletePost(postId, user.id, user.role || 'admin')
          setShowDeleteModal(false)
          break
      }
      loadPosts()
    } catch (error) {
      console.error(`Error ${action}ing post:`, error)
      alert(`Failed to ${action} post`)
    } finally {
      setProcessingAction(false)
    }
  }

  const confirmDelete = (post) => {
    setSelectedPost(post)
    setShowDeleteModal(true)
  }

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true
    return (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getStatusBadge = (status) => {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}>
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
          loadPosts()
        }}
        onCancel={() => {
          setShowEditor(false)
          setEditingPost(null)
        }}
        isAdmin={true}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiEdit} className="w-6 h-6 text-picton-blue" />
            <h2 className="text-xl font-semibold text-polynesian-blue">Blog Manager</h2>
          </div>
          <Button
            onClick={() => setShowEditor(true)}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>New Blog Post</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-2 md:w-auto w-full">
            <SafeIcon icon={FiFilter} className="text-gray-500 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiEdit} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-polynesian-blue/70">
              {statusFilter !== 'all' ? `No ${statusFilter} posts found` : 'No posts found'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
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
                      <h3 className="text-lg font-medium text-polynesian-blue">
                        {post.title}
                      </h3>
                      {getStatusBadge(post.status)}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-polynesian-blue/60 mb-3">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiUser} className="w-4 h-4" />
                        <span>{post.author_name} ({post.author_type})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                        <span>
                          {post.published_at
                            ? `Published ${new Date(post.published_at).toLocaleDateString()}`
                            : `Updated ${new Date(post.updated_at).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                      <span>{post.read_time} min read</span>
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
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
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

                    {post.status === 'submitted' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAction('approve', post.id)}
                          disabled={processingAction}
                          className="flex items-center space-x-1"
                        >
                          <SafeIcon icon={FiCheck} className="w-3 h-3" />
                          <span>Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('reject', post.id)}
                          disabled={processingAction}
                          className="flex items-center space-x-1"
                        >
                          <SafeIcon icon={FiX} className="w-3 h-3" />
                          <span>Reject</span>
                        </Button>
                      </>
                    )}

                    {post.status === 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => handleAction('publish', post.id)}
                        disabled={processingAction}
                        className="flex items-center space-x-1"
                      >
                        <SafeIcon icon={FiEye} className="w-3 h-3" />
                        <span>Publish</span>
                      </Button>
                    )}

                    {post.status === 'published' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction('unpublish', post.id)}
                        disabled={processingAction}
                        className="flex items-center space-x-1"
                      >
                        <SafeIcon icon={FiEyeOff} className="w-3 h-3" />
                        <span>Unpublish</span>
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => confirmDelete(post)}
                      disabled={processingAction}
                      className="flex items-center space-x-1"
                    >
                      <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Blog Post"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-red-600">
            <SafeIcon icon={FiAlertCircle} className="w-6 h-6" />
            <p className="font-medium">Are you sure you want to delete this blog post?</p>
          </div>

          {selectedPost && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-polynesian-blue mb-2">{selectedPost.title}</h4>
              <p className="text-sm text-polynesian-blue/70">By {selectedPost.author_name}</p>
            </div>
          )}

          <p className="text-polynesian-blue/70">
            This action cannot be undone. The blog post will be permanently removed from the system.
          </p>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleAction('delete', selectedPost?.id)}
              disabled={processingAction}
            >
              {processingAction ? 'Deleting...' : 'Delete Post'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BlogManager