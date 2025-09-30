import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import { Apartment } from '../types';

interface ApartmentCardProps {
  apartment: Apartment;
  onApartmentClick?: (apartmentId: string) => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onApartmentClick }) => {

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
      !apartment.available ? 'opacity-75' : ''
    }`}>
      {/* Seção de imagem - só aparece se apartamento estiver disponível */}
      {apartment.available && (
        <div className="relative">
          {apartment.images && apartment.images.length > 0 ? (
            <img
              src={apartment.images[0]}
              alt={apartment.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 mb-2 text-4xl">
                  {apartment.type === 'experience' ? '⭐' : '🏠'}
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  Sem imagem
                </p>
              </div>
            </div>
          )}
          
          {/* Badge de Status */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded text-sm font-medium bg-green-500 text-white">
            Disponível
          </div>
          
          {/* Badge de Tipo */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-medium ${
            apartment.type === 'experience' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-primary text-white'
          }`}>
            {apartment.type === 'fixed' ? 'Fixa' : 
             apartment.type === 'temporary' ? 'Temporada' : 
             apartment.type === 'experience' ? 'Experiência' : 'Ambos'}
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{apartment.title}</h3>
          {!apartment.available && (
            <div className="flex gap-2">
              <div className="px-2 py-1 rounded text-xs font-medium bg-red-500 text-white">
                Alugado
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                apartment.type === 'experience' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-primary text-white'
              }`}>
                {apartment.type === 'fixed' ? 'Fixa' : 
                 apartment.type === 'temporary' ? 'Temporada' : 
                 apartment.type === 'experience' ? 'Experiência' : 'Ambos'}
              </div>
            </div>
          )}
        </div>
        
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
              Valores a consultar
            </div>
          </div>
        </div>
        
        {apartment.available ? (
          <Link
            to={`/catalog/apartment/${apartment.slug}`}
            onClick={() => onApartmentClick?.(apartment.id)}
            className="block w-full bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium"
          >
            Ver Detalhes
          </Link>
        ) : (
          <div className="space-y-2">
            <div className="w-full bg-gray-400 text-white text-center py-2 rounded-md font-medium cursor-not-allowed">
              Apartamento Alugado
            </div>
            <Link
              to={`/catalog/apartment/${apartment.slug}`}
              onClick={() => onApartmentClick?.(apartment.id)}
              className="block w-full bg-orange-500 text-white text-center py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 font-medium text-sm"
            >
              Demonstrar Interesse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApartmentCard;