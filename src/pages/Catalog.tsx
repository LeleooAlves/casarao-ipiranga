import React, { useState, useMemo } from 'react';
import { Home, Calendar } from 'lucide-react';
import ApartmentCard from '../components/ApartmentCard';
import { useApartments } from '../hooks/useApartments';

const Catalog: React.FC = () => {
  const { apartments, isLoading } = useApartments();
  const [selectedCategory, setSelectedCategory] = useState<'fixed' | 'temporary'>('fixed');
  
  const filteredApartments = useMemo(() => {
    return apartments.filter((apartment) => {
      // Category filter
      if (apartment.type !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [apartments, selectedCategory]);

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
                width: '50%',
                transform: `translateX(${selectedCategory === 'fixed' ? '0%' : '100%'})`,
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
                  ) : (
                    <Calendar className="h-6 w-6 text-primary mr-2" />
                  )}
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'fixed' ? 'Moradia Fixa' : 'Temporada'}
                  </h2>
                  <span className="ml-3 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {filteredApartments.length} apartamento{filteredApartments.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredApartments.map((apartment) => (
                    <ApartmentCard key={apartment.id} apartment={apartment} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {apartments.length === 0 ? 'Nenhum apartamento disponível' : 'Nenhum apartamento encontrado'}
                </h3>
                <p className="text-gray-500 text-lg mb-4">
                  {apartments.length === 0 
                    ? 'Não há apartamentos cadastrados no momento.'
                    : `Nenhuma moradia ${selectedCategory === 'fixed' ? 'fixa' : 'temporária'} disponível no momento.`
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