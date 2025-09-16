import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing (for deployment fallback)
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using localStorage fallback mode.');
  
  // Create a mock supabase client that will cause hooks to fallback to localStorage
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      upsert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        remove: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export type Database = {
  public: {
    Tables: {
      apartments: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          price_monthly: number;
          price_daily: number;
          images: string[];
          video: string | null;
          amenities: string[];
          size: number;
          bedrooms: number;
          bathrooms: number;
          type: 'fixed' | 'temporary' | 'both';
          available: boolean;
          location_lat: number;
          location_lng: number;
          location_address: string;
          nearby_attractions: Array<{
            name: string;
            distance: string;
            type: string;
          }>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          price_monthly: number;
          price_daily: number;
          images: string[];
          video?: string | null;
          amenities: string[];
          size: number;
          bedrooms: number;
          bathrooms: number;
          type: 'fixed' | 'temporary' | 'both';
          available?: boolean;
          location_lat: number;
          location_lng: number;
          location_address: string;
          nearby_attractions: Array<{
            name: string;
            distance: string;
            type: string;
          }>;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          price_monthly?: number;
          price_daily?: number;
          images?: string[];
          video?: string | null;
          amenities?: string[];
          size?: number;
          bedrooms?: number;
          bathrooms?: number;
          type?: 'fixed' | 'temporary' | 'both';
          available?: boolean;
          location_lat?: number;
          location_lng?: number;
          location_address?: string;
          nearby_attractions?: Array<{
            name: string;
            distance: string;
            type: string;
          }>;
        };
      };
    };
  };
};
