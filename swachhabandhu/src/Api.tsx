// src/services/api.ts
import axios from 'axios';

// For Vite, use import.meta.env.VITE_API_URL
// For CRA, use process.env.REACT_APP_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/auth';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor for token refresh (more advanced)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check if the error is 401, not for login/refresh itself, and not already retried
    if (error.response?.status === 401 && !originalRequest._retry &&
        !originalRequest.url.endsWith('/login/') &&
        !originalRequest.url.endsWith('/token/refresh/')) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, logout or redirect
          // This part might be handled by AuthContext clearing data
          console.error("No refresh token available for refresh attempt.");
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userData');
          // window.location.href = '/login'; // Or trigger logout via context
          return Promise.reject(error);
        }

        const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
        localStorage.setItem('accessToken', data.access);
        
        // Update the Authorization header for the original request and for future requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);
        // Handle logout or redirect to login if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        // Consider calling a logout function from AuthContext if available globally
        // or redirecting:
        if (window.location.pathname !== '/login') {
             window.location.href = '/login'; // Force redirect if refresh fails catastrophically
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;