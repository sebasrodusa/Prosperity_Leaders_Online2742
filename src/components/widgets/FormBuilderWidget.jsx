import React, { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import RichTextEditor from '../ui/RichTextEditor'

const fieldTypes = ['text', 'email', 'textarea']

const FormBuilderWidget = ({ onChange }) => {
  const [description, setDescription] = useState({})
  const [fields, setFields] = useState([])
  const [cta, setCta] = useState({ text: '', url: '', style: 'primary', tracking: '' })
  const [theme, setTheme] = useState({ primary: '#000000', background: '#ffffff' })
  const [output, setOutput] = useState('')

  const handleAddField = () => {
    setFields([...fields, { label: '', type: 'text', required: false }])
  }

  const handleFieldChange = (index, key, value) => {
    const updated = [...fields]
    updated[index][key] = value
    setFields(updated)
  }

  const handleSerialize = () => {
    const definition = { description, fields, cta, theme }
    setOutput(JSON.stringify(definition, null, 2))
    if (onChange) onChange(definition)
  }

  return (
    <Card className="p-4 space-y-6">
      <div className="space-y-2">
        <h4 className="font-medium text-polynesian-blue">Description</h4>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-polynesian-blue">Fields</h4>
        {fields.map((field, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <Input
              value={field.label}
              onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
              placeholder="Field label"
              className="flex-1"
            />
            <select
              value={field.type}
              onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
              className="border rounded p-2"
            >
              {fieldTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
              />
              <span className="text-sm">Required</span>
            </label>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={handleAddField}>Add Field</Button>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-polynesian-blue">Call To Action</h4>
        <Input
          value={cta.text}
          onChange={(e) => setCta({ ...cta, text: e.target.value })}
          placeholder="Button text"
        />
        <Input
          value={cta.url}
          onChange={(e) => setCta({ ...cta, url: e.target.value })}
          placeholder="URL"
        />
        <div className="flex items-center space-x-2">
          <select
            value={cta.style}
            onChange={(e) => setCta({ ...cta, style: e.target.value })}
            className="border rounded p-2"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="link">Link</option>
          </select>
          <Input
            value={cta.tracking}
            onChange={(e) => setCta({ ...cta, tracking: e.target.value })}
            placeholder="Tracking ID"
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-polynesian-blue">Theme</h4>
        <label className="flex items-center space-x-2">
          <span className="w-24 text-sm">Primary</span>
          <input
            type="color"
            value={theme.primary}
            onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
          />
        </label>
        <label className="flex items-center space-x-2">
          <span className="w-24 text-sm">Background</span>
          <input
            type="color"
            value={theme.background}
            onChange={(e) => setTheme({ ...theme, background: e.target.value })}
          />
        </label>
      </div>

      <div className="space-y-2">
        <Button onClick={handleSerialize}>Serialize</Button>
        {output && (
          <pre className="bg-anti-flash-white p-2 rounded text-xs whitespace-pre-wrap">{output}</pre>
        )}
      </div>
    </Card>
  )
}

export default FormBuilderWidget
