import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';

// ============================================================================
// SAFETY HELPERS: Prevents the app from crashing on bad local storage data
// ============================================================================
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Corrupted cart data in localStorage. Resetting.", error);
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage.", error);
  }
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================
export const syncCart = createAsyncThunk(
  'cart/sync',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { cart } = getState();
      const response = await cartAPI.sync(cart.items);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ============================================================================
// SLICE
// ============================================================================
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    reservationIds: {},
    loading: false,
  },
  reducers: {
    addToCart: (state, action) => {
      let product = action.payload?.product;
      let variant = action.payload?.variant;
      // 🚀 FIX: Safely extract the requested quantity, default to 1 if missing.
      let requestedQuantity = action.payload?.quantity || 1;

      if (!product && action.payload) {
        product = action.payload;
        variant = action.payload.variants?.[0] || {
          variant_id: action.payload.variantId || `var_${action.payload._id || 'default'}`,
          price: action.payload.price || 0,
          inventory_quantity: action.payload.inventory_quantity
        };
      }

      if (!variant) {
        variant = {
          variant_id: 'default',
          price: product?.price || 0,
          inventory_quantity: product?.inventory_quantity
        };
      }

      // Extract the maximum available stock (fallback to 5 if undefined)
      const maxStock = variant.inventory_quantity ?? product?.inventory_quantity ?? 5;

      const existing = state.items.find(
        (item) =>
          item.productId === product._id &&
          item.variantId === variant.variant_id
      );

      if (existing) {
        // 🚀 FIX: If item exists, ADD the new requested quantity to the existing quantity.
        // But strictly prevent adding more than the available stock limit.
        existing.quantity = Math.min(existing.quantity + requestedQuantity, maxStock);
        existing.maxQuantity = maxStock;
      } else {
        // 🚀 FIX: If it's a new item, start with the requested quantity (up to the max limit).
        state.items.push({
          productId: product._id,
          variantId: variant.variant_id,
          name: product.name,
          image: product.images?.[0]?.url || product.image || product.imageUrl,
          price: variant.price || product.price,
          quantity: Math.min(requestedQuantity, maxStock), // Applied here!
          maxQuantity: maxStock,
          slug: product.slug,
        });
      }
      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload || {};
      if (!productId) return;

      state.items = state.items.filter(
        (item) =>
          !(item.productId === productId && item.variantId === variantId)
      );
      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { productId, variantId, quantity } = action.payload || {};
      const item = state.items.find(
        (i) => i.productId === productId && i.variantId === variantId
      );
      if (item) {
        const maxQty = item.maxQuantity ?? 5;
        item.quantity = Math.min(Math.max(1, quantity), maxQty);
        saveCartToStorage(state.items);
      }
    },

    setReservation: (state, action) => {
      const { productId, variantId, reservationId } = action.payload || {};
      if (productId && variantId) {
        state.reservationIds[`${productId}_${variantId}`] = reservationId;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.reservationIds = {};
      try {
        localStorage.removeItem('cart');
      } catch (error) {
        console.error("Failed to clear localStorage", error);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setReservation,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;