import axios from 'axios';

const API_URL = 'http://35.224.34.63:8000/accounts/';

const profileApi = axios.create({
  baseURL: API_URL,
});

profileApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getPublicProfile = async (userType, userId) => {
  try {
    const response = await profileApi.get(`profile/${userType}/${userId}/`);
    return response;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}; 