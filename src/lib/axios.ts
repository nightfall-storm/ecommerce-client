import axios from 'axios'
import { getToken } from '@/lib/actions/auth';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': '', // Placeholder for token
    },
    withCredentials: true, // Important for sending cookies with requests
});

// Add request interceptor
api.interceptors.request.use(
    async (config) => {
        const token = await getToken(); // Fetch the token directly
        if (token) {
            config.headers['Authorization'] = `Bearer ${token.value}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle unauthorized errors (e.g., redirect to login)
        if (error.response?.status === 401) {
            window.location.href = '/login?error=session_expired';
        }
        return Promise.reject(error);
    }
);

export default api;