// Import the publitio SDK instance
import publitio, { uploadFile, deleteFile, getFileInfo, getOptimizedUrl } from './publitio';

// Define resource types
export const RESOURCE_TYPES = [
  {
    id: 'pdf',
    name: 'PDF Document',
    icon: 'FiFile',
    description: 'PDF documents and guides'
  },
  {
    id: 'video',
    name: 'Video',
    icon: 'FiVideo',
    description: 'Video training and tutorials'
  },
  {
    id: 'image',
    name: 'Image',
    icon: 'FiImage',
    description: 'Images and graphics'
  },
  {
    id: 'link',
    name: 'External Link',
    icon: 'FiExternalLink',
    description: 'Links to external resources'
  },
  {
    id: 'embed',
    name: 'Embedded Content',
    icon: 'FiCode',
    description: 'Embedded content from other platforms'
  },
  {
    id: 'guide',
    name: 'Text Guide',
    icon: 'FiBookOpen',
    description: 'Text-based guides and articles'
  }
];

// Define resource categories
export const RESOURCE_CATEGORIES = [
  {
    id: 'getting_started',
    name: 'Getting Started',
    icon: 'FiFlag',
    description: 'Resources for new team members'
  },
  {
    id: 'product_knowledge',
    name: 'Product Knowledge',
    icon: 'FiPackage',
    description: 'Information about our products'
  },
  {
    id: 'sales_scripts',
    name: 'Sales Scripts',
    icon: 'FiMessageSquare',
    description: 'Scripts and talking points'
  },
  {
    id: 'marketing_branding',
    name: 'Marketing & Branding',
    icon: 'FiTrendingUp',
    description: 'Marketing materials and brand guidelines'
  },
  {
    id: 'video_trainings',
    name: 'Video Trainings',
    icon: 'FiVideo',
    description: 'Video tutorials and webinars'
  },
  {
    id: 'forms_disclosures',
    name: 'Forms & Disclosures',
    icon: 'FiFileText',
    description: 'Legal forms and disclosures'
  }
];

