import axios from 'axios';

const API_URL = 'http://35.224.34.63:8000/postings/api/v1/';

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
  const formData = new FormData();
  
  formData.append('title', serviceData.title);
  formData.append('description', serviceData.description);
  formData.append('location', serviceData.location);
  formData.append('availability', serviceData.availability);
  formData.append('category', serviceData.category);
  formData.append('subcategory', serviceData.subcategory);
  formData.append('nestedcategory', serviceData.nestedcategory);
  
  formData.append('basic_active', serviceData.basic_active);
  if (serviceData.basic_active) {
    formData.append('basic_price', serviceData.basic_price);
    formData.append('basic_description', serviceData.basic_description);
    formData.append('basic_delivery_time', serviceData.basic_delivery_time);
    formData.append('basic_revisions', serviceData.basic_revisions);
  }

  formData.append('standard_active', serviceData.standard_active);
  if (serviceData.standard_active) {
    formData.append('standard_price', serviceData.standard_price);
    formData.append('standard_description', serviceData.standard_description);
    formData.append('standard_delivery_time', serviceData.standard_delivery_time);
    formData.append('standard_revisions', serviceData.standard_revisions);
  }

  formData.append('premium_active', serviceData.premium_active);
  if (serviceData.premium_active) {
    formData.append('premium_price', serviceData.premium_price);
    formData.append('premium_description', serviceData.premium_description);
    formData.append('premium_delivery_time', serviceData.premium_delivery_time);
    formData.append('premium_revisions', serviceData.premium_revisions);
  }

  if (serviceData.image) {
    formData.append('image', serviceData.image);
  }

  return api.post('create-service/', formData, {
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

// Obtener detalles completos de un servicio incluyendo planes
export const getServiceDetails = (serviceId) => {
  return api.get(`services/${serviceId}/details/`);
};

// Obtener planes de un servicio específico
export const getServicePlans = (serviceId) => {
  return api.get(`services/${serviceId}/plans/`);
};

// Añadir estos métodos
const servicesApi = {
  getAllServices: () => api.get('services/'),
  getServiceById: (id) => api.get(`services/${id}/`),
  getAllJobs: () => api.get('jobs/'),
  getJobById: (id) => api.get(`jobs/${id}/`),
  getServicesBySubcategory: (subcategoryId) => api.get(`services/subcategory/${subcategoryId}/`),
  getJobsBySubcategory: (subcategoryId) => api.get(`jobs/subcategory/${subcategoryId}/`),
  createService: (serviceData) => {
    const formData = new FormData();
    
    formData.append('title', serviceData.title);
    formData.append('description', serviceData.description);
    formData.append('location', serviceData.location);
    formData.append('availability', serviceData.availability);
    formData.append('category', serviceData.category);
    formData.append('subcategory', serviceData.subcategory);
    formData.append('nestedcategory', serviceData.nestedcategory);
    
    formData.append('basic_active', serviceData.basic_active);
    if (serviceData.basic_active) {
      formData.append('basic_price', serviceData.basic_price);
      formData.append('basic_description', serviceData.basic_description);
      formData.append('basic_delivery_time', serviceData.basic_delivery_time);
      formData.append('basic_revisions', serviceData.basic_revisions);
    }

    formData.append('standard_active', serviceData.standard_active);
    if (serviceData.standard_active) {
      formData.append('standard_price', serviceData.standard_price);
      formData.append('standard_description', serviceData.standard_description);
      formData.append('standard_delivery_time', serviceData.standard_delivery_time);
      formData.append('standard_revisions', serviceData.standard_revisions);
    }

    formData.append('premium_active', serviceData.premium_active);
    if (serviceData.premium_active) {
      formData.append('premium_price', serviceData.premium_price);
      formData.append('premium_description', serviceData.premium_description);
      formData.append('premium_delivery_time', serviceData.premium_delivery_time);
      formData.append('premium_revisions', serviceData.premium_revisions);
    }

    if (serviceData.image) {
      formData.append('image', serviceData.image);
    }

    return api.post('create-service/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  createJob: (jobData) => {
    return api.post('create-job/', jobData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getServiceDetails: (serviceId) => api.get(`services/${serviceId}/details/`),
  getServicePlans: (serviceId) => api.get(`services/${serviceId}/plans/`),
  
  // Métodos de pago y órdenes
  checkServiceOrder: (serviceId) => {
    return api.get(`services/${serviceId}/check-order/`);
  },

  createServiceOrder: (serviceId, orderData) => {
    return api.post(`services/${serviceId}/order/`, orderData);
  },

  processPayment: (orderId, paymentData) => {
    return api.post(`orders/${orderId}/pay/`, paymentData);
  },

  // Métodos para solicitudes de servicios
  getMyServiceRequests: () => {
    return api.get('service-requests/my-requests/');
  },

  getReceivedServiceRequests: () => {
    console.log('Llamando a getReceivedServiceRequests');
    return api.get('service-requests/received/').then(response => {
      console.log('Respuesta de solicitudes recibidas:', response);
      return response;
    }).catch(error => {
      console.error('Error en getReceivedServiceRequests:', error);
      throw error;
    });
  },

  updateServiceRequestStatus: (requestId, status) => {
    return api.patch(`service-requests/${requestId}/status/`, { status });
  },

  // Métodos para órdenes
  getMyOrders: () => {
    return api.get('orders/my-orders/');
  },

  getMySales: () => {
    return api.get('orders/my-sales/');
  },

  getServiceStats: (serviceId) => {
    return api.get(`services/${serviceId}/stats/`);
  },
};

export default servicesApi;

