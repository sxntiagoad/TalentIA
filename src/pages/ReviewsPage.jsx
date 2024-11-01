import React from 'react';
import Reviews from '../components/general/reviews/Reviews';
import Navbar from '../components/general/Navbar';
import { useParams } from 'react-router-dom';

const ReviewsPage = () => {
  const { id } = useParams(); // Obtener el ID de la URL

  return (
    <div>
      <Navbar isAuthenticated={true} />
      <Reviews revieweeId={id} /> {/* Pasar el ID a Reviews */}
    </div>
  );
};

export default ReviewsPage;
