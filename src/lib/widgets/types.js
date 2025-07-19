// Widget Types and Configuration

// Widget Categories for organization in selector
export const WIDGET_CATEGORIES = {
  SEARCH: 'search',
  CONTENT: 'content',
  SOCIAL_PROOF: 'social_proof',
  CONVERSION: 'conversion',
  ENGAGEMENT: 'engagement'
}

// Base configuration for all widgets
export const BASE_WIDGET_CONFIG = {
  // Display settings
  title: '',
  subtitle: '',
  backgroundColor: '',
  backgroundImage: '',
  icon: '',
  emoji: '',
  isVisible: true,
  
  // Layout settings
  padding: 'py-12',
  containerWidth: 'max-w-7xl',
  
  // Animation settings (for Framer Motion)
  animation: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }
}

// Widget definitions with their specific configurations
export const WIDGET_LIBRARY = {
  directorySearch: {
    id: 'directorySearch',
    name: 'Directory Search',
    description: 'Search bar to find professionals',
    category: WIDGET_CATEGORIES.SEARCH,
    icon: 'FiSearch',
    defaultConfig: {
      ...BASE_WIDGET_CONFIG,
      title: 'Find a Professional',
      subtitle: 'Connect with our network of financial experts',
      placeholder: 'Search by name or specialty...',
      variant: 'default'
    }
  },
  
  featuredProfessionals: {
    id: 'featuredProfessionals',
    name: 'Featured Professionals',
    description: 'Showcase top-rated professionals',
    category: WIDGET_CATEGORIES.SOCIAL_PROOF,
    icon: 'FiUsers',
    defaultConfig: {
      ...BASE_WIDGET_CONFIG,
      title: 'Featured Professionals',
      subtitle: 'Meet our top-rated financial experts',
      limit: 4,
      showRatings: true,
      showBooking: true
    }
  },
  
  recentBlogPosts: {
    id: 'recentBlogPosts',
    name: 'Recent Blog Posts',
    description: 'Display latest blog content',
    category: WIDGET_CATEGORIES.CONTENT,
    icon: 'FiFileText',
    defaultConfig: {
      ...BASE_WIDGET_CONFIG,
      title: 'Latest Insights',
      subtitle: 'Financial wisdom from our experts',
      limit: 3,
      showAuthor: true,
      showDate: true
    }
  },
  
  testimonialCarousel: {
    id: 'testimonialCarousel',
    name: 'Testimonial Carousel',
    description: 'Rotating client testimonials',
    category: WIDGET_CATEGORIES.SOCIAL_PROOF,
    icon: 'FiStar',
    defaultConfig: {
      ...BASE_WIDGET_CONFIG,
      title: 'What Our Clients Say',
      subtitle: 'Hear from the people we\'ve helped',
      autoPlay: true,
      interval: 5000,
      showRatings: true,
      limit: 5
    }
  },
  
  callToAction: {
    id: 'callToAction',
    name: 'Call to Action',
    description: 'Conversion-focused CTA section',
    category: WIDGET_CATEGORIES.CONVERSION,
    icon: 'FiZap',
    defaultConfig: {
      ...BASE_WIDGET_CONFIG,
      title: 'Ready to Get Started?',
      subtitle: 'Take the first step toward financial freedom',
      buttonText: 'Start Your Journey',
      buttonUrl: '/get-started',
      buttonVariant: 'primary'
    }
  },
  
  faqAccordion: {
    id: 'faqAccordion',
    name: 'FAQ Accordion',
    description: 'Expandable FAQ section',
    category: WIDGET_CATEGORIES.ENGAGEMENT,
    icon: 'FiHelpCircle',
    defaultConfig: {
      ...BASE_WIDGET_CONFIG,
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions',
      items: [
        {
          question: 'What services do you offer?',
          answer: 'We provide comprehensive financial planning...'
        }
      ],
      expandedByDefault: false
    }
  }
}

// Helper function to get widget configuration
export const getWidgetConfig = (widgetId) => {
  const widget = WIDGET_LIBRARY[widgetId]
  if (!widget) throw new Error(`Widget ${widgetId} not found`)
  return { ...widget.defaultConfig }
}

// Helper function to validate widget configuration
export const validateWidgetConfig = (config, widgetId) => {
  const widget = WIDGET_LIBRARY[widgetId]
  if (!widget) return false
  
  // Add validation logic here based on widget requirements
  return true
}