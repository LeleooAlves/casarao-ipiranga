import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
