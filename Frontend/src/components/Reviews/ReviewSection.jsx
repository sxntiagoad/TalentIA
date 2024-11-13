import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { updateReview, deleteReview } from '../../api/Reviews.api';

export function ReviewSection({ 
  reviews, 
  onReviewSubmit, 
  isService, 
  itemId,
  authorId
}) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({ content: '', rating: 5 });
  const { user } = useAuth();

  const isAuthor = user && user.id === authorId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await updateReview(editingReview.id, newReview);
        setEditingReview(null);
      } else {
        await onReviewSubmit(newReview);
      }
      setNewReview({ content: '', rating: 5 });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error al enviar review:', error);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setNewReview({ content: review.content, rating: review.rating });
    setShowReviewForm(true);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta review?')) {
      try {
        await deleteReview(reviewId);
        // Actualizar la lista de reviews después de eliminar
        onReviewSubmit({ content: '', rating: 5 }); // Esto recargará las reviews
      } catch (error) {
        console.error('Error al eliminar review:', error);
      }
    }
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
        {user && !showReviewForm && !editingReview && !isAuthor && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Escribir Review
          </button>
        )}
      </div>

      {showReviewForm && (
        <ReviewForm
          newReview={newReview}
          setNewReview={setNewReview}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowReviewForm(false);
            setEditingReview(null);
            setNewReview({ content: '', rating: 5 });
          }}
          isEditing={!!editingReview}
        />
      )}

      <ReviewList 
        reviews={reviews} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default ReviewSection; 