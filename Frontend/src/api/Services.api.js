import axios from 'axios';

const API_URL = 'http://34.135.123.36/postings/api/v1/';

const api = axios.create({
  baseURL: API_URL,
});

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
    return api.get('services/')
}

export const getServiceById = (id) => {
    return api.get(`services/${id}/`)
}

export const getAllJobs = () => {
    return api.get('jobs/')
}

export const getJobById = (id) => {
    return api.get(`jobs/${id}/`)
}

export const getServicesBySubcategory = (subcategoryId) => {
    return api.get(`services/subcategory/${subcategoryId}/`)
}

export const getJobsBySubcategory = (subcategoryId) => {
    return api.get(`jobs/subcategory/${subcategoryId}/`)
}

export const createService = (serviceData) => {
  return api.post('create-service/', serviceData, {
    headers: {
      'Content-Type': 'multipart/form-data'
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
