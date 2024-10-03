import axios from 'axios';

const API_URL = 'http://localhost:8000/auth/';

export const login = (email, password) => {
  return axios.post(API_URL + 'login', { email, password });
};

export const register = (registrationData) => {
  return axios.post(API_URL + 'register', registrationData);
};

export const logout = () => {
  return axios.post(API_URL + 'logout', {}, {
    headers: { Authorization: `Token ${localStorage.getItem('token')}` }
  });
};

export const getProfile = () => {
  return axios.post(API_URL + 'profile', {}, {
    headers: { Authorization: `Token ${localStorage.getItem('token')}` }
  });
};
