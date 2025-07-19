// Update the imports at the top - remove date-fns import
import React from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { RESOURCE_TYPES } from '../../lib/resources'

// Add the formatRelativeTime function
const formatRelativeTime = (date) => {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now - then) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  if (years > 0) return `${years}y ago`
  if (months > 0) return `${months}mo ago`
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

// Rest of the component remains the same, just update date formatting calls
// Replace:
// {formatDistanceToNow(new Date(resource.created_at))} ago
// with:
// {formatRelativeTime(resource.created_at)}