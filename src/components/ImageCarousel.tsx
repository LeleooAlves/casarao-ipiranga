import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  condominium: 'museu' | 'fico';
}

interface CarouselImage {
  src: string;
  description: string;
}

const CasaraoMuseuImages: CarouselImage[] = [
  { src: '/casarao-museu/academia 1.jpg', description: 'Academia' },
  { src: '/casarao-museu/academia 2.jpg', description: 'Academia' },
  { src: '/casarao-museu/área.jpg', description: 'Área de Lazer' },
  { src: '/casarao-museu/fachada.jpg', description: 'Fachada' },
  { src: '/casarao-museu/Admin.jpg', description: 'Administração' },
  { src: '/casarao-museu/bicicletário.jpg', description: 'Bicicletário' },
  { src: '/casarao-museu/Coworking.jpg', description: 'Coworking' },
  { src: '/casarao-museu/Vista área.jpg', description: 'Vista da administração' },
];

const ImageCarousel: React.FC<ImageCarouselProps> = ({ condominium }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = condominium === 'museu' ? CasaraoMuseuImages : [];

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    setCurrentImageIndex(0); // Reset index when condominium changes
  }, [condominium]);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg shadow-xl" style={{ height: '500px' }}>
        <p className="text-gray-500">Nenhuma imagem disponível para este condomínio.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg shadow-xl overflow-hidden">
      <img
        src={images[currentImageIndex].src}
        alt={`Condomínio ${condominium === 'museu' ? 'Museu' : 'Fico'} - ${images[currentImageIndex].description}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 text-center text-lg font-medium">
        {images[currentImageIndex].description}
      </div>
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentImageIndex === index ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel; 