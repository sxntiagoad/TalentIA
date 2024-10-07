import axios from 'axios';

export const searchItems = (query) => {
    return axios.get(`http://localhost:8000/postings/api/v1/search/?q=${query}`);
};
