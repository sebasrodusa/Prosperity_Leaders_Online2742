export const mockUsers = [
  {
    id: 'user_2abc123def456',
    full_name: 'Sebastian Rodriguez',
    username: 'sebasrodusa',
    profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    email: 'sebastian@prosperityleaders.net',
    phone: '+1 (555) 123-4567',
    bio: 'Helping families build generational wealth through strategic financial planning and life insurance solutions.',
    agent_id: 'AG001234',
    international_id: null,
    calendly_link: 'https://calendly.com/sebasrodusa',
    calendar_embed_code: '<div class="calendly-inline-widget" data-url="https://calendly.com/sebasrodusa"></div>',
    social_links: {
      instagram: 'https://instagram.com/sebasrodusa',
      facebook: 'https://facebook.com/sebasrodusa',
      linkedin: 'https://linkedin.com/in/sebasrodusa',
      tiktok: 'https://tiktok.com/@sebasrodusa',
      youtube: 'https://youtube.com/@sebasrodusa'
    },
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'user_3xyz789abc012',
    full_name: 'Maria Elena Gonzalez',
    username: 'mariaelenag',
    profile_photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face',
    email: 'maria@prosperityleaders.net',
    phone: '+1 (555) 987-6543',
    bio: 'Especialista en seguros de vida y planificación financiera para la comunidad latina.',
    agent_id: 'AG005678',
    international_id: 'INT001',
    calendly_link: 'https://calendly.com/mariaelenag',
    calendar_embed_code: null,
    social_links: {
      instagram: 'https://instagram.com/mariaelenag',
      facebook: 'https://facebook.com/mariaelenag',
      linkedin: 'https://linkedin.com/in/mariaelenag',
      tiktok: null,
      youtube: null
    },
    created_at: '2024-01-20T14:15:00Z'
  },
  {
    id: 'user_4mno345pqr678',
    full_name: 'David Chen',
    username: 'davidchen',
    profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    email: 'david@prosperityleaders.net',
    phone: '+1 (555) 456-7890',
    bio: 'Building financial security for young professionals through innovative investment strategies.',
    agent_id: 'AG009012',
    international_id: null,
    calendly_link: null,
    calendar_embed_code: null,
    social_links: {
      instagram: null,
      facebook: null,
      linkedin: 'https://linkedin.com/in/davidchen',
      tiktok: 'https://tiktok.com/@davidchen',
      youtube: 'https://youtube.com/@davidchen'
    },
    created_at: '2024-02-01T09:45:00Z'
  },
  {
    id: 'user_5stu901vwx234',
    full_name: 'Sarah Johnson',
    username: 'sarahjohnson',
    profile_photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    email: 'sarah@prosperityleaders.net',
    phone: '+1 (555) 234-5678',
    bio: 'Empowering women entrepreneurs to achieve financial independence through comprehensive wealth management.',
    agent_id: 'AG003456',
    international_id: null,
    calendly_link: 'https://calendly.com/sarahjohnson',
    calendar_embed_code: '<div class="calendly-inline-widget" data-url="https://calendly.com/sarahjohnson"></div>',
    social_links: {
      instagram: 'https://instagram.com/sarahjohnson',
      facebook: 'https://facebook.com/sarahjohnson',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      tiktok: null,
      youtube: 'https://youtube.com/@sarahjohnson'
    },
    created_at: '2024-02-10T16:20:00Z'
  },
  {
    id: 'user_6def567ghi890',
    full_name: 'Carlos Mendoza',
    username: 'carlosmendoza',
    profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    email: 'carlos@prosperityleaders.net',
    phone: '+1 (555) 345-6789',
    bio: 'International financial consultant specializing in cross-border wealth preservation strategies.',
    agent_id: null,
    international_id: 'INT002',
    calendly_link: 'https://calendly.com/carlosmendoza',
    calendar_embed_code: null,
    social_links: {
      instagram: 'https://instagram.com/carlosmendoza',
      facebook: 'https://facebook.com/carlosmendoza',
      linkedin: 'https://linkedin.com/in/carlosmendoza',
      tiktok: 'https://tiktok.com/@carlosmendoza',
      youtube: null
    },
    created_at: '2024-02-15T11:30:00Z'
  }
]

