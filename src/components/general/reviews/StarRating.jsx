import React from 'react';

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

export default StarRating;