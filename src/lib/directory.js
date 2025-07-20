import { getSupabaseClient } from '@/lib/supabase.js';

// Get all professionals with pagination and filtering
export const searchProfessionals = async (
  searchQuery = null,
  filters = {},
  page = 1,
  pageSize = 12
) => {
  try {
    const { 
      state,
      languages,
      services,
      hasCalendly
    } = filters;

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .rpc('search_professionals', {
        search_query: searchQuery,
        filter_state: state,
        filter_languages: languages,
        filter_services: services,
        filter_has_calendly: hasCalendly,
        page_number: page,
        page_size: pageSize
      });

    if (error) throw error;

    // Extract pagination info
    const totalCount = data.length > 0 ? data[0].total_count : 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // Return formatted results
    return {
      professionals: data,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error('Error searching professionals:', error);
    return { professionals: [], pagination: { currentPage: 1, totalPages: 1, totalCount: 0, hasNext: false, hasPrev: false } };
  }
};

// Get all available filter options
export const getFilterOptions = async () => {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .rpc('get_directory_filter_options');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return {
      states: [],
      languages: [],
      services: [],
      specialties: []
    };
  }
};

// Get professional by username
export const getProfessionalByUsername = async (username) => {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('users_directory_12345')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching professional profile:', error);
    return null;
  }
};

// Predefined service options for the directory
export const SERVICE_OPTIONS = [
  { value: 'Life Insurance', label: 'Life Insurance' },
  { value: 'Retirement Planning', label: 'Retirement Planning' },
  { value: 'Debt Elimination', label: 'Debt Elimination' },
  { value: 'College Savings', label: 'College Savings' },
  { value: 'Infinite Banking', label: 'Infinite Banking' },
  { value: 'Final Expense', label: 'Final Expense' },
  { value: 'Business Strategies', label: 'Business Strategies' },
  { value: 'International Strategies', label: 'International Strategies' }
];

// Predefined specialty options
export const SPECIALTY_OPTIONS = [
  { value: 'Christian-focused planning', label: 'Christian-focused planning' },
  { value: 'Women-led households', label: 'Women-led households' },
  { value: 'Business Owners', label: 'Business Owners' },
  { value: 'Estate Planning', label: 'Estate Planning' },
  { value: 'Tax Strategies', label: 'Tax Strategies' }
];