export const mockPages = [
  {
    id: 'page_1',
    user_id: 'user_2abc123def456',
    template_type: 'standard',
    custom_username: 'sebasrodusa-standard',
    title: 'Sebastian Rodriguez - Financial Advisor',
    created_at: '2024-01-15T10:35:00Z'
  },
  {
    id: 'page_2',
    user_id: 'user_2abc123def456',
    template_type: 'recruiting',
    custom_username: 'sebasrodusa-recruiting',
    title: 'Join My Team - Sebastian Rodriguez',
    created_at: '2024-01-16T14:20:00Z'
  },
  {
    id: 'page_3',
    user_id: 'user_2abc123def456',
    template_type: 'client',
    custom_username: 'sebasrodusa-clients',
    title: 'Client Portal - Sebastian Rodriguez',
    created_at: '2024-01-17T09:15:00Z'
  },
  {
    id: 'page_4',
    user_id: 'user_3xyz789abc012',
    template_type: 'latino_usa',
    custom_username: 'mariaelenag-latino',
    title: 'Maria Elena Gonzalez - Servicios Financieros',
    created_at: '2024-01-20T14:20:00Z'
  },
  {
    id: 'page_5',
    user_id: 'user_3xyz789abc012',
    template_type: 'recruiting',
    custom_username: 'mariaelenag-recruiting',
    title: 'Únete a Mi Equipo - Maria Elena',
    created_at: '2024-01-21T10:30:00Z'
  },
  {
    id: 'page_6',
    user_id: 'user_4mno345pqr678',
    template_type: 'standard',
    custom_username: 'davidchen-standard',
    title: 'David Chen - Investment Specialist',
    created_at: '2024-02-01T09:50:00Z'
  },
  {
    id: 'page_7',
    user_id: 'user_5stu901vwx234',
    template_type: 'standard',
    custom_username: 'sarahjohnson-standard',
    title: 'Sarah Johnson - Wealth Management',
    created_at: '2024-02-10T16:25:00Z'
  },
  {
    id: 'page_8',
    user_id: 'user_5stu901vwx234',
    template_type: 'client',
    custom_username: 'sarahjohnson-portal',
    title: 'Client Resources - Sarah Johnson',
    created_at: '2024-02-11T13:40:00Z'
  },
  {
    id: 'page_9',
    user_id: 'user_6def567ghi890',
    template_type: 'international',
    custom_username: 'carlosmendoza-international',
    title: 'Carlos Mendoza - International Finance',
    created_at: '2024-02-15T11:35:00Z'
  },
  {
    id: 'page_10',
    user_id: 'user_6def567ghi890',
    template_type: 'recruiting',
    custom_username: 'carlosmendoza-team',
    title: 'Global Opportunities - Carlos Mendoza',
    created_at: '2024-02-16T15:20:00Z'
  }
]

// Template configurations with updated brand colors - Removed profile type
export const templateTypes = {
  standard: {
    name: 'Standard Hybrid',
    description: 'Professional profile with services overview',
    color: 'bg-picton-blue'
  },
  recruiting: {
    name: 'Recruiting',
    description: 'Attract new team members and partners',
    color: 'bg-green-500'
  },
  client: {
    name: 'Client Portal',
    description: 'Resources and tools for existing clients',
    color: 'bg-purple-500'
  },
  latino_usa: {
    name: 'Latino USA',
    description: 'Spanish-language focused services',
    color: 'bg-orange-500'
  },
  international: {
    name: 'International',
    description: 'Cross-border financial services',
    color: 'bg-polynesian-blue'
  }
}