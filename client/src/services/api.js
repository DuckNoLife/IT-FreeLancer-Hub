import axios from 'axios';

// Instantiate Axios Client
const api = axios.create({
    baseURL: 'http://localhost:5000/api', 
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