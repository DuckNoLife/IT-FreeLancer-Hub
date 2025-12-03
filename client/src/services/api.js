import axios from 'axios';

// Instantiate Axios Client
const api = axios.create({
    // AUTOMATIC URL DETECTION:
    // If VITE_API_URL is set (on Render), use it.
    // Otherwise, fallback to localhost (for local development).
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
    
    // Default headers
    headers: {
        'Content-Type': 'application/json'
    }
});

// Configure Request Interceptor
api.interceptors.request.use(
    // Request success handler
    config => {
        const token = localStorage.getItem('token');
        
        // Attach JWT token if available
        if (token) {
            // Standard 'Bearer' authentication scheme
            config.headers['Authorization'] = `Bearer ${token}`; 
        }
        
        return config;
    }, 
    
    // Request error handler
    error => {
        return Promise.reject(error);
    }
);

// Module export
export default api;