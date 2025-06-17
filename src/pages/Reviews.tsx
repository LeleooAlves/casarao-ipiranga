import React, { useState } from 'react';
import { Star, Filter } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';
import { reviews } from '../data/reviews';
import { apartments } from '../data/apartments';

const Reviews: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<string>('all');

  const filteredReviews = reviews.filter(review => {
    if (selectedRating && review.rating !== selectedRating) {
      return false;
    }
    if (selectedApartment !== 'all' && review.apartmentId !== selectedApartment) {
      return false;
    }
    return true;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: (reviews.filter(review => review.rating === rating).length / reviews.length) * 100
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Avaliações dos Hóspedes
          </h1>
          <p className="text-lg text-gray-600">
            Veja o que nossos hóspedes dizem sobre suas experiências
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Avaliação Geral</h3>
              
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-primary mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-5 w-5 ${
                        index < Math.round(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">
                  Baseado em {reviews.length} avaliações
                </p>
              </div>

              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center text-sm">
                    <span className="w-8">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-2" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-gray-600">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium">Filtros</span>
              </div>

              <div className="space-y-4">
                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avaliação
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value=""
                        checked={selectedRating === null}
                        onChange={() => setSelectedRating(null)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">Todas</span>
                    </label>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          value={rating}
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(rating)}
                          className="text-primary focus:ring-primary"
                        />
                        <div className="ml-2 flex items-center">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-3 w-3 ${
                                index < rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-700">
                            {rating} estrelas
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apartment Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apartamento
                  </label>
                  <select
                    value={selectedApartment}
                    onChange={(e) => setSelectedApartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">Todos os apartamentos</option>
                    {apartments.map((apartment) => (
                      <option key={apartment.id} value={apartment.id}>
                        {apartment.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredReviews.length} avaliação{filteredReviews.length !== 1 ? 'ões' : ''} encontrada{filteredReviews.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredReviews.length > 0 ? (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div key={review.id}>
                    <ReviewCard review={review} />
                    <div className="mt-2 ml-16">
                      <p className="text-sm text-gray-500">
                        Apartamento: {apartments.find(apt => apt.id === review.apartmentId)?.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhuma avaliação encontrada com os filtros selecionados.
                </p>
                <button
                  onClick={() => {
                    setSelectedRating(null);
                    setSelectedApartment('all');
                  }}
                  className="mt-4 text-primary hover:text-primary/80 font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;