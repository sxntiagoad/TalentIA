import axios from 'axios';
export const getAllServices = () => {
    return axios.get('http://localhost:8000/postings/api/v1/services/')
}