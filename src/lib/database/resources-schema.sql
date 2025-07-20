-- Resources Center Database Schema with Publit.io Integration

-- Main resources table
CREATE TABLE IF NOT EXISTS resources_12345 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'getting_started',
    'product_knowledge', 
    'sales_scripts',
    'marketing_branding',
    'video_trainings',
    'forms_disclosures'
  )),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'video', 'image', 'link', 'embed', 'guide')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es')),
  
  -- Publit.io integration
  publit_id TEXT, -- Publit.io file ID
  file_url TEXT, -- Main file URL
  download_url TEXT, -- Download URL (may be different from view URL)
  thumbnail_url TEXT, -- Thumbnail/preview image
  preview_url TEXT, -- Preview URL for supported formats
  
  -- File information
  file_name TEXT,
  file_size BIGINT,
  file_type TEXT,
  width INTEGER, -- For images/videos
  height INTEGER, -- For images/videos  
  duration REAL, -- For videos (in seconds)
  
  -- External content
  external_url TEXT, -- For external links
  embed_code TEXT, -- For embedded content (YouTube, Vimeo, etc.)
  content TEXT, -- For text guides
  
  -- Metadata
  tags TEXT[],
  is_pinned BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  role_restrictions TEXT[], -- Optional role-based access
  publit_metadata JSONB, -- Store additional Publit.io metadata
  
  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_content CHECK (
    (resource_type IN ('pdf', 'video', 'image') AND publit_id IS NOT NULL) OR
    (resource_type = 'link' AND external_url IS NOT NULL) OR
    (resource_type = 'embed' AND embed_code IS NOT NULL) OR
    (resource_type = 'guide' AND content IS NOT NULL)
  )
);

-- Resource analytics table
CREATE TABLE IF NOT EXISTS resource_analytics_12345 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources_12345(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('view', 'download')),
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE resources_12345 ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_analytics_12345 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resources_12345
CREATE POLICY "Users can view active resources" ON resources_12345 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all resources" ON resources_12345 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- RLS Policies for resource_analytics_12345  
CREATE POLICY "Users can insert their own analytics" ON resource_analytics_12345 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all analytics" ON resource_analytics_12345 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources_12345(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources_12345(resource_type) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_resources_language ON resources_12345(language) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_resources_pinned ON resources_12345(is_pinned, created_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_resources_tags ON resources_12345 USING GIN(tags) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_resources_publit ON resources_12345(publit_id) WHERE publit_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_resource_user ON resource_analytics_12345(resource_id, user_id);

-- Function to get resource analytics
CREATE OR REPLACE FUNCTION get_resource_analytics()
RETURNS TABLE (
  resource_id UUID,
  resource_title TEXT,
  total_views BIGINT,
  total_downloads BIGINT,
  unique_users BIGINT
) LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT 
    r.id as resource_id,
    r.title as resource_title,
    COUNT(CASE WHEN ra.action_type = 'view' THEN 1 END) as total_views,
    COUNT(CASE WHEN ra.action_type = 'download' THEN 1 END) as total_downloads,
    COUNT(DISTINCT ra.user_id) as unique_users
  FROM resources_12345 r
  LEFT JOIN resource_analytics_12345 ra ON r.id = ra.resource_id
  WHERE r.is_active = true
  GROUP BY r.id, r.title
  ORDER BY total_views DESC;
$$;

-- Function to clean up orphaned Publit files (admin use)
CREATE OR REPLACE FUNCTION cleanup_orphaned_publit_files()
RETURNS TABLE (
  publit_id TEXT,
  file_name TEXT
) LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT 
    r.publit_id,
    r.file_name
  FROM resources_12345 r
  WHERE r.publit_id IS NOT NULL 
  AND r.is_active = false
  AND r.updated_at < NOW() - INTERVAL '30 days';
$$;
