import React, { useState, useEffect } from 'react';

// Componente de estrellas interactivas
const StarRating = ({ rating, onRatingChange }) => {
  const handleClick = (newRating) => {
    onRatingChange(newRating);
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
          style={{
            cursor: 'pointer',
            fontSize: '20px',
            color: index < rating ? 'gold' : 'lightgray',
          }}
          onClick={() => handleClick(index + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

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
          <span className="w-8 text-sm text-gray-500">{Math.round(getPercentage(star))}%</span>
        </div>
      ))}
    </div>
  );
};

// Componente principal
function Reviews() {
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Jessica Smith', review: 'Great service, would recommend!', rating: 5, date: '3 days ago' },
    { id: 2, name: 'Mike Johnson', review: 'Very professional, on time and reliable.', rating: 4, date: '6 days ago' },
    { id: 3, name: 'Amanda Thompson', review: 'Creative and high quality work.', rating: 5, date: '2 weeks ago' },
    { id: 4, name: 'Chris Wilson', review: 'Excellent development service.', rating: 4, date: '3 weeks ago' },
    { id: 5, name: 'Jennifer Davis', review: 'SEO expert, great results.', rating: 5, date: '1 month ago' }
  ]);

  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [averageRating, setAverageRating] = useState(0);

  // Calcular el promedio de las calificaciones
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  useEffect(() => {
    setAverageRating(calculateAverageRating(reviews));
  }, [reviews]);

  const handleAddReview = () => {
    if (newReview.trim()) {
      const newReviewData = {
        id: reviews.length + 1,
        name: 'New User',
        review: newReview,
        rating: newRating,
        date: 'Just now'
      };
      setReviews([...reviews, newReviewData]);
      setNewReview('');
      setNewRating(5);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white px-10 py-5 text-gray-800">
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-semibold">Service Review</h1>
      </header>

      {/* Sección de promedio de calificaciones */}
      <section className="mt-8">
        <div className="text-4xl font-bold">{averageRating}</div>
        <StarRating rating={Math.round(averageRating)} onRatingChange={() => {}} />
        <p className="text-gray-600">{reviews.length} reviews</p>

        {/* Distribución de calificaciones */}
        <RatingDistribution reviews={reviews} />
      </section>

      {/* Añadir una reseña */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold">Write a detailed review</h3>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-gray-500"
          placeholder="Write your review here"
        ></textarea>

        <div className="mt-4">
          <StarRating rating={newRating} onRatingChange={setNewRating} />
        </div>

        {/* Botón de agregar reseña */}
        <button
          onClick={handleAddReview}
          className="mt-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-2 px-4 rounded-full shadow-lg hover:from-purple-600 hover:to-red-600 transition duration-300"
        >
          Add Review
        </button>
      </section>

      {/* Mostrar las reseñas existentes */}
      <section className="mt-8">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-[0.7rem] bg-white p-8 rounded-[0.8rem] shadow-sm border border-gray-200 transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center">
              <img
                src={`https://randomuser.me/api/portraits/lego/${review.id}.jpg`}
                alt={review.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <p className="font-bold">{review.name}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
            <StarRating rating={review.rating} onRatingChange={() => {}} />
            <p className="mt-2 text-gray-700">{review.review}</p>
            <div className="flex space-x-4 mt-2 text-gray-500">
              <span className="cursor-pointer">👍 {Math.floor(Math.random() * 10)}</span>
              <span className="cursor-pointer">👎 {Math.floor(Math.random() * 5)}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Reviews;
