import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { createPost, updatePost, getCategories } from '../../lib/blog'

const {
  FiSave,
  FiSend,
  FiArrowLeft,
  FiImage,
  FiTag,
  FiEye,
  FiEdit
} = FiIcons

const BlogPostEditor = ({ post = null, onSave, onCancel, isAdmin = false }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    tags: [],
    status: 'draft'
  })
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [categories, setCategories] = useState([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        featured_image_url: post.featured_image_url || '',
        tags: post.tags || [],
        status: post.status || 'draft'
      })
    }
    loadCategories()
  }, [post])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }))
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = async (status = null) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required')
      return
    }

    setSaving(true)
    try {
      const saveData = {
        ...formData,
        status: status || formData.status,
        author_name: user.full_name,
        author_username: user.username,
        author_type: user.role === 'admin' ? 'admin' : 'professional'
      }

      if (post) {
        await updatePost(post.id, saveData, user.id, user.role || 'professional')
      } else {
        await createPost(saveData, user.id, user.role || 'professional')
      }

      onSave()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const renderPreview = () => {
    return (
      <div className="prose prose-lg max-w-none">
        {formData.featured_image_url && (
          <img
            src={formData.featured_image_url}
            alt={formData.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-3xl font-bold text-polynesian-blue mb-4">
          {formData.title || 'Untitled Post'}
        </h1>
        <div className="flex items-center space-x-4 text-sm text-polynesian-blue/60 mb-6">
          <span>By {user.full_name}</span>
          <span>•</span>
          <span>{new Date().toLocaleDateString()}</span>
          <span>•</span>
          <span>{Math.max(1, Math.ceil(formData.content.split(' ').length / 200))} min read</span>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-picton-blue/10 text-picton-blue text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{
            __html: formData.content.replace(/\n/g, '<br />')
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <h2 className="text-xl font-semibold text-polynesian-blue">
              {post ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={previewMode ? FiEdit : FiEye} className="w-4 h-4" />
              <span>{previewMode ? 'Edit' : 'Preview'}</span>
            </Button>

            {!isAdmin && (
              <Button
                onClick={() => handleSave('submitted')}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiSend} className="w-4 h-4" />
                <span>{saving ? 'Submitting...' : 'Submit for Review'}</span>
              </Button>
            )}

            <Button
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </Button>

            {isAdmin && (
              <Button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4" />
                <span>{saving ? 'Publishing...' : 'Publish Now'}</span>
              </Button>
            )}
          </div>
        </div>

        {previewMode ? (
          renderPreview()
        ) : (
          <form className="space-y-6">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter your blog post title..."
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Featured Image URL"
                value={formData.featured_image_url}
                onChange={(e) => handleChange('featured_image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
                prefix={<SafeIcon icon={FiImage} className="text-gray-400" />}
              />

              {isAdmin && (
                <div>
                  <label className="block text-sm font-medium text-polynesian-blue mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
                  >
                    <option value="draft">Draft</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              )}
            </div>

            <Textarea
              label="Excerpt (Optional)"
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Brief description of your post (will be auto-generated if left empty)..."
              rows={3}
            />

            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Write your blog post content here..."
              rows={20}
              required
            />

            <div>
              <label className="block text-sm font-medium text-polynesian-blue mb-2">
                Tags
              </label>
              <div className="space-y-3">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleAddTag}
                  placeholder="Type a tag and press Enter..."
                  prefix={<SafeIcon icon={FiTag} className="text-gray-400" />}
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-picton-blue/10 text-picton-blue text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-picton-blue/70 hover:text-picton-blue"
                        >
                          <SafeIcon icon={FiIcons.FiX} className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-polynesian-blue mb-2">
                  Suggested Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        if (!formData.tags.includes(category.name)) {
                          setFormData(prev => ({
                            ...prev,
                            tags: [...prev.tags, category.name]
                          }))
                        }
                      }}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-picton-blue/5 hover:border-picton-blue transition-colors"
                      style={{ borderColor: category.color }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </Card>
    </div>
  )
}

export default BlogPostEditor
