import React, { useState, useMemo } from 'react';
import { Search, Home, Calendar } from 'lucide-react';
import ApartmentCard from '../components/ApartmentCard';
import { apartments } from '../data/apartments';
import { FilterOptions } from '../types';

const Catalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'fixed' | 'temporary'>('fixed');
  const filteredApartments = useMemo(() => {
    return apartments.filter((apartment) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          apartment.title.toLowerCase().includes(searchLower) ||
          apartment.description.toLowerCase().includes(searchLower) ||
          apartment.location.address.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (apartment.type !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Catálogo de Apartamentos
          </h1>
          <p className="text-lg text-gray-600">
            Encontre o apartamento perfeito para suas necessidades
          </p>
        </div>

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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar apartamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Filter Panel */}
          

          {/* Results */}
          <div className="lg:col-span-1">
            {filteredApartments.length > 0 ? (
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
                <p className="text-gray-500 text-lg">
                  Nenhum apartamento encontrado com os filtros selecionados para {selectedCategory === 'fixed' ? 'Moradia Fixa' : 'Temporada'}.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    
                  }}
                  className="mt-4 text-primary hover:text-primary/80 font-medium"
                >
                  Limpar busca
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;