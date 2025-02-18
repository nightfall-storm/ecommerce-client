import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true, // Important for sending cookies with requests
})

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // No need to manually add the token as it will be sent automatically with cookies
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle unauthorized errors (e.g., redirect to login)
        if (error.response?.status === 401) {
            window.location.href = '/login?error=session_expired'
        }
        return Promise.reject(error)
    }
)

export default api