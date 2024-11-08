import axios from 'axios';

// Crear una instancia de axios con la configuración base
const chatAxios = axios.create({
  baseURL: 'http://34.135.123.36/chat',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
chatAxios.interceptors.request.use(
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

// Funciones de la API
export const initializeChat = async () => {
  try {
    const response = await chatAxios.post('/init/');
    console.log('Respuesta de inicialización:', response.data);
    return response;
  } catch (error) {
    console.error('Error al inicializar el chat:', error);
    throw error;
  }
};

export const getUserInfo = async (userId) => {
  try {
    const response = await chatAxios.get(`/user-info/${userId}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    throw error;
  }
};

export const createChannel = async (otherUserId) => {
  try {
    console.log('Creando canal con usuario ID:', otherUserId);
    const response = await chatAxios.post('/channel/create/', {
      other_user_id: otherUserId
    });
    console.log('Respuesta de creación de canal:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear el canal:', error);
    if (error.response) {
      console.error('Error del servidor:', error.response.data);
    }
    throw error;
  }
};

export const getChannels = async () => {
  try {
    const response = await chatAxios.get('/channels/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener canales:', error);
    throw error;
  }
};
export const deleteChannel = async (channelId) => {
  try {
    const response = await chatAxios.delete(`/channel/${channelId}/`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar canal:', error);
    throw error;
  }
};

// Exportar la instancia de axios por si se necesita usar directamente
export default chatAxios;

