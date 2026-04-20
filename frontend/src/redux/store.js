import { configureStore, createSlice } from '@reduxjs/toolkit';

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.selectedSize === action.payload.selectedSize
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) => !(i.id === action.payload.id && i.selectedSize === action.payload.selectedSize)
      );
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.selectedSize === action.payload.selectedSize
      );
      if (item) item.quantity = action.payload.quantity;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
  },
});

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});

// Wishlist Slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: JSON.parse(localStorage.getItem('wishlist')) || [],
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
      localStorage.setItem('wishlist', JSON.stringify(action.payload));
    },
    addToWishlistLocal: (state, action) => {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    removeFromWishlistLocal: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const { loginSuccess, logout, updateUser } = authSlice.actions;
export const { setWishlist, addToWishlistLocal, removeFromWishlistLocal } = wishlistSlice.actions;

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    auth: authSlice.reducer,
    wishlist: wishlistSlice.reducer,
  },
});