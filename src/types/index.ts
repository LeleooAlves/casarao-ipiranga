export interface Apartment {
  id: string;
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
  type: 'fixed' | 'temporary' | 'both';
  available: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  nearbyAttractions: {
    name: string;
    distance: string;
    type: string;
  }[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  photo?: string;
  apartmentId: string;
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