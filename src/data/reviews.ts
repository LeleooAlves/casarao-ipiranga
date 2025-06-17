import { Review } from '../types';

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Maria Silva',
    rating: 5,
    comment: 'Apartamento excelente! Superou minhas expectativas. Localização perfeita e atendimento impecável.',
    date: '2024-01-15',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b2e7842e?w=150&h=150&fit=crop&crop=face',
    apartmentId: '1'
  },
  {
    id: '2',
    name: 'João Santos',
    rating: 4,
    comment: 'Muito bom para temporada! Apartamento limpo e bem localizado. Recomendo!',
    date: '2024-01-10',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    apartmentId: '2'
  },
  {
    id: '3',
    name: 'Ana Costa',
    rating: 5,
    comment: 'Perfeito para minha família! Espaçoso, confortável e com todas as comodidades que precisávamos.',
    date: '2024-01-08',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    apartmentId: '3'
  }
];