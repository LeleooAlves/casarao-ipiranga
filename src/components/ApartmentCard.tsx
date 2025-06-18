import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Star } from 'lucide-react';
import { Apartment } from '../types';

interface ApartmentCardProps {
  apartment: Apartment;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={apartment.images[0]}
          alt={apartment.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm font-medium">
          {apartment.type === 'fixed' ? 'Fixa' : apartment.type === 'temporary' ? 'Temporada' : 'Ambos'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{apartment.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{apartment.location.address}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-gray-600 mb-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span className="text-sm">{apartment.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span className="text-sm">{apartment.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{apartment.size}m²</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {apartment.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
            >
              {amenity}
            </span>
          ))}
          {apartment.amenities.length > 3 && (
            <span className="text-gray-500 text-xs">
              +{apartment.amenities.length - 3} mais
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-bold text-primary">
              {formatPrice(apartment.price.monthly)}/mês
            </div>
            <div className="text-sm text-gray-600">
              {formatPrice(apartment.price.daily)}/dia
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>
        
        <Link
          to={`/catalog/apartment/${apartment.id}`}
          className="block w-full bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};

export default ApartmentCard;