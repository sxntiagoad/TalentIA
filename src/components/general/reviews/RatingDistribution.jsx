import React from 'react';

// Componente para mostrar la distribución de calificaciones
const RatingDistribution = ({ reviews }) => {
  const totalReviews = reviews.length;

  const getPercentage = (star) => {
    const count = reviews.filter((review) => review.rating === star).length;
    return (count / totalReviews) * 100;
  };

  return (
    <div className="mt-4">
      {[5, 4, 3, 2, 1].map((star) => (
        <div key={star} className="flex items-center mb-1">
          <span className="w-6 text-sm">{star}</span>
          <div className="w-full h-2 mx-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-gray-800 rounded-full"
              style={{ width: `${getPercentage(star)}%` }}
            ></div>
          </div>
          <span className="w-8 text-sm text-gray-500">
            {Math.round(getPercentage(star))}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default RatingDistribution;
