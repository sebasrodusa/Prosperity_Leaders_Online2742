// Update the getOptimizedImageUrl import
import { getOptimizedImageUrl as getOptimizedUrlFromPublitio } from './publitio'

// Re-export getOptimizedImageUrl
export const getOptimizedImageUrl = getOptimizedUrlFromPublitio

// Placeholder data and helpers until backend endpoints are available
export const RESOURCE_CATEGORIES = []
export const RESOURCE_TYPES = []

export async function getResources() {
  return []
}

export async function uploadResourceFile() {
  return {}
}

export async function createResource() {
  return {}
}

export async function deleteResource() {
  return {}
}

export async function trackResourceAccess() {
  return {}
}