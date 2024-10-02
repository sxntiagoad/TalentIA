import axios from 'axios';

const API_URL = 'http://localhost:8000/auth/';

export const login = (username, password) => {
  return axios.post(API_URL + 'login', { username, password });
};

export const register = (username, email, password) => {
  return axios.post(API_URL + 'register', { username, email, password });
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

