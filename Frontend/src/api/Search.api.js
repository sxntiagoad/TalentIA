import axios from 'axios';

export const searchItems = (query) => {
    return axios.get(`http://34.69.134.180:8000/postings/api/v1/search/?q=${query}`);
};
