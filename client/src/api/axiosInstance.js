import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust for production
    headers: {
        'Content-Type': 'application/json'
    }
});

export default instance;