// Define allowed file types
export const ALLOWED_FILE_TYPES = {
  pdf: ['application/pdf'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// File validation utility
export const validateFile = (file, allowedTypes, maxSize) => {
  const errors = [];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const uploadToPublit = async (file, options = {}) => {
  try {
    // Upload to Publit.io using our SDK wrapper
    const publitData = await uploadFile(file, {
      title: options.title,
      description: options.description,
      tags: options.tags,
      folder: options.folder,
      private: false // Make files public by default
    });

    return publitData;
  } catch (error) {
    console.error('Error uploading to Publit.io:', error);
    throw error;
  }
};

export const deleteFromPublit = async (fileId) => {
  try {
    return await deleteFile(fileId);
  } catch (error) {
    console.error('Error deleting from Publit.io:', error);
    throw error;
  }
};

// Update getPublitFileInfo to use SDK
export const getPublitFileInfo = async (fileId) => {
  try {
    return await getFileInfo(fileId);
  } catch (error) {
    console.error('Error getting Publit.io file info:', error);
    throw error;
  }
};

// Update getOptimizedImageUrl to use SDK
export const getOptimizedImageUrl = (fileId, options = {}) => {
  return getOptimizedUrl(fileId, options);
};

// Function to upload a resource file
export const uploadResourceFile = async (file, resourceData, userId, userRole) => {
  try {
    // Upload file to Publit.io
    const publitData = await uploadToPublit(file, {
      title: resourceData.title,
      description: resourceData.description || '',
      tags: resourceData.tags || [],
      folder: `resources/${resourceData.category}`
    });
    
    // Create resource record in database
    const resource = {
      title: resourceData.title,
      description: resourceData.description || '',
      category: resourceData.category,
      resource_type: resourceData.resource_type,
      language: resourceData.language || 'en',
      publit_id: publitData.id,
      file_url: publitData.url,
      download_url: publitData.downloadUrl,
      thumbnail_url: publitData.thumbnailUrl,
      preview_url: publitData.previewUrl,
      file_name: publitData.fileName,
      file_size: publitData.fileSize,
      file_type: publitData.fileType,
      width: publitData.width,
      height: publitData.height,
      duration: publitData.duration,
      tags: resourceData.tags || [],
      is_pinned: resourceData.is_pinned || false,
      role_restrictions: resourceData.role_restrictions || [],
      publit_metadata: publitData.metadata || {},
      created_by: userId
    };
    
    // In a real implementation, save to database here
    console.log('Resource ready to be saved:', resource);
    
    return resource;
  } catch (error) {
    console.error('Error uploading resource file:', error);
    throw error;
  }
};

// Function to create a resource without a file
export const createResource = async (resourceData, userId, userRole) => {
  try {
    // Create resource record in database
    const resource = {
      title: resourceData.title,
      description: resourceData.description || '',
      category: resourceData.category,
      resource_type: resourceData.resource_type,
      language: resourceData.language || 'en',
      external_url: resourceData.external_url,
      embed_code: resourceData.embed_code,
      content: resourceData.content,
      tags: resourceData.tags || [],
      is_pinned: resourceData.is_pinned || false,
      role_restrictions: resourceData.role_restrictions || [],
      created_by: userId
    };
    
    // In a real implementation, save to database here
    console.log('Resource ready to be saved:', resource);
    
    return resource;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

// Function to track resource access
export const trackResourceAccess = async (resourceId, userId, actionType) => {
  try {
    // In a real implementation, save to database here
    console.log(`Tracking resource access: ${resourceId} by ${userId}, action: ${actionType}`);
    return true;
  } catch (error) {
    console.error('Error tracking resource access:', error);
    return false;
  }
};

// Mock function to get resources (for development)
export const getResources = async (userId, userRole = 'professional', filters = {}) => {
  // Mock data - in a real implementation, fetch from database
  const mockResources = [
    {
      id: 'res_1',
      title: 'Getting Started Guide',
      description: 'A comprehensive guide for new team members',
      category: 'getting_started',
      resource_type: 'pdf',
      language: 'en',
      publit_id: 'abc123',
      file_url: 'https://example.com/guide.pdf',
      download_url: 'https://example.com/guide.pdf?download=true',
      thumbnail_url: 'https://example.com/guide-thumb.jpg',
      file_name: 'getting-started-guide.pdf',
      file_size: 1245000,
      file_type: 'application/pdf',
      tags: ['onboarding', 'new agent'],
      is_pinned: true,
      created_by: 'user_1',
      created_at: '2023-06-15T10:30:00Z'
    },
    {
      id: 'res_2',
      title: 'Training Webinar',
      description: 'Product training webinar recording',
      category: 'video_trainings',
      resource_type: 'video',
      language: 'en',
      publit_id: 'def456',
      file_url: 'https://example.com/webinar.mp4',
      download_url: 'https://example.com/webinar.mp4?download=true',
      thumbnail_url: 'https://example.com/webinar-thumb.jpg',
      file_name: 'product-training-webinar.mp4',
      file_size: 45600000,
      file_type: 'video/mp4',
      duration: 1800, // 30 minutes in seconds
      tags: ['training', 'webinar', 'products'],
      is_pinned: false,
      created_by: 'user_2',
      created_at: '2023-07-20T14:45:00Z'
    },
    {
      id: 'res_3',
      title: 'Client Presentation Template',
      description: 'Customizable presentation for client meetings',
      category: 'sales_scripts',
      resource_type: 'link',
      language: 'en',
      external_url: 'https://docs.google.com/presentation/d/abc123',
      tags: ['presentation', 'client meeting'],
      is_pinned: true,
      created_by: 'user_1',
      created_at: '2023-08-05T09:15:00Z'
    }
  ];
  
  // Filter resources based on filters
  let filteredResources = [...mockResources];
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filteredResources = filteredResources.filter(resource => 
      resource.title.toLowerCase().includes(search) ||
      resource.description.toLowerCase().includes(search) ||
      resource.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }
  
  if (filters.category) {
    filteredResources = filteredResources.filter(resource => 
      resource.category === filters.category
    );
  }
  
  if (filters.type) {
    filteredResources = filteredResources.filter(resource => 
      resource.resource_type === filters.type
    );
  }
  
  if (filters.language) {
    filteredResources = filteredResources.filter(resource => 
      resource.language === filters.language
    );
  }
  
  return filteredResources;
};