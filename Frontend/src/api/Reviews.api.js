import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://35.224.34.63:8000',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createReview = async (reviewData) => {
  return await axiosInstance.post('/postings/api/v1/create-review/', reviewData);
};

export const getServiceReviews = async (serviceId) => {
  return await axiosInstance.get(`/postings/api/v1/service-reviews/${serviceId}/`);
};

export const getJobReviews = async (jobId) => {
  return await axiosInstance.get(`/postings/api/v1/job-reviews/${jobId}/`);
};

export const updateReview = async (reviewId, reviewData) => {
  return await axiosInstance.put(`/postings/api/v1/reviews/${reviewId}/`, reviewData);
};

export const deleteReview = async (reviewId) => {
  return await axiosInstance.delete(`/postings/api/v1/reviews/${reviewId}/`);
};