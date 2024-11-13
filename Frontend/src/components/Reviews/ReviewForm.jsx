import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaStar } from "react-icons/fa";

// Componente StarRating interno
function StarRating({ rating, onRatingChange, editable = false }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`${editable ? 'cursor-pointer' : ''} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => editable && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
}

export function ReviewForm({ 
  newReview, 
  setNewReview, 
  onSubmit, 
  onCancel 
}) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <form onSubmit={onSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Calificación</label>
        <StarRating 
          rating={newReview.rating} 
          onRatingChange={(rating) => setNewReview({ ...newReview, rating })} 
          editable 
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Tu opinión</label>
        <textarea
          value={newReview.content}
          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows="4"
          required
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          Publicar Review
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ReviewForm; 