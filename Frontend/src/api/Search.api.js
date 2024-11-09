import axios from 'axios';

export const searchItems = (query) => {
    return axios.get(`http://35.224.34.63:8000/postings/api/v1/search/?q=${query}`);
};
