import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import { getSiteContent, updateSiteContent } from '../../lib/supabase'

const { 
  FiSave, 
  FiRefreshCw, 
  FiEye, 
  FiEdit2,
  FiInfo,
  FiToggleLeft,
  FiToggleRight,
  FiPlus,
  FiGripVertical,
  FiHome,
  FiLayout
} = FiIcons

const HomepageEditor = () => {
  const [content, setContent] = useState({})
  const [visibleSections, setVisibleSections] = useState({})
  const [sectionOrder, setSectionOrder] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [draggedItem, setDraggedItem] = useState(null)

  // Default sections configuration
  const defaultSections = {
    hero: { title: 'Hero Banner', visible: true, order: 0 },
    about: { title: 'About Us', visible: true, order: 1 },
    how_it_works: { title: 'How It Works', visible: true, order: 2 },
    services: { title: 'Services', visible: true, order: 3 },
    featured_professionals: { title: 'Featured Professionals', visible: true, order: 4 },
    testimonials: { title: 'Testimonials', visible: true, order: 5 },
    blog: { title: 'Blog Highlights', visible: true, order: 6 }
  }

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setLoading(true)
      const siteContent = await getSiteContent()
      setContent(siteContent)
      
      // Set visible sections based on CMS configuration
      if (siteContent.homepage_sections) {
        setVisibleSections(siteContent.homepage_sections)
        
        // Generate section order from the configuration
        const orderedSections = Object.entries(siteContent.homepage_sections)
          .filter(([_, config]) => config.visible !== false)
          .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
          .map(([key]) => key)
          
        setSectionOrder(orderedSections)
      } else {
        // Use default configuration
        setVisibleSections(
          Object.entries(defaultSections).reduce((acc, [key, config]) => {
            acc[key] = { visible: config.visible, order: config.order }
            return acc
          }, {})
        )
        
        // Default order
        setSectionOrder(
          Object.entries(defaultSections)
            .sort((a, b) => a[1].order - b[1].order)
            .map(([key]) => key)
        )
      }
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionVisibilityToggle = (section) => {
    setVisibleSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        visible: !prev[section]?.visible
      }
    }))
  }

  const handleContentChange = (section, key, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  // Drag and drop handlers
  const handleDragStart = (e, section, index) => {
    setDraggedItem({ section, index })
    // For better drag visual feedback
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', section)
    }
  }
  
  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedItem && draggedItem.index !== index) {
      // Reorder sections
      const items = Array.from(sectionOrder)
      const [reorderedItem] = items.splice(draggedItem.index, 1)
      items.splice(index, 0, reorderedItem)
      
      // Update order values
      const updatedVisibleSections = { ...visibleSections }
      items.forEach((section, idx) => {
        updatedVisibleSections[section] = {
          ...updatedVisibleSections[section],
          order: idx
        }
      })
      
      setSectionOrder(items)
      setVisibleSections(updatedVisibleSections)
      setDraggedItem({ section: draggedItem.section, index })
    }
  }
  
  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Update the homepage sections configuration
      await updateSiteContent('homepage_sections', visibleSections)
      
      // Update content for each section
      for (const [section, sectionContent] of Object.entries(content)) {
        if (section !== 'homepage_sections') {
          await updateSiteContent(section, sectionContent)
        }
      }
      
      alert('Homepage content saved successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Error saving content. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const renderSectionEditor = () => {
    switch (activeSection) {
      case 'hero':
        return (
          <div className="space-y-6">
            <Input 
              label="Hero Headline" 
              value={content.hero?.headline || ''} 
              onChange={(e) => handleContentChange('hero', 'headline', e.target.value)} 
            />
            <Textarea 
              label="Hero Subheadline" 
              value={content.hero?.subheadline || ''} 
              onChange={(e) => handleContentChange('hero', 'subheadline', e.target.value)} 
              rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Primary Button Text" 
                value={content.hero?.cta_primary || ''} 
                onChange={(e) => handleContentChange('hero', 'cta_primary', e.target.value)} 
                placeholder="Find a Professional"
              />
              <Input 
                label="Secondary Button Text" 
                value={content.hero?.cta_secondary || ''} 
                onChange={(e) => handleContentChange('hero', 'cta_secondary', e.target.value)} 
                placeholder="Join the Team"
              />
            </div>
          </div>
        )
      case 'about':
        return (
          <div className="space-y-6">
            <Input 
              label="Section Title" 
              value={content.about?.title || ''} 
              onChange={(e) => handleContentChange('about', 'title', e.target.value)} 
              placeholder="About Us"
            />
            <Textarea 
              label="Section Content" 
              value={content.about?.body || ''} 
              onChange={(e) => handleContentChange('about', 'body', e.target.value)} 
              rows={6}
              placeholder="Use **bold** and *italic* formatting if needed."
            />
            <Input 
              label="Image URL" 
              value={content.about?.image_url || ''} 
              onChange={(e) => handleContentChange('about', 'image_url', e.target.value)} 
              placeholder="https://example.com/image.jpg"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="CTA Button Text" 
                value={content.about?.cta_text || ''} 
                onChange={(e) => handleContentChange('about', 'cta_text', e.target.value)} 
                placeholder="Learn more about our mission"
              />
              <Input 
                label="CTA Button URL" 
                value={content.about?.cta_url || ''} 
                onChange={(e) => handleContentChange('about', 'cta_url', e.target.value)} 
                placeholder="/about"
              />
            </div>
          </div>
        )
      case 'how_it_works':
        return (
          <div className="space-y-6">
            <Input 
              label="Section Title" 
              value={content.how_it_works?.title || ''} 
              onChange={(e) => handleContentChange('how_it_works', 'title', e.target.value)} 
              placeholder="How It Works"
            />
            <Input 
              label="Section Subtitle" 
              value={content.how_it_works?.subtitle || ''} 
              onChange={(e) => handleContentChange('how_it_works', 'subtitle', e.target.value)} 
              placeholder="Our simple process helps you connect with the right financial professional"
            />
            
            <div className="border-t border-gray-200 pt-4 pb-2">
              <h3 className="text-lg font-medium text-polynesian-blue mb-4">Process Steps</h3>
              <p className="text-sm text-polynesian-blue/70 mb-4">
                Add up to 4 steps that explain how your service works.
              </p>
              
              {/* Steps editor - would need custom JSON editor for complex nested objects */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                <p className="text-sm">
                  Steps editing is not yet implemented in this interface. Please edit the steps directly in the database.
                </p>
              </div>
            </div>
          </div>
        )
      case 'services':
        return (
          <div className="space-y-6">
            <Input 
              label="Section Title" 
              value={content.services?.title || ''} 
              onChange={(e) => handleContentChange('services', 'title', e.target.value)} 
              placeholder="Our Services"
            />
            <Input 
              label="Section Subtitle" 
              value={content.services?.subtitle || ''} 
              onChange={(e) => handleContentChange('services', 'subtitle', e.target.value)} 
              placeholder="Comprehensive financial solutions to help you achieve prosperity"
            />
            
            <div className="border-t border-gray-200 pt-4 pb-2">
              <h3 className="text-lg font-medium text-polynesian-blue mb-4">Services</h3>
              <p className="text-sm text-polynesian-blue/70 mb-4">
                Add up to 6 services that you offer.
              </p>
              
              {/* Services editor - would need custom JSON editor for complex nested objects */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                <p className="text-sm">
                  Services editing is not yet implemented in this interface. Please edit the services directly in the database.
                </p>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="py-8 text-center text-polynesian-blue/70">
            Select a section to edit its content
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiHome} className="w-6 h-6 text-picton-blue" />
          <h2 className="text-xl font-semibold text-polynesian-blue">Homepage Editor</h2>
        </div>
        
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
          
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <SafeIcon icon={FiSave} className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sections Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-anti-flash-white rounded-lg p-4">
            <h3 className="text-lg font-medium text-polynesian-blue mb-4 flex items-center">
              <SafeIcon icon={FiLayout} className="w-5 h-5 mr-2 text-picton-blue" />
              Page Sections
            </h3>
            
            <p className="text-sm text-polynesian-blue/70 mb-4">
              Drag to reorder sections or toggle visibility. Click on a section to edit its content.
            </p>
            
            <div className="space-y-2">
              {sectionOrder.map((section, index) => {
                const sectionConfig = defaultSections[section] || { title: section }
                const isVisible = visibleSections[section]?.visible !== false
                const isActive = activeSection === section
                const isDragging = draggedItem && draggedItem.section === section
                
                return (
                  <div
                    key={section}
                    draggable
                    onDragStart={(e) => handleDragStart(e, section, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isActive
                        ? 'bg-picton-blue/10 border-picton-blue'
                        : 'bg-white border-gray-200 hover:bg-anti-flash-white/50'
                    } ${isDragging ? 'opacity-50' : ''} transition-colors cursor-pointer`}
                    onClick={() => setActiveSection(section)}
                  >
                    <div className="flex items-center">
                      <div
                        className="mr-3 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                      >
                        <SafeIcon icon={FiGripVertical} className="w-5 h-5" />
                      </div>
                      <span className={isActive ? 'font-medium text-picton-blue' : 'text-polynesian-blue'}>
                        {sectionConfig.title}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSectionVisibilityToggle(section)
                      }}
                      className="focus:outline-none"
                    >
                      <SafeIcon
                        icon={isVisible ? FiToggleRight : FiToggleLeft}
                        className={`w-10 h-6 ${
                          isVisible ? 'text-picton-blue' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-medium text-polynesian-blue mb-4">
              {defaultSections[activeSection]?.title || 'Section'} Content
            </h3>
            
            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
              <div className="font-medium mb-1 flex items-center">
                <SafeIcon icon={FiInfo} className="mr-2" />
                <span>Content Guidelines</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-blue-600">
                <li>Use **bold** and *italic* for text formatting</li>
                <li>All changes will be visible on the homepage after saving</li>
                <li>Image URLs must be publicly accessible</li>
                <li>Keep content concise and engaging for best results</li>
              </ul>
            </div>
            
            {renderSectionEditor()}
          </Card>
        </div>
      </div>
    </Card>
  )
}

export default HomepageEditor
