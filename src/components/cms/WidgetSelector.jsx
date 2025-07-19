import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { WIDGET_LIBRARY, WIDGET_CATEGORIES } from '../../lib/widgets/types'

const WidgetSelector = ({ onSelect, onClose }) => {
  const groupedWidgets = Object.values(WIDGET_LIBRARY).reduce((acc, widget) => {
    if (!acc[widget.category]) {
      acc[widget.category] = []
    }
    acc[widget.category].push(widget)
    return acc
  }, {})

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-polynesian-blue mb-6">
        Add Widget
      </h3>

      {Object.entries(groupedWidgets).map(([category, widgets]) => (
        <div key={category} className="mb-8">
          <h4 className="text-sm font-medium text-polynesian-blue/70 uppercase tracking-wider mb-4">
            {category.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {widgets.map(widget => (
              <motion.button
                key={widget.id}
                onClick={() => {
                  onSelect(widget.id)
                  onClose()
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-picton-blue bg-white text-left transition-colors"
              >
                <div className="p-2 rounded-lg bg-picton-blue/10 mr-4">
                  <SafeIcon
                    icon={FiIcons[widget.icon]}
                    className="w-6 h-6 text-picton-blue"
                  />
                </div>
                
                <div>
                  <h5 className="font-medium text-polynesian-blue mb-1">
                    {widget.name}
                  </h5>
                  <p className="text-sm text-polynesian-blue/70">
                    {widget.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default WidgetSelector