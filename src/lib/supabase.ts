import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing (for deployment fallback)
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using localStorage fallback mode.');
  
  // Create a mock supabase client that will cause hooks to fallback to localStorage
  const mockQuery = {
    select: () => mockQuery,
    insert: () => mockQuery,
    update: () => mockQuery,
    delete: () => mockQuery,
    upsert: () => mockQuery,
    order: () => mockQuery,
    limit: () => mockQuery,
    single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    eq: () => mockQuery,
    then: (resolve: any) => resolve({ data: null, error: new Error('Supabase not configured') })
  };

  supabase = {
    from: () => mockQuery,
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        remove: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    channel: () => ({
      on: () => ({
        on: () => ({
          subscribe: () => ({ unsubscribe: () => {} })
        }),
        subscribe: () => ({ unsubscribe: () => {} })
      }),
      subscribe: () => ({ unsubscribe: () => {} })
    }),
    removeChannel: () => {}
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
          type: 'fixed' | 'temporary' | 'both' | 'experience';
          available: boolean;
          location_lat: number;
          location_lng: number;
          location_address: string;
          condominium: 'casarao-museu' | 'casarao-fico';
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
          type: 'fixed' | 'temporary' | 'both' | 'experience';
          available?: boolean;
          location_lat: number;
          location_lng: number;
          location_address: string;
          condominium: 'casarao-museu' | 'casarao-fico';
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
          condominium?: 'casarao-museu' | 'casarao-fico';
        };
      };
      apartment_stats: {
        Row: {
          id: string;
          apartment_id: string | null;
          views: number | null;
          messages: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          apartment_id?: string | null;
          views?: number | null;
          messages?: number | null;
        };
        Update: {
          id?: string;
          apartment_id?: string | null;
          views?: number | null;
          messages?: number | null;
        };
      };
      user_interests: {
        Row: {
          id: string;
          apartment_id: string;
          user_name: string;
          user_type: 'available' | 'rented';
          apartment_title: string;
          apartment_available: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          apartment_id: string;
          user_name: string;
          user_type: 'available' | 'rented';
          apartment_title: string;
          apartment_available: boolean;
        };
        Update: {
          id?: string;
          apartment_id?: string;
          user_name?: string;
          user_type?: 'available' | 'rented';
          apartment_title?: string;
          apartment_available?: boolean;
        };
      };
    };
  };
};
