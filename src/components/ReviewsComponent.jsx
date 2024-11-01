import React, { useState } from 'react';
import { useReviews } from '../hooks/useReviews';

const ReviewsComponent = ({ revieweeId }) => {
  const { reviews, loading, error, addReview } = useReviews(revieweeId);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  const handleAddReview = async () => {
    if (!newReview.trim()) return;

    const reviewData = {
      rating: newRating,
      description: newReview,
      reviewee: revieweeId
    };

    await addReview(reviewData);
    setNewReview('');
    setNewRating(5);
  };

  if (loading) return <p>Cargando reviews...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="reviews-component">
      <h2 className="text-xl font-semibold">Reseñas</h2>
      <textarea
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        placeholder="Escribe una reseña"
        className="w-full border border-gray-300 p-2 rounded mb-4"
      />
      <div className="flex justify-between items-center mb-4">
        <input
          type="number"
          value={newRating}
          min="1"
          max="5"
          onChange={(e) => setNewRating(e.target.value)}
          className="border border-gray-300 rounded w-16"
        />
        <button onClick={handleAddReview} className="bg-purple-600 text-white py-2 px-4 rounded">
          Agregar Reseña
        </button>
      </div>

      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="mb-4 border border-gray-200 p-4 rounded">
            <p className="font-bold">Rating: {review.rating}/5</p>
            <p>{review.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsComponent;
