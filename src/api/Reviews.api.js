import axios from 'axios';

const BASE_URL = 'http://tu-api.com/api'; // Reemplaza con la URL de tu API

// Función para obtener todas las reseñas
export const getReviews = async () => {
  const response = await axios.get(`${BASE_URL}/reviews`); // Ajusta la ruta según tu API
  return response.data;
};

// Función para crear una nueva reseña
export const createReview = async (reviewData) => {
  const response = await axios.post(`${BASE_URL}/reviews`, reviewData); // Ajusta la ruta según tu API
  return response.data;
};

//para los id 
export const getReviewsByRevieweeId = async (revieweeId) => {
  const response = await axios.get(`/api/reviews/${revieweeId}`);
  return response.data;
};