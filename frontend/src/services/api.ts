import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.DEV) {
        // In development, use relative path (Vite proxy will handle it)
        return '/api';
    } else {
        // In production, use full backend URL
        return import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
    }
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
