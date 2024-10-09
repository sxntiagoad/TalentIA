import axios from 'axios';

const API_URL = 'http://localhost:8000/accounts/';

const authAxios = axios.create({
  baseURL: API_URL,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token en interceptor:', token);
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (email, password) => {
  return authAxios.post('login', { email, password });
};

export const register = (registrationData, userType) => {
  const endpoint = userType === 'company' ? 'register/company/' : 'register/freelancer/';
  return authAxios.post(endpoint, registrationData);
};


export const logout = () => {
  return authAxios.post('logout');
};

export const getProfile = () => {
  return authAxios.get('profile');
};
