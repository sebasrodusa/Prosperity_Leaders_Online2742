import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import { getPageById, updatePage } from '../../lib/supabase'
import LandingPageTemplate from './LandingPageTemplate'

const COMPONENTS = {
  header: {
    label: 'Header',
    default: { type: 'header', title: 'New Header', subtitle: '' }
  },
  hero: {
    label: 'Hero Section',
    default: {
      type: 'hero',
      headline: 'Your headline here',
      subheadline: '',
      image: '',
      ctaText: 'Learn More',
      ctaUrl: '#'
    }
  },
  form: {
    label: 'Form',
    default: {
      type: 'form',
      title: 'Contact Us',
      submitText: 'Submit',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true }
      ]
    }
  },
  testimonials: {
    label: 'Testimonials',
    default: {
      type: 'testimonials',
      items: [
        { quote: 'Great service!', author: 'Jane Doe' }
      ]
    }
  }
}

const LandingPageBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blocks, setBlocks] = useState([])
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('edit')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  const saveTimeout = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const page = await getPageById(id)
        let content = []
        try {
          content = page.content ? JSON.parse(page.content).blocks || [] : []
        } catch (err) {
          content = []
        }
        setBlocks(content)
      } catch (err) {
        console.error('Error loading page:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsaved) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [unsaved])

  const save = async (newBlocks) => {
    setSaving(true)
    try {
      await updatePage(id, { content: JSON.stringify({ blocks: newBlocks }) })
      setUnsaved(false)
    } catch (err) {
      console.error('Error saving page:', err)
    } finally {
      setSaving(false)
    }
  }

  const scheduleSave = (newBlocks) => {
    setBlocks(newBlocks)
    setUnsaved(true)
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => save(newBlocks), 1000)
  }

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index)
  }

  const handleDrop = (e, index) => {
    e.preventDefault()
    const from = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (Number.isNaN(from) || from === index) return
    const updated = [...blocks]
    const [moved] = updated.splice(from, 1)
    updated.splice(index, 0, moved)
    scheduleSave(updated)
  }

  const handleDragOver = (e) => e.preventDefault()

  const addBlock = (type) => {
    const block = { ...COMPONENTS[type].default, id: Date.now() }
    const updated = [...blocks, block]
    scheduleSave(updated)
    setSelected(updated.length - 1)
  }

  const removeBlock = (index) => {
    const updated = blocks.filter((_, i) => i !== index)
    scheduleSave(updated)
    if (selected === index) setSelected(null)
  }

  const updateBlock = (index, changes) => {
    const updated = blocks.map((b, i) => (i === index ? { ...b, ...changes } : b))
    scheduleSave(updated)
  }

  const renderFieldsEditor = (block, index) => (
    <div className="space-y-4">
      {block.fields.map((field, fIndex) => (
        <Card key={fIndex} className="p-4 space-y-2">
          <Input
            label="Label"
            value={field.label}
            onChange={(e) => {
              const fields = [...block.fields]
              fields[fIndex] = { ...fields[fIndex], label: e.target.value }
              updateBlock(index, { fields })
            }}
          />
          <Input
            label="Name"
            value={field.name}
            onChange={(e) => {
              const fields = [...block.fields]
              fields[fIndex] = { ...fields[fIndex], name: e.target.value }
              updateBlock(index, { fields })
            }}
          />
          <Input
            label="Type"
            value={field.type}
            onChange={(e) => {
              const fields = [...block.fields]
              fields[fIndex] = { ...fields[fIndex], type: e.target.value }
              updateBlock(index, { fields })
            }}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                const fields = block.fields.filter((_, i) => i !== fIndex)
                updateBlock(index, { fields })
              }}
            >
              Remove Field
            </Button>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          const fields = [...block.fields, { name: '', label: '', type: 'text', required: false }]
          updateBlock(index, { fields })
        }}
      >
        Add Field
      </Button>
    </div>
  )

  const renderTestimonialsEditor = (block, index) => (
    <div className="space-y-4">
      {block.items.map((item, tIndex) => (
        <Card key={tIndex} className="p-4 space-y-2">
          <Textarea
            label="Quote"
            rows={3}
            value={item.quote}
            onChange={(e) => {
              const items = [...block.items]
              items[tIndex] = { ...items[tIndex], quote: e.target.value }
              updateBlock(index, { items })
            }}
          />
          <Input
            label="Author"
            value={item.author}
            onChange={(e) => {
              const items = [...block.items]
              items[tIndex] = { ...items[tIndex], author: e.target.value }
              updateBlock(index, { items })
            }}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                const items = block.items.filter((_, i) => i !== tIndex)
                updateBlock(index, { items })
              }}
            >
              Remove Testimonial
            </Button>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          const items = [...block.items, { quote: '', author: '' }]
          updateBlock(index, { items })
        }}
      >
        Add Testimonial
      </Button>
    </div>
  )

  const renderEditor = (block, index) => {
    switch (block.type) {
      case 'header':
        return (
          <div className="space-y-4">
            <Input
              label="Title"
              value={block.title}
              onChange={(e) => updateBlock(index, { title: e.target.value })}
            />
            <Textarea
              label="Subtitle"
              rows={3}
              value={block.subtitle}
              onChange={(e) => updateBlock(index, { subtitle: e.target.value })}
            />
          </div>
        )
      case 'hero':
        return (
          <div className="space-y-4">
            <Input
              label="Headline"
              value={block.headline}
              onChange={(e) => updateBlock(index, { headline: e.target.value })}
            />
            <Textarea
              label="Subheadline"
              rows={3}
              value={block.subheadline}
              onChange={(e) => updateBlock(index, { subheadline: e.target.value })}
            />
            <Input
              label="Image URL"
              value={block.image}
              onChange={(e) => updateBlock(index, { image: e.target.value })}
            />
            <Input
              label="CTA Text"
              value={block.ctaText}
              onChange={(e) => updateBlock(index, { ctaText: e.target.value })}
            />
            <Input
              label="CTA URL"
              value={block.ctaUrl}
              onChange={(e) => updateBlock(index, { ctaUrl: e.target.value })}
            />
          </div>
        )
      case 'form':
        return (
          <div className="space-y-4">
            <Input
              label="Form Title"
              value={block.title}
              onChange={(e) => updateBlock(index, { title: e.target.value })}
            />
            <Input
              label="Submit Button Text"
              value={block.submitText}
              onChange={(e) => updateBlock(index, { submitText: e.target.value })}
            />
            {renderFieldsEditor(block, index)}
          </div>
        )
      case 'testimonials':
        return renderTestimonialsEditor(block, index)
      default:
        return null
    }
  }

  const handleBack = () => {
    if (!unsaved || window.confirm('You have unsaved changes. Leave anyway?')) {
      navigate('/dashboard/landing-pages')
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-polynesian-blue">Landing Page Builder</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}>
            {mode === 'preview' ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={handleBack}>Back</Button>
        </div>
      </div>
      {mode === 'preview' ? (
        <div className="border rounded-lg overflow-hidden">
          <LandingPageTemplate content={{ blocks }} />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium text-polynesian-blue">Component Palette</h3>
              {Object.entries(COMPONENTS).map(([type, cfg]) => (
                <Button key={type} fullWidth onClick={() => addBlock(type)}>
                  {cfg.label}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-polynesian-blue">Layout</h3>
              <div>
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`border p-2 mb-2 rounded cursor-move ${
                      selected === index ? 'bg-picton-blue/10' : 'bg-white'
                    }`}
                    onClick={() => setSelected(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{COMPONENTS[block.type].label}</span>
                      <button
                        className="text-red-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeBlock(index)
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm text-polynesian-blue/70">
              {saving ? 'Saving...' : unsaved ? 'Unsaved changes' : 'All changes saved'}
            </div>
          </div>
          <div className="flex-1">
            {selected !== null && blocks[selected] ? (
              <Card className="p-4 space-y-4">
                {renderEditor(blocks[selected], selected)}
              </Card>
            ) : (
              <div className="text-polynesian-blue/70">Select a block to edit</div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

export default LandingPageBuilder

