import React, { useState, useMemo } from 'react';
import { Home, Calendar, Star } from 'lucide-react';
import ApartmentCard from '../components/ApartmentCard';
import { useApartments } from '../hooks/useApartments';
import { useApartmentStats } from '../hooks/useApartmentStats';

const Catalog: React.FC = () => {
  const { apartments, isLoading } = useApartments();
  const { incrementViews } = useApartmentStats();
  const [selectedCategory, setSelectedCategory] = useState<'fixed' | 'temporary' | 'experience'>('fixed');
  
  const filteredApartments = useMemo(() => {
    return apartments.filter((apartment) => {
      // Category filter
      if (selectedCategory === 'experience') {
        return apartment.type === 'experience';
      } else {
        return apartment.type === selectedCategory || apartment.type === 'both';
      }
    });
  }, [apartments, selectedCategory]);

  const handleApartmentClick = (apartmentId: string) => {
    incrementViews(apartmentId);
  };

  return (
    <div 
      className="min-h-screen py-8 pt-64 relative"
      style={{
        backgroundImage: 'url(/background/Catalogo.png)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'auto 100%',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay Div */}
      <div className="absolute inset-0 bg-[#e6e5df] opacity-85 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md relative overflow-hidden">
            {/* Indicador deslizante */}
            <div
              className="absolute top-0 left-0 h-full bg-primary/10 rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: '33.333%',
                transform: `translateX(${
                  selectedCategory === 'fixed' ? '0%' : 
                  selectedCategory === 'temporary' ? '100%' : '200%'
                })`,
                zIndex: 1
              }}
            />
            <div className="flex space-x-1 relative z-10">
              <button
                onClick={() => setSelectedCategory('fixed')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 relative ${
                  selectedCategory === 'fixed'
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
                style={{ zIndex: 2 }}
              >
                <Home className="h-4 w-4" />
                <span>Moradia Fixa</span>
              </button>
              <button
                onClick={() => setSelectedCategory('temporary')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 relative ${
                  selectedCategory === 'temporary'
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
                style={{ zIndex: 2 }}
              >
                <Calendar className="h-4 w-4" />
                <span>Temporada</span>
              </button>
              <button
                onClick={() => setSelectedCategory('experience')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 relative ${
                  selectedCategory === 'experience'
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
                style={{ zIndex: 2 }}
              >
                <Star className="h-4 w-4" />
                <span>Experiências</span>
              </button>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Filter Panel */}
          

          {/* Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando apartamentos...</p>
              </div>
            ) : filteredApartments.length > 0 ? (
              <>
                <div className="flex items-center mb-6">
                  {selectedCategory === 'fixed' ? (
                    <Home className="h-6 w-6 text-primary mr-2" />
                  ) : selectedCategory === 'temporary' ? (
                    <Calendar className="h-6 w-6 text-primary mr-2" />
                  ) : (
                    <Star className="h-6 w-6 text-yellow-600 mr-2" />
                  )}
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'fixed' ? 'Moradia Fixa' : 
                     selectedCategory === 'temporary' ? 'Temporada' : 'Experiências Únicas'}
                  </h2>
                  <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === 'experience' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {filteredApartments.length} {selectedCategory === 'experience' ? 'experiência' : 'apartamento'}{filteredApartments.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredApartments.map((apartment) => (
                    <ApartmentCard 
                      key={apartment.id} 
                      apartment={apartment} 
                      onApartmentClick={handleApartmentClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                {selectedCategory === 'experience' ? (
                  <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                ) : (
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                )}
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {apartments.length === 0 ? 
                    `Nenhum${selectedCategory === 'experience' ? 'a experiência' : ' apartamento'} disponível` : 
                    `Nenhum${selectedCategory === 'experience' ? 'a experiência' : ' apartamento'} encontrado`
                  }
                </h3>
                <p className="text-gray-500 text-lg mb-4">
                  {apartments.length === 0 
                    ? `Não há ${selectedCategory === 'experience' ? 'experiências' : 'apartamentos'} cadastrados no momento.`
                    : `Nenhuma ${
                        selectedCategory === 'fixed' ? 'moradia fixa' : 
                        selectedCategory === 'temporary' ? 'moradia temporária' : 
                        'experiência única'
                      } disponível no momento.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;