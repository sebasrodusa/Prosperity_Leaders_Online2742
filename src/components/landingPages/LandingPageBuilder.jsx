import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../ui/Card.jsx'
import Input from '../ui/Input.jsx'
import Textarea from '../ui/Textarea.jsx'
import Button from '../ui/Button.jsx'
import { getPageById, updatePage } from '../../lib/supabase.js'
import { getTemplateById } from '../../data/landingPageTemplates.js'

const LandingPageBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [template, setTemplate] = useState(null)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  const saveTimeout = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const page = await getPageById(id)
        const tmpl = getTemplateById(page.template_type)
        setTemplate(tmpl)
        let parsed = {}
        try {
          parsed = page.content ? JSON.parse(page.content) : {}
        } catch {
          parsed = {}
        }
        if (!parsed || Object.keys(parsed).length === 0) {
          parsed = { ...tmpl.defaultContent, themeColor: tmpl.color, layout: 'default' }
        }
        setContent(parsed)
      } catch (err) {
        console.error('Error loading page:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const save = async (newContent) => {
    setSaving(true)
    try {
      await updatePage(id, { content: JSON.stringify(newContent) })
      setUnsaved(false)
    } catch (err) {
      console.error('Error saving page:', err)
    } finally {
      setSaving(false)
    }
  }

  const scheduleSave = (newContent) => {
    setContent(newContent)
    setUnsaved(true)
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => save(newContent), 1000)
  }

  const handleFieldChange = (field, value) => {
    scheduleSave({ ...content, [field]: value })
  }

  const handleFormConfigChange = (field, value) => {
    scheduleSave({
      ...content,
      formConfig: { ...content.formConfig, [field]: value }
    })
  }

  const handleFormFieldChange = (index, key, value) => {
    const fields = [...(content.formConfig?.fields || [])]
    fields[index] = { ...fields[index], [key]: value }
    handleFormConfigChange('fields', fields)
  }

  if (loading || !content) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-polynesian-blue">
          {template?.name} Builder
        </h2>
        <div className="text-sm text-polynesian-blue/70">
          {saving ? 'Saving...' : unsaved ? 'Unsaved changes' : 'All changes saved'}
        </div>
      </div>

      <Input
        label="Headline"
        value={content.headline || ''}
        onChange={(e) => handleFieldChange('headline', e.target.value)}
      />
      <Textarea
        label="Subheadline"
        rows={3}
        value={content.subheadline || ''}
        onChange={(e) => handleFieldChange('subheadline', e.target.value)}
      />
      <Input
        label="Hero Image URL"
        value={content.heroImage || ''}
        onChange={(e) => handleFieldChange('heroImage', e.target.value)}
      />
      <Input
        label="Theme Color"
        value={content.themeColor || ''}
        onChange={(e) => handleFieldChange('themeColor', e.target.value)}
      />
      <Input
        label="Layout"
        value={content.layout || ''}
        onChange={(e) => handleFieldChange('layout', e.target.value)}
      />

      {content.formConfig && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-polynesian-blue">Form</h3>
          <Input
            label="Form Title"
            value={content.formConfig.title || ''}
            onChange={(e) => handleFormConfigChange('title', e.target.value)}
          />
          <Input
            label="Submit Button Text"
            value={content.formConfig.submitButtonText || ''}
            onChange={(e) => handleFormConfigChange('submitButtonText', e.target.value)}
          />
          <div className="space-y-3">
            {content.formConfig.fields?.map((field, idx) => (
              <Card key={idx} className="p-4 space-y-2">
                <Input
                  label="Label"
                  value={field.label}
                  onChange={(e) => handleFormFieldChange(idx, 'label', e.target.value)}
                />
                <Input
                  label="Name"
                  value={field.name}
                  onChange={(e) => handleFormFieldChange(idx, 'name', e.target.value)}
                />
                <Input
                  label="Type"
                  value={field.type}
                  onChange={(e) => handleFormFieldChange(idx, 'type', e.target.value)}
                />
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => navigate('/dashboard/landing-pages')}>
          Back
        </Button>
        <Button onClick={() => save(content)} disabled={saving || !unsaved}>
          Save
        </Button>
      </div>
    </Card>
  )
}

export default LandingPageBuilder

