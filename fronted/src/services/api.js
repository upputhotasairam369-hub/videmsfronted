// src/services/api.js
import axios from 'axios';

// 1. HARDCODE the known working URL to guarantee connection and bypass Vercel Env issues.
// Note: It strictly ends in /api/ to ensure routes like /api/products/ resolve correctly.
const API_BASE_URL = 'https://videmsbackend-production.up.railway.app/api/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// 2. Intercept requests to attach the Auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Add response error logging for debugging
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error Detected:', {
      status: error.response?.status,
      message: error.response?.data || error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

// --- EXISTING APIs ---
export const productAPI = {
  list: (params) => apiClient.get('products/', { params }),
  detail: (slug) => apiClient.get(`products/${slug}/`),
  categories: () => apiClient.get('categories/')
};

export const healthAPI = {
  check: () => apiClient.get('health/')
};

export const authAPI = {
  sendOtp: (data) => apiClient.post('auth/send-otp/', data),
  verifyOtp: (data) => apiClient.post('auth/verify-otp/', data),
  me: () => apiClient.get('auth/me/'),
  updateProfile: (data) => apiClient.put('auth/me/update/', data)
};

export const cartAPI = {
  get: () => apiClient.get('cart/'),
  add: (data) => apiClient.post('cart/add/', data),
  update: (id, data) => apiClient.put(`cart/update/${id}/`, data),
  remove: (id) => apiClient.delete(`cart/remove/${id}/`),
  clear: () => apiClient.delete('cart/clear/'),
  reserve: (data) => apiClient.post('cart/reserve/', data),
  sync: (items) => apiClient.post('cart/sync/', { items })
};

export const adminAPI = {
  dashboard: () => apiClient.get('admin-api/dashboard/'),
  products: (params) => apiClient.get('products/', { params }),
  orders: (params) => apiClient.get('admin-api/orders/', { params }),
  users: (params) => apiClient.get('admin-api/users/', { params }),
};

export const publicAPI = {
  getBanners: () => apiClient.get('banners/'),
};

export const orderAPI = {
  create: (data) => apiClient.post('orders/create/', data),
  verify: (data) => apiClient.post('orders/verify/', data),
  myOrders: () => apiClient.get('orders/my-orders/'),
};

export default apiClient;