import PublitioAPI from 'publitio_js_sdk';

// Check for required environment variables
const PUBLIC_KEY = import.meta.env.VITE_PUBLITIO_PUBLIC_KEY;
const SECRET_KEY = import.meta.env.VITE_PUBLITIO_SECRET_KEY;

if (!PUBLIC_KEY || !SECRET_KEY) {
  console.warn('Missing Publit.io credentials in environment variables');
}

// Create and configure the Publit.io SDK instance
const publitio = new PublitioAPI(PUBLIC_KEY, SECRET_KEY);

// Custom error class for Publit.io errors
export class PublitioError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'PublitioError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Upload a file to Publit.io
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload response
 */
export const uploadFile = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    if (options.title) formData.append('title', options.title);
    if (options.description) formData.append('description', options.description);
    if (options.tags) formData.append('tags', options.tags.join(','));
    if (options.folder) formData.append('folder', options.folder);
    if (options.private !== undefined) formData.append('private', options.private);

    const response = await publitio.uploadFile(formData);

    if (response.success) {
      return {
        id: response.id,
        url: response.url_preview,
        downloadUrl: response.url_download,
        thumbnailUrl: response.url_thumbnail,
        previewUrl: response.url_preview,
        fileName: response.filename,
        fileSize: response.size,
        fileType: response.type,
        width: response.width,
        height: response.height,
        duration: response.duration,
        metadata: response.meta
      };
    } else {
      throw new PublitioError('Upload failed', response.status, response);
    }
  } catch (error) {
    if (error instanceof PublitioError) {
      throw error;
    }
    throw new PublitioError('Upload failed', 500, error);
  }
};

/**
 * Delete a file from Publit.io
 * @param {string} fileId - The ID of the file to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteFile = async (fileId) => {
  try {
    const response = await publitio.call(`/files/delete/${fileId}`, 'DELETE');
    return response.success;
  } catch (error) {
    throw new PublitioError('Delete failed', error.status || 500, error);
  }
};

/**
 * Get file information from Publit.io
 * @param {string} fileId - The ID of the file
 * @returns {Promise<Object>} File information
 */
export const getFileInfo = async (fileId) => {
  try {
    const response = await publitio.call(`/files/show/${fileId}`, 'GET');
    if (response.success) {
      return response;
    } else {
      throw new PublitioError('Failed to get file info', response.status, response);
    }
  } catch (error) {
    throw new PublitioError('Failed to get file info', error.status || 500, error);
  }
};

/**
 * Generate an optimized URL for an image with transformations
 * @param {string} fileId - The ID of the file
 * @param {Object} options - Transformation options
 * @returns {string} Transformed image URL
 */
export const getOptimizedUrl = (fileId, options = {}) => {
  if (!fileId) return null;

  try {
    const transformations = [];
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);

    return publitio.getFileURL(fileId, transformations.join('/'));
  } catch (error) {
    console.error('Error generating optimized URL:', error);
    return null;
  }
};

/**
 * List files in a folder
 * @param {Object} options - List options
 * @returns {Promise<Object>} List response
 */
export const listFiles = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    if (options.folder) params.append('folder', options.folder);
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.filter) params.append('filter', options.filter);

    const response = await publitio.call(`/files/list?${params.toString()}`, 'GET');

    if (response.success) {
      return {
        files: response.files,
        count: response.count,
        total: response.total,
        offset: response.offset,
        limit: response.limit
      };
    } else {
      throw new PublitioError('Failed to list files', response.status, response);
    }
  } catch (error) {
    throw new PublitioError('Failed to list files', error.status || 500, error);
  }
};

/**
 * Create a folder in Publit.io
 * @param {string} folderName - Name of the folder to create
 * @param {string} parentFolder - Optional parent folder path
 * @returns {Promise<Object>} Folder creation response
 */
export const createFolder = async (folderName, parentFolder = null) => {
  try {
    const params = new URLSearchParams();
    params.append('name', folderName);
    if (parentFolder) params.append('parent', parentFolder);

    const response = await publitio.call(`/folders/create?${params.toString()}`, 'POST');
    
    if (response.success) {
      return response.folder;
    } else {
      throw new PublitioError('Failed to create folder', response.status, response);
    }
  } catch (error) {
    throw new PublitioError('Failed to create folder', error.status || 500, error);
  }
};

/**
 * Update file metadata
 * @param {string} fileId - The ID of the file to update
 * @param {Object} metadata - Metadata to update
 * @returns {Promise<Object>} Update response
 */
export const updateFileMetadata = async (fileId, metadata = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(metadata).forEach(([key, value]) => {
      params.append(key, value);
    });

    const response = await publitio.call(`/files/update/${fileId}?${params.toString()}`, 'PUT');
    
    if (response.success) {
      return response.file;
    } else {
      throw new PublitioError('Failed to update file metadata', response.status, response);
    }
  } catch (error) {
    throw new PublitioError('Failed to update file metadata', error.status || 500, error);
  }
};

// Simple client side file validation helper
export const validateFile = (file, allowedTypes = [], maxSize = 0) => {
  const errors = [];
  if (allowedTypes.length && !allowedTypes.includes(file.type)) {
    errors.push('Invalid file type');
  }
  if (maxSize && file.size > maxSize) {
    errors.push('File is too large');
  }
  return { isValid: errors.length === 0, errors };
};

export {
  getOptimizedUrl as getOptimizedImageUrl
};

export default publitio;