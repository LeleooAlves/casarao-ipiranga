import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Apartment } from '../types';

interface ApartmentCardProps {
  apartment: Apartment;
  onApartmentClick?: (apartmentId: string) => void;
}

interface ImagePreviewProps {
  apartment: Apartment;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ apartment }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combina imagens e vídeo
  const mediaItems = [
    ...apartment.images.map((img, index) => ({ type: 'image', src: img, index })),
    ...(apartment.video ? [{ type: 'video', src: apartment.video, index: apartment.images.length }] : [])
  ];

  // Para apartamentos alugados, mostrar apenas uma amostra das imagens (20% ou no mínimo 2)
  // Se só tem 1 item, mostrar ele diretamente
  const previewItems = apartment.available 
    ? mediaItems.slice(0, 1) // Disponível: apenas primeira imagem
    : mediaItems.length === 1 
      ? mediaItems // Se só tem 1 item, mostrar ele
      : mediaItems.slice(0, Math.max(2, Math.ceil(mediaItems.length * 0.2))); // Alugado: 20% das imagens

  // Auto-play para apartamentos alugados
  useEffect(() => {
    if (!apartment.available && previewItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % previewItems.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [apartment.available, previewItems.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % previewItems.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + previewItems.length) % previewItems.length);
  };

  if (!previewItems.length) {
    return (
      <div className="relative">
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
        <StatusBadges apartment={apartment} />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Imagem/Vídeo Principal */}
      <div className="w-full h-48 overflow-hidden">
        {previewItems[currentImageIndex]?.type === 'video' ? (
          // Se é o único item OU apartamento disponível, mostrar vídeo reproduzível
          mediaItems.length === 1 || apartment.available ? (
            <div className="relative w-full h-48 bg-black overflow-hidden">
              <video
                controls
                className="absolute inset-0 w-full h-full object-contain"
                poster={apartment.images[0]}
                preload="metadata"
              >
                <source src={previewItems[currentImageIndex]?.src} type="video/mp4" />
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>
          ) : (
            // Múltiplos itens em apartamento alugado - mostrar thumbnail com play
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <img
                src={apartment.images[0] || '/placeholder-apartment.jpg'}
                alt={apartment.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 rounded-full p-3">
                  <Play className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          )
        ) : (
          <img
            src={previewItems[currentImageIndex]?.src}
            alt={apartment.title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        )}
      </div>

      {/* Controles de navegação para apartamentos alugados (só se tiver múltiplos itens) */}
      {!apartment.available && previewItems.length > 1 && mediaItems.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {previewItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Contador de imagens (só se tiver mais itens para mostrar) */}
          {mediaItems.length > previewItems.length && mediaItems.length > 1 && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              +{mediaItems.length - previewItems.length} fotos
            </div>
          )}
        </>
      )}

      <StatusBadges apartment={apartment} />
    </div>
  );
};

interface StatusBadgesProps {
  apartment: Apartment;
}

const StatusBadges: React.FC<StatusBadgesProps> = ({ apartment }) => (
  <>
    {/* Badge de Status */}
    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-medium ${
      apartment.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {apartment.available ? 'Disponível' : 'Alugado'}
    </div>
    
    {/* Badge de Tipo */}
    <div className={`absolute ${apartment.available ? 'top-2 left-2' : 'bottom-2 right-2'} px-2 py-1 rounded text-sm font-medium ${
      apartment.type === 'experience' 
        ? 'bg-yellow-500 text-white' 
        : 'bg-primary text-white'
    }`}>
      {apartment.type === 'fixed' ? 'Fixa' : 
       apartment.type === 'temporary' ? 'Temporada' : 
       apartment.type === 'experience' ? 'Experiência' : 'Ambos'}
    </div>
  </>
);

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onApartmentClick }) => {

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
      !apartment.available ? 'opacity-75' : ''
    }`}>
      {/* Seção de imagem - sempre aparece */}
      <ImagePreview apartment={apartment} />
      
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