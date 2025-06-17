import React from 'react';
import { Filter } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}) => {
  const handleTypeChange = (type: FilterOptions['type']) => {
    onFiltersChange({ ...filters, type });
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-primary" />
          <span className="font-medium">Filtros</span>
        </div>
        <span className="text-gray-400">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 space-y-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Locação
            </label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'Todos' },
                { value: 'fixed', label: 'Moradia Fixa' },
                { value: 'temporary', label: 'Temporada' },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    checked={filters.type === option.value}
                    onChange={(e) => handleTypeChange(e.target.value as FilterOptions['type'])}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faixa de Preço (Mensal)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Máx"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho Mínimo (m²)
            </label>
            <input
              type="number"
              value={filters.minSize}
              onChange={(e) => onFiltersChange({ ...filters, minSize: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quartos
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => onFiltersChange({ ...filters, bedrooms: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value={0}>Qualquer</option>
              <option value={1}>1+ quarto</option>
              <option value={2}>2+ quartos</option>
              <option value={3}>3+ quartos</option>
              <option value={4}>4+ quartos</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;