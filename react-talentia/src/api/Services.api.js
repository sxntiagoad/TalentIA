import axios from 'axios';
export const getAllServices = () => {
    return axios.get('http://localhost:8000/postings/api/v1/services/')
}
export const getServiceById = (id) => {
    return axios.get(`http://localhost:8000/postings/api/v1/services/${id}/`)
}
export const getAllJobs = () => {
    return axios.get('http://localhost:8000/postings/api/v1/jobs/')
}
export const getJobById = (id) => {
    return axios.get(`http://localhost:8000/postings/api/v1/jobs/${id}/`)
}
export const getServicesBySubcategory = (subcategoryId) => {
    return axios.get(`http://localhost:8000/postings/api/v1/services/subcategory/${subcategoryId}/`)
}
export const getJobsBySubcategory = (subcategoryId) => {
    return axios.get(`http://localhost:8000/postings/api/v1/jobs/subcategory/${subcategoryId}/`)
}

export const createService = (serviceData) => {
    return axios.post('http://localhost:8000/postings/api/v1/services/', serviceData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const createJob = (jobData) => {
    return axios.post('http://localhost:8000/postings/api/v1/jobs/', jobData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
