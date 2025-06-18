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
  },
  {
    id: '4',
    title: 'Apartamento Conforto Ipiranga',
    description: 'Apartamento aconchegante e bem iluminado, perfeito para moradia fixa. Próximo a comércios e transporte público.',
    price: {
      monthly: 3200,
      daily: 150
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507146426996-ef053064005b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218974-bc465d6bd430?w=800&h=600&fit=crop'
    ],
    amenities: ['Wi-Fi', 'Cozinha Equipada', 'Varanda', 'Armários Embutidos'],
    size: 70,
    bedrooms: 2,
    bathrooms: 1,
    type: 'fixed',
    available: true,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Rua Ipiranga, 344 - Centro, São Paulo - SP'
    },
    nearbyAttractions: [
      { name: 'Parque da Independência', distance: '1.0 km', type: 'Lazer' },
      { name: 'Sesc Ipiranga', distance: '0.8 km', type: 'Cultura' }
    ]
  },
  {
    id: '5',
    title: 'Cobertura Moderna com Vista',
    description: 'Luxuosa cobertura com amplos espaços, vista espetacular da cidade e acabamentos de alto padrão. Ideal para moradia fixa.',
    price: {
      monthly: 8500,
      daily: 350
    },
    images: [
      'https://images.unsplash.com/photo-1570191833503-4c9f1e1f1e1c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507146426996-ef053064005b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218974-bc465d6bd430?w=800&h=600&fit=crop'
    ],
    amenities: ['Piscina Privativa', 'Churrasqueira', 'Ar Condicionado Central', 'Mobiliado', 'Academia', 'Segurança 24h'],
    size: 200,
    bedrooms: 3,
    bathrooms: 4,
    type: 'fixed',
    available: true,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Rua Ipiranga, 344 - Centro, São Paulo - SP'
    },
    nearbyAttractions: [
      { name: 'Museu do Ipiranga', distance: '0.5 km', type: 'Cultura' },
      { name: 'Jardim Botânico de São Paulo', distance: '5.0 km', type: 'Lazer' }
    ]
  },
  {
    id: '6',
    title: 'Flat Executivo Temporada',
    description: 'Flat ideal para estadias curtas, com serviços inclusos e localização estratégica para negócios e turismo.',
    price: {
      monthly: 2800,
      daily: 180
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560449752-8dd236e9c98c?w=800&h=600&fit=crop'
    ],
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Serviço de Limpeza', 'Café da Manhã', 'Mobiliado'],
    size: 35,
    bedrooms: 1,
    bathrooms: 1,
    type: 'temporary',
    available: true,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Rua Ipiranga, 344 - Centro, São Paulo - SP'
    },
    nearbyAttractions: [
      { name: 'Avenida Paulista', distance: '3.0 km', type: 'Cultura' },
      { name: 'Parque do Ibirapuera', distance: '4.5 km', type: 'Lazer' }
    ]
  },
  {
    id: '7',
    title: 'Loft Aconchegante para Casal',
    description: 'Loft moderno e charmoso, perfeito para casais em busca de uma estadia romântica e confortável na cidade.',
    price: {
      monthly: 3500,
      daily: 220
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560449752-8dd236e9c98c?w=800&h=600&fit=crop'
    ],
    amenities: ['Cozinha Completa', 'Smart TV', 'Varanda', 'Wi-Fi de Alta Velocidade'],
    size: 50,
    bedrooms: 1,
    bathrooms: 1,
    type: 'temporary',
    available: true,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Rua Ipiranga, 344 - Centro, São Paulo - SP'
    },
    nearbyAttractions: [
      { name: 'Rua Oscar Freire', distance: '6.0 km', type: 'Compras' },
      { name: 'Mercado da Lapa', distance: '7.0 km', type: 'Gastronomia' }
    ]
  },
  {
    id: '8',
    title: 'Casa de Temporada com Piscina',
    description: 'Casa espaçosa com piscina privativa, ideal para famílias grandes ou grupos de amigos que buscam lazer e conforto.',
    price: {
      monthly: 7500,
      daily: 400
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560449752-0d8b825b101a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-61dc36f37e6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop'
    ],
    amenities: ['Piscina', 'Churrasqueira', 'Jardim', 'Cozinha Gourmet', 'Ar Condicionado'],
    size: 250,
    bedrooms: 4,
    bathrooms: 3,
    type: 'temporary',
    available: true,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Rua Ipiranga, 344 - Centro, São Paulo - SP'
    },
    nearbyAttractions: [
      { name: 'Parque da Água Branca', distance: '8.0 km', type: 'Lazer' },
      { name: 'Memorial da América Latina', distance: '9.0 km', type: 'Cultura' }
    ]
  }
];