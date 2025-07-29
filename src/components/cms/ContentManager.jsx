import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Select from 'react-select'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import ReviewsManagement from '../reviews/ReviewsManagement'
import { getSupabaseClient } from '@/lib/supabase.js'

const { FiSave, FiRefreshCw, FiEye, FiEdit2, FiInfo } = FiIcons

const ContentManager = () => {
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [editHistory, setEditHistory] = useState([])
  const [activeTab, setActiveTab] = useState('content') // 'content' or 'reviews'

  // Load sections and content
  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const supabase = await getSupabaseClient()
      const { data, error } = await supabase
        .from('site_content_po')
        .select('*')
        .order('section', { ascending: true })

      if (error) throw error

      // Group content by section
      const groupedContent = data.reduce((acc, item) => {
        if (!acc[item.section]) {
          acc[item.section] = {}
        }
        acc[item.section][item.key] = item.value
        return acc
      }, {})

      // Get unique sections
      const uniqueSections = [...new Set(data.map(item => item.section))]
      const sectionOptions = uniqueSections.map(section => ({
        value: section,
        label: section.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      }))

      setSections(sectionOptions)
      setContent(groupedContent)

      if (sectionOptions.length > 0 && !selectedSection) {
        setSelectedSection(sectionOptions[0])
      }
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContentChange = (section, key, value) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save current state to edit history
      setEditHistory(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          section: selectedSection.value,
          content: content[selectedSection.value]
        }
      ])

      // Prepare updates
      const updates = []
      const sectionContent = content[selectedSection.value]

      for (const [key, value] of Object.entries(sectionContent)) {
        updates.push({
          section: selectedSection.value,
          key,
          value,
          updated_at: new Date().toISOString()
        })
      }
      const supabase = await getSupabaseClient()
      const { error } = await supabase
        .from('site_content_po')
        .upsert(updates, { onConflict: ['section', 'key'] })

      if (error) throw error

      alert('Content saved successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Error saving content. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddContentItem = async () => {
    if (!selectedSection) return;
    const key = prompt("Enter content key (e.g., 'subtitle', 'image_url'):");
    if (!key) return;

    try {
      // Add to local state
      handleContentChange(selectedSection.value, key, '');

      // Add to database
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('site_content_po')
        .insert({ section: selectedSection.value, key, value: '' });

      if (error && error.code === '23505') {
        alert('This content key already exists in this section.');
      } else if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error adding content item:', error);
      alert('Error adding content item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  const renderPreview = (value) => {
    if (!value) return <em className="text-gray-400">No content</em>;

    // Simple markdown-like rendering for preview
    const formattedValue = value
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');

    return (
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: formattedValue }}
      />
    );
  };

  const renderContentEditor = () => {
    const sectionContent = content[selectedSection?.value] || {}
    return (
      <div className="space-y-6">
        {Object.entries(sectionContent).map(([key, value]) => (
          <div key={key} className="space-y-2 border-b border-gray-100 pb-6">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-polynesian-blue">
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </label>
              {previewMode && (
                <span className="text-xs text-gray-400">
                  Content Key: {key}
                </span>
              )}
            </div>
            {previewMode ? (
              <div className="bg-white p-3 border border-gray-200 rounded-md min-h-[40px]">
                {renderPreview(value)}
              </div>
            ) : (
              <>
                {key.includes('description') || key.includes('body') || key.includes('disclaimer') ? (
                  <Textarea
                    value={value || ''}
                    onChange={(e) => handleContentChange(selectedSection.value, key, e.target.value)}
                    placeholder={`Enter ${key}`}
                    rows={5}
                  />
                ) : (
                  <Input
                    value={value || ''}
                    onChange={(e) => handleContentChange(selectedSection.value, key, e.target.value)}
                    placeholder={`Enter ${key}`}
                  />
                )}
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <SafeIcon icon={FiInfo} className="w-3 h-3 mr-1" />
                  <span>
                    {key.includes('description') || key.includes('body') || key.includes('disclaimer')
                      ? 'Use *italic* or **bold** for formatting'
                      : 'Plain text field'}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-polynesian-blue">
            Content Management
          </h2>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={previewMode ? FiEdit2 : FiEye} className="w-4 h-4" />
              <span>{previewMode ? 'Edit Mode' : 'Preview Mode'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadContent}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-picton-blue text-picton-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Website Content
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-picton-blue text-picton-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews Management
            </button>
          </nav>
        </div>

        {activeTab === 'content' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sections Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-polynesian-blue">
                  Select Section
                </label>
                <Select
                  value={selectedSection}
                  onChange={setSelectedSection}
                  options={sections}
                  className="text-sm"
                  classNamePrefix="select"
                  isSearchable={false}
                />
                {selectedSection && (
                  <div className="space-y-2">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <SafeIcon icon={FiSave} className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleAddContentItem}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                      <span>Add Content Field</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Edit History */}
              {editHistory.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-polynesian-blue mb-2">
                    Recent Changes
                  </h3>
                  <div className="space-y-2">
                    {editHistory.slice(-5).reverse().map((edit, index) => (
                      <div key={index} className="text-xs text-polynesian-blue/70">
                        <p className="font-medium">{edit.section}</p>
                        <p className="text-polynesian-blue/50">
                          {new Date(edit.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div className="lg:col-span-3">
              {selectedSection ? (
                <>
                  <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                    <div className="font-medium mb-1 flex items-center">
                      <SafeIcon icon={FiIcons.FiInfo} className="mr-2" />
                      <span>Editing {selectedSection.label} Section</span>
                    </div>
                    <p>Changes will be visible on the website after saving.</p>
                  </div>
                  {renderContentEditor()}
                </>
              ) : (
                <div className="text-center text-polynesian-blue/70">
                  Select a section to edit its content
                </div>
              )}
            </div>
          </div>
        ) : (
          <ReviewsManagement />
        )}
      </Card>
    </div>
  )
}

export default ContentManager
