import axios from 'axios';

export const CreateUser = (user) => {
    return axios.post('http://localhost:8000/postings/api/v1/users/', user);
}