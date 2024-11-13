import React from 'react';
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';

// Componente StarRating interno
function StarRating({ rating }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

// Componente ReviewItem interno
function ReviewItem({ review, onEdit, onDelete }) {
  const { user } = useAuth();
  const isAuthor = user && user.email === review.author_email;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {review.author_avatar && (
            <img
              src={review.author_avatar}
              alt={review.author_name}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <h3 className="font-semibold text-gray-800">{review.author_name}</h3>
            <StarRating rating={review.rating} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString()}
          </span>
          {isAuthor && (
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(review)}
                className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                title="Editar review"
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={() => onDelete(review.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
                title="Eliminar review"
              >
                <FaTrash size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-600">{review.content}</p>
    </div>
  );
}

// Componente ReviewSummary interno
function ReviewSummary({ reviews }) {
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="text-4xl font-bold text-gray-800">
          {averageRating.toFixed(1)}
        </div>
        <div>
          <StarRating rating={Math.round(averageRating)} />
          <p className="text-sm text-gray-500">{reviews.length} reviews en total</p>
        </div>
      </div>
    </div>
  );
}

export function ReviewList({ reviews, onEdit, onDelete }) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <p className="text-center text-gray-500">No hay reviews todavía</p>;
  }

  return (
    <div>
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewItem 
            key={review.id} 
            review={review} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <ReviewSummary reviews={reviews} />
    </div>
  );
}

export default ReviewList; 