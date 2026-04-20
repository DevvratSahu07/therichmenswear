import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getFeaturedProducts = () => API.get('/products/featured');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Orders
export const getMyOrders = () => API.get('/orders/my-orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Payment
export const createRazorpayOrder = (amount) => API.post('/payment/create-order', { amount });
export const verifyPayment = (data) => API.post('/payment/verify', data);

// Reviews
export const getReviews = (productId) => API.get(`/reviews/${productId}`);
export const addReview = (productId, data) => API.post(`/reviews/${productId}`, data);

// Wishlist
export const getWishlist = () => API.get('/wishlist');
export const addToWishlistAPI = (productId) => API.post('/wishlist', { productId });
export const removeFromWishlistAPI = (productId) => API.delete(`/wishlist/${productId}`);

// Address
export const getAddresses = () => API.get('/addresses');
export const addAddress = (data) => API.post('/addresses', data);
export const deleteAddress = (id) => API.delete(`/addresses/${id}`);

export default API;