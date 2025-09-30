import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  condominium: 'museu' | 'fico';
}

interface CarouselImage {
  src: string;
  description: string;
}

const MuseuImages: CarouselImage[] = [
  { src: '/imagens/fachadamuseu.jpg', description: 'Fachada - Casarão Museu' },
  { src: '/imagens/academia 1.jpg', description: 'Academia - Área comum' },
  { src: '/imagens/academia 2.jpg', description: 'Academia - Área comum' },
  { src: '/imagens/area.jpg', description: 'Área de Lazer - Área comum' },
  { src: '/imagens/Admin.jpg', description: 'Administração - Área comum' },
  { src: '/imagens/bicicletario.jpg', description: 'Bicicletário - Área comum' },
  { src: '/imagens/Coworking.jpg', description: 'Coworking - Área comum' },
  { src: '/imagens/vista-area.jpg', description: 'Vista da Administração - Área comum' },
  { src: '/imagens/pegpag.png', description: 'Mercado PEG&PAG - Área comum' },
];

const FicoImages: CarouselImage[] = [
  { src: '/imagens/Fachadafico.jpg', description: 'Fachada - Casarão Fico' },
  { src: '/imagens/recepcaofico.jpg', description: 'Recepção - Casarão Fico' },
  { src: '/imagens/academia 1.jpg', description: 'Academia - Área comum' },
  { src: '/imagens/academia 2.jpg', description: 'Academia - Área comum' },
  { src: '/imagens/area.jpg', description: 'Área de Lazer - Área comum' },
  { src: '/imagens/Admin.jpg', description: 'Administração - Área comum' },
  { src: '/imagens/bicicletario.jpg', description: 'Bicicletário - Área comum' },
  { src: '/imagens/Coworking.jpg', description: 'Coworking - Área comum' },
  { src: '/imagens/vista-area.jpg', description: 'Vista da Administração - Área comum' },
  { src: '/imagens/pegpag.png', description: 'Mercado PEG&PAG - Área comum' },
];

const ImageCarousel: React.FC<ImageCarouselProps> = ({ condominium }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = condominium === 'museu' ? MuseuImages : FicoImages;

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

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-200 rounded-lg">
        <p className="text-gray-500">Nenhuma imagem disponível para este condomínio.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg shadow-xl overflow-hidden">
      <img
        src={images[currentImageIndex].src}
        alt={`Condomínio Casarão Ipiranga - ${images[currentImageIndex].description}`}
        className={`w-full h-full ${
          images[currentImageIndex].description.includes('Mercado PEG&PAG') 
            ? 'object-contain' 
            : 'object-cover'
        }`}
        onError={() => {
          console.error('Erro ao carregar imagem:', images[currentImageIndex].src);
        }}
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
        {images.map((_: CarouselImage, index: number) => (
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
