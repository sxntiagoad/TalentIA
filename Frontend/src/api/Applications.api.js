import axios from 'axios';

// Configuración base de axios
const instance = axios.create({
  baseURL: 'http://34.55.91.211:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las peticiones
instance.interceptors.request.use(
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

const applicationsApi = {
  applyToJob: async (jobId, applicationData) => {
    try {
      const response = await instance.post(`/postings/api/v1/jobs/${jobId}/apply/`, {
        cover_letter: applicationData.cover_letter
      });
      
      // Después de aplicar exitosamente, guardar el estado pendiente
      localStorage.setItem(`application_status_${jobId}`, 'Pendiente');
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  getJobApplications: async (jobId) => {
    try {
      const response = await instance.get(`/postings/api/v1/jobs/${jobId}/applications/`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await instance.patch(`/postings/api/v1/applications/${applicationId}/`, {
        status: status
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getApplication: async (applicationId) => {
    try {
      const response = await instance.get(`/postings/api/v1/applications/${applicationId}/details/`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMyApplications: async () => {
    try {
      const response = await instance.get('/postings/api/v1/applications/my-applications/');
      return response;
    } catch (error) {
      throw error;
    }
  },

  checkApplicationStatus: async (jobId) => {
    try {
      const response = await instance.get(`/postings/api/v1/jobs/${jobId}/application-status/`);
      
      // Si la respuesta contiene datos válidos
      if (response.data && response.data.status) {
        return {
          data: {
            exists: true,
            status: response.data.status,
            application_id: response.data.id,
            updated_at: response.data.updated_at
          }
        };
      }
      
      // Si no hay datos pero existe un estado pendiente en localStorage
      const savedStatus = localStorage.getItem(`application_status_${jobId}`);
      if (savedStatus === 'Pendiente') {
        return {
          data: {
            exists: true,
            status: 'Pendiente'
          }
        };
      }
      
      return { data: { exists: false } };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        localStorage.removeItem(`application_status_${jobId}`);
        return { data: { exists: false } };
      }
      throw error;
    }
  },

  checkJobApplication: async (jobId) => {
    try {
      const response = await instance.get(`/postings/api/v1/jobs/${jobId}/check-application/`);
      
      // Si hay una aplicación existente
      if (response.data && response.data.exists) {
        return {
          data: {
            exists: true,
            status: response.data.status,
            application_id: response.data.id
          }
        };
      }
      
      // Si no hay aplicación
      return {
        data: {
          exists: false
        }
      };
    } catch (error) {
      // Si es 404, significa que no hay aplicación
      if (error.response && error.response.status === 404) {
        return {
          data: {
            exists: false
          }
        };
      }
      throw error;
    }
  }
};

export default applicationsApi;