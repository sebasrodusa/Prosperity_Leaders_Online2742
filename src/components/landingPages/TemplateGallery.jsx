import React from 'react'
import { getAllTemplates } from '../../data/landingPageTemplates.js'

const TemplateGallery = ({ selected, onSelect = () => {} }) => {
  const templates = getAllTemplates()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map(template => (
        <div
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`cursor-pointer border rounded-lg overflow-hidden hover:shadow transition-shadow ${selected === template.id ? 'ring-2 ring-picton-blue' : 'border-gray-200'}`}
        >
          {template.defaultContent?.heroImage && (
            <img
              src={template.defaultContent.heroImage}
              alt={template.name}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-medium text-polynesian-blue">{template.name}</h3>
            <p className="text-sm text-polynesian-blue/70 mt-1">{template.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TemplateGallery

