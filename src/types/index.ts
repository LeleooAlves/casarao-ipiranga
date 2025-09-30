export interface Apartment {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: {
    monthly: number;
    daily: number;
  };
  images: string[];
  video?: string;
  amenities: string[];
  size: number;
  bedrooms: number;
  bathrooms: number;
  type: 'fixed' | 'temporary' | 'both' | 'experience';
  available: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
    condominium: 'casarao-museu' | 'casarao-fico';
  };
  nearbyAttractions: {
    name: string;
    distance: string;
    type: string;
  }[];
}


export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FilterOptions {
  type: 'all' | 'fixed' | 'temporary';
  priceRange: [number, number];
  minSize: number;
  bedrooms: number;
}