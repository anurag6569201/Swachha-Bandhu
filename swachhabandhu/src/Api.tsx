import axios from 'axios';

// The new base URL points to our versioned API root
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check for 401, that it's not a retry, and not the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, force logout
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        // Use a separate axios instance for refresh to avoid circular interceptor loops
        const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem('accessToken', data.access);
        
        // Update the default header for subsequent requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        // Update the header of the original failed request
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        
        return apiClient(originalRequest); // Retry the original request

      } catch (refreshError: any) {
        // Refresh failed, clear all auth data and redirect to login
        console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        if (window.location.pathname !== '/auth/login') {
             window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;