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