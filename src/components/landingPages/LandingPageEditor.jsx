import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPageById, updatePage } from '../../lib/supabase'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'

const LandingPageEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  const saveTimeout = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const page = await getPageById(id)
        setForm({ title: page.title || '', content: page.content || '' })
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

  const save = async (updates) => {
    setSaving(true)
    try {
      const updated = await updatePage(id, updates)
      setForm(prev => ({ ...prev, ...updated }))
      setUnsaved(false)
    } catch (err) {
      console.error('Error saving page:', err)
    } finally {
      setSaving(false)
    }
  }

  const scheduleSave = (updates) => {
    setUnsaved(true)
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => save(updates), 1000)
  }

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
    scheduleSave({ [field]: value })
  }

  const handleBack = () => {
    if (!unsaved || window.confirm('You have unsaved changes. Leave anyway?')) {
      navigate('/dashboard/landing-pages')
    }
  }

  const handleManualSave = () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    save(form)
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-polynesian-blue">Edit Landing Page</h2>
        <div className="text-sm text-polynesian-blue/70">
          {saving ? 'Saving...' : unsaved ? 'Unsaved changes' : 'All changes saved'}
        </div>
      </div>
      <Input
        label="Title"
        value={form.title}
        onChange={handleChange('title')}
      />
      <Textarea
        label="Content"
        rows={10}
        value={form.content}
        onChange={handleChange('content')}
      />
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button onClick={handleManualSave} disabled={saving || !unsaved}>Save</Button>
      </div>
    </Card>
  )
}

export default LandingPageEditor
