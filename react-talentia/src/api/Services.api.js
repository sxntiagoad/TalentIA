import axios from 'axios';

const API_URL = 'http://localhost:8000/postings/api/v1/';

// Create an axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para incluir el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllServices = () => {
    return axios.get('http://localhost:8000/postings/api/v1/services/')
}
export const getServiceById = (id) => {
    return axios.get(`http://localhost:8000/postings/api/v1/services/${id}/`)
}
export const getAllJobs = () => {
    return axios.get('http://localhost:8000/postings/api/v1/jobs/')
}
export const getJobById = (id) => {
    return axios.get(`http://localhost:8000/postings/api/v1/jobs/${id}/`)
}
export const getServicesBySubcategory = (subcategoryId) => {
    return axios.get(`http://localhost:8000/postings/api/v1/services/subcategory/${subcategoryId}/`)
}
export const getJobsBySubcategory = (subcategoryId) => {
    return axios.get(`http://localhost:8000/postings/api/v1/jobs/subcategory/${subcategoryId}/`)
}

export const createService = (serviceData) => {
  const token = localStorage.getItem('token');
  return api.post('create-service/', serviceData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Token ${token}`
    }
  });
};

export const createJob = (jobData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No se encontró el token de autenticación');
    return Promise.reject(new Error('No hay token de autenticación'));
  }
  return api.post('create-job/', jobData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Token ${token}`
    }
  }).catch(error => {
    if (error.response) {
      // El servidor respondió con un estado de error
      console.error('Error en la respuesta del servidor:', error.response.data);
      throw error.response.data;
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
      throw new Error('No se recibió respuesta del servidor');
    } else {
      // Algo sucedió al configurar la petición que provocó un error
      console.error('Error al configurar la petición:', error.message);
      throw new Error('Error al configurar la petición');
    }
  });
};
