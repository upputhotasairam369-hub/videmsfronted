// src/services/api.js
import axios from 'axios';

//sample//


// 1. Create the Axios instance pointing to Django dynamically
// Uses the Vercel environment variable in production, defaults to localhost in development
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://videmsbackend-production.up.railway.app/api/',
  headers: { 'Content-Type': 'application/json' },
});

// 2. Intercept requests to attach the Auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- EXISTING APIs ---
export const productAPI = {
  list: (params) => apiClient.get('products/', { params }),
  detail: (slug) => apiClient.get(`products/${slug}/`),
  categories: () => apiClient.get('categories/')
};

// --- CONNECTION TEST ---
// Call this from any component to verify Django is reachable
export const healthAPI = {
  check: () => apiClient.get('health/')
};

export const authAPI = {
  sendOtp: (data) => apiClient.post('auth/send-otp/', data),
  verifyOtp: (data) => apiClient.post('auth/verify-otp/', data),
  me: () => apiClient.get('auth/me/'),
  updateProfile: (data) => apiClient.put('auth/me/update/', data)
};

// --- RESTORED APIs (The Fix) ---
export const cartAPI = {
  get: () => apiClient.get('cart/'),
  add: (data) => apiClient.post('cart/add/', data),
  update: (id, data) => apiClient.put(`cart/update/${id}/`, data),
  remove: (id) => apiClient.delete(`cart/remove/${id}/`),
  clear: () => apiClient.delete('cart/clear/')
};

export const adminAPI = {
  // Routes to the Django Admin endpoints
  dashboard: () => apiClient.get('admin-api/dashboard/'),
  products: (params) => apiClient.get('products/', { params }),
  orders: (params) => apiClient.get('admin-api/orders/', { params }),
  users: (params) => apiClient.get('admin-api/users/', { params }),
};

export const publicAPI = {
  // Added Banner Fetcher
  getBanners: () => apiClient.get('banners/'),
};

export const orderAPI = {
  create: (data) => apiClient.post('orders/create/', data),
  verify: (data) => apiClient.post('orders/verify/', data),
  myOrders: () => apiClient.get('orders/my-orders/'),
};

export default apiClient;