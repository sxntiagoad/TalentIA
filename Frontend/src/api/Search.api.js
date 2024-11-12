import axios from 'axios';

const SEARCH_API_URL = 'http://localhost:8000';

// Configurar interceptor para añadir el token
const searchApi = axios.create({
  baseURL: SEARCH_API_URL
});

searchApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// Búsqueda general de items (servicios/trabajos)
export const searchItems = (query) => {
    return searchApi.get(`/postings/api/v1/search/?q=${query}`);
};

// Búsqueda de freelancers (actualizada la ruta)
export const searchFreelancers = async (searchParams) => {
    try {
        console.log('Parámetros de búsqueda:', searchParams); // Para debug
        const response = await searchApi.post('/accounts/freelancers/search/', searchParams);
        return response;
    } catch (error) {
        console.error('Error detallado:', error.response?.data); // Ver el mensaje de error del backend
        throw error;
    }
};
