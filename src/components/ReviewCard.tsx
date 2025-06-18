import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
  apartmentTitle?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, apartmentTitle }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start space-x-4">
        <img
          src={review.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
          alt={review.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">{review.name}</h4>
            <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
          </div>
          
          <div className="flex items-center mb-3">
            {renderStars(review.rating)}
            <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-2">{review.comment}</p>
          {apartmentTitle && (
            <p className="text-sm text-gray-500">Apartamento: {apartmentTitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;