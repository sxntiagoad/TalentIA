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
    return api.post('create-job/', jobData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    };
