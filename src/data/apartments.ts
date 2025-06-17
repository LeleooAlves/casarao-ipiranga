import { Apartment } from '../types';

export const apartments: Apartment[] = [
  {
    id: '1',
    title: 'Apartamento Premium 3 Quartos',
    description: 'Apartamento espaçoso e moderno com vista panorâmica da cidade. Completamente mobiliado com acabamentos de alto padrão.',
    price: {
      monthly: 4500,
      daily: 200
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560449752-0d8b825b101a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-61dc36f37e6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop'
    ],
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Varanda', 'Mobiliado', 'Academia', 'Piscina'],
    size: 120,
    bedrooms: 3,
    bathrooms: 2,
    type: 'both',
    available: true,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Rua Ipiranga, 344 - Centro, São Paulo - SP'
    },
    nearbyAttractions: [
      { name: 'Museu de Arte de São Paulo', distance: '2.5 km', type: 'Cultura' },
      { name: 'Mercado Municipal', distance: '1.8 km', type: 'Gastronomia' },
      { name: 'Teatro Municipal', distance: '1.2 km', type: 'Entretenimento' }
    ]
  },
  {
    id: '2',
    title: 'Studio Moderno Centro',
    description: 'Studio compacto e funcional, ideal para profissionais e estudantes. Localização privilegiada no centro da cidade.',
    price: {
      monthly: 2200,
      daily: 120
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560449752-8dd236e9c98c?w=800&h=600&fit=crop'
    ],
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Mobiliado', 'Lavanderia'],
    size: 45,
    bedrooms: 1,
    bathrooms: 1,
    type: 'both',
    available: true,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Rua Ipiranga, 344 - Centro, São Paulo - SP'
    },
    nearbyAttractions: [
      { name: 'Estação da Luz', distance: '800m', type: 'Transporte' },
      { name: 'Pinacoteca', distance: '1.0 km', type: 'Cultura' }
    ]
  },
  {
    id: '3',
    title: 'Apartamento Família 4 Quartos',
    description: 'Amplo apartamento ideal para famílias, com quartos espaçosos e área de lazer completa.',
    price: {
      monthly: 6800,
      daily: 280
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560449752-0d8b825b101a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-61dc36f37e6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560449752-8dd236e9c98c?w=800&h=600&fit=crop'
    ],
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Varanda', 'Mobiliado', 'Academia', 'Piscina', 'Playground'],
    size: 180,
    bedrooms: 4,
    bathrooms: 3,
    type: 'fixed',
    available: true,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Rua Ipiranga, 344 - Centro, São Paulo - SP'
    },
    nearbyAttractions: [
      { name: 'Parque da Luz', distance: '1.5 km', type: 'Lazer' },
      { name: 'Shopping Light', distance: '900m', type: 'Compras' }
    ]
  }
];