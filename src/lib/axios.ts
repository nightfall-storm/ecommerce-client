import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage instead of cookies
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api