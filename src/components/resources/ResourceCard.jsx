import React from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { RESOURCE_TYPES, getOptimizedImageUrl } from '../../lib/resources'

const { FiEye, FiDownload, FiEdit, FiTrash } = FiIcons

const ResourceCard = ({
  resource,
  viewMode = 'grid',
  onView,
  onDownload,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const type = RESOURCE_TYPES.find(t => t.id === resource.resource_type)

  const thumbnail = resource.thumbnail_url
    ? getOptimizedImageUrl(resource.thumbnail_url, { w: 400 })
    : null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card
        hover
        className={
          viewMode === 'grid'
            ? 'h-full flex flex-col'
            : 'flex items-center'
        }
      >
        {thumbnail && (
          <img
            src={thumbnail}
            alt={resource.title}
            className={
              viewMode === 'grid'
                ? 'rounded-md mb-3'
                : 'rounded-md mr-4 w-24 h-24 object-cover'
            }
          />
        )}
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold">{resource.title}</h3>
          {resource.description && (
            <p className="text-sm text-polynesian-blue/70">
              {resource.description}
            </p>
          )}
          {type && (
            <div className="text-xs text-polynesian-blue/60">{type.name}</div>
          )}
        </div>
        <div
          className={
            viewMode === 'grid'
              ? 'mt-auto space-x-2 flex'
              : 'ml-auto space-x-2 flex'
          }
        >
          {onView && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(resource)}
              icon={<SafeIcon icon={FiEye} className="w-4 h-4" />}
            />
          )}
          {onDownload && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload(resource)}
              icon={<SafeIcon icon={FiDownload} className="w-4 h-4" />}
            />
          )}
          {isAdmin && onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(resource)}
              icon={<SafeIcon icon={FiEdit} className="w-4 h-4" />}
            />
          )}
          {isAdmin && onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(resource)}
              icon={<SafeIcon icon={FiTrash} className="w-4 h-4" />}
            />
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default ResourceCard
