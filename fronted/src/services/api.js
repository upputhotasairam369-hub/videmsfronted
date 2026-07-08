// src/services/api.js
import axios from 'axios';

// 1. Create the Axios instance pointing to Django dynamically
// Uses the Vercel environment variable in production, defaults to localhost in development
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://videmsbackend-production.up.railway.app/api/',
  headers: { 
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
});

// 2. Intercept requests to attach the Auth token and ALWAYS bust cache with timestamp
// This forces fresh data on EVERY request (critical for mobile devices)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // ⚠️ CRITICAL: Append timestamp to EVERY request without exception
  // This prevents ANY caching at browser, CDN, or service worker level
  config.params = { ...config.params, _t: Date.now() };
  return config;
});

// 3. Add response error logging for debugging
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.detail || error.message,
      url: error.config?.url,
      timestamp: new Date().toISOString()
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

// --- CART APIs ---
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
