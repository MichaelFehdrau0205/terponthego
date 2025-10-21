import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  loginDeaf: (credentials) => api.post('/auth/login/deaf', credentials),
  loginInterpreter: (credentials) => api.post('/auth/login/interpreter', credentials),
  registerDeaf: (data) => api.post('/auth/register/deaf', data),
  registerInterpreter: (data) => api.post('/auth/register/interpreter', data),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Request endpoints
export const requestAPI = {
  create: (data) => api.post('/requests', data),
  getAll: () => api.get('/requests'),
  getById: (id) => api.get(`/requests/${id}`),
  accept: (id) => api.put(`/requests/${id}/accept`),
  getAvailable: () => api.get('/requests/available'),
};

export default api;