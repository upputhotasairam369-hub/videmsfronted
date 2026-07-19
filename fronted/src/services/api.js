// src/services/api.js
import axios from 'axios';

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
  googleAuth: (data) => apiClient.post('auth/google/', data),
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
  dashboard: () => apiClient.get(`admin-api/dashboard/?t=${new Date().getTime()}`),
  products: (params) => apiClient.get(`products/?t=${new Date().getTime()}`, { params }),
  orders: (params) => apiClient.get(`admin-api/orders/?t=${new Date().getTime()}`, { params }),
  users: (params) => apiClient.get(`admin-api/users/?t=${new Date().getTime()}`, { params }),
};

export const publicAPI = {
  getBanners: () => apiClient.get(`banners/?t=${new Date().getTime()}`),
};

export const orderAPI = {
  create: (data) => apiClient.post('orders/create/', data),
  verify: (data) => apiClient.post('orders/verify/', data),
  myOrders: () => apiClient.get('orders/my-orders/'),
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get(`categories/?t=${new Date().getTime()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const combinationAPI = {
  list: () => apiClient.get(`combinations/?t=${new Date().getTime()}`),
};

export const bestSellerAPI = {
  list: () => apiClient.get(`home/bestsellers/?t=${new Date().getTime()}`),
};

export const newArrivalAPI = {
  list: () => apiClient.get(`home/new-arrivals/?t=${new Date().getTime()}`),
};

export const businessBannerAPI = {
  get: () => apiClient.get(`business-banner/?t=${new Date().getTime()}`),
};

export const bulkOrderAPI = {
  submit: (formData) => apiClient.post('bulk-orders/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
};

export default apiClient;