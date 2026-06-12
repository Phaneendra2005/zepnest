import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zepnest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize error shape
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401, the AuthContext / page component will handle redirect
    return Promise.reject(error);
  }
);

export default api;
