import axios from 'axios';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/accounts/'  // Local
  : 'http://34.121.119.251:8000/accounts/';  // Producción

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

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la respuesta:', error);
    if (error.response) {
      console.error('Datos de la respuesta de error:', error.response.data);
      console.error('Estado de la respuesta de error:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export const login = (email, password) => {
  return authAxios.post('login/', { email, password });
};

export const register = (registrationData, userType) => {
  const endpoint = userType === 'company' ? 'register/company/' : 'register/freelancer/';
  return authAxios.post(endpoint, registrationData);
};


export const logout = () => {
  return authAxios.post('logout');
};

export const getProfile = () => {
  return authAxios.get('profile/');
};

export const updateProfile = (profileData) => {
  return authAxios.put('complete-profile/freelancer/', profileData)
    .then(response => {
      if (response.data) {
        return response.data;
      } else {
        throw new Error('La respuesta no contiene los datos del usuario actualizados');
      }
    });
};

export const updateCompanyProfile = (profileData) => {
  return authAxios.put('complete-profile/company/', profileData)
    .then(response => {
      if (response.data) {
        return response.data;
      } else {
        throw new Error('La respuesta no contiene los datos de la compañía actualizados');
      }
    });
};
