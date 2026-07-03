import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartslice';
import productReducer from './slices/productslice';
import authReducer from './slices/authslice';
import orderReducer from './slices/orderslice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    auth: authReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
      },
    }),
});
