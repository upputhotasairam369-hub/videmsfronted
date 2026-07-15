import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/api';

// 🎯 Smart fetch with built-in cache validation
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching products with params:', params);
      const response = await productAPI.list(params);
      console.log('✅ Products fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch products:', error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  },
  {
    // 🔥 CRITICAL: This condition prevents redundant API calls
    condition: (params, { getState }) => {
      const { products } = getState();
      const CACHE_TIME = 5 * 60 * 1000; // 5 minutes cache window

      // Check if params are identical to last fetch
      const isSameParams = JSON.stringify(params) === JSON.stringify(products.lastParams);
      
      // Check if cache is still fresh (< 5 minutes old)
      const isCacheValid = products.lastFetchTime && 
        (Date.now() - products.lastFetchTime < CACHE_TIME);
      
      // If all conditions met, SKIP the API call entirely
      if (isSameParams && isCacheValid && products.items.length > 0) {
        console.log('⚡ CACHE HIT: Skipping API call - using cached products');
        return false; // Aborts the thunk
      }

      console.log('📡 CACHE MISS: Fetching fresh data from API');
      return true; // Proceeds with API call
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async (slug, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching product detail for slug:', slug);
      const response = await productAPI.detail(slug);
      console.log('✅ Product detail fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch product detail:', error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    featured: [],
    currentProduct: null,
    loading: false,
    error: null,
    totalPages: 0,
    hasFetched: false,
    lastFetchTime: null,      // ⏱️ Timestamp of last successful fetch
    lastParams: null,          // 📋 Parameters of last fetch (for comparison)
  },
  reducers: {
    resetProducts: (state) => {
      state.items = [];
      state.featured = [];
      state.currentProduct = null;
      state.loading = false;
      state.error = null;
      state.totalPages = 0;
      state.hasFetched = false;
      state.lastFetchTime = null;
      state.lastParams = null;
    },
    updateProductStock: (state, action) => {
      const { productId, variantId, availableStock } = action.payload;
      if (state.currentProduct && state.currentProduct._id === productId) {
        const variant = state.currentProduct.variants.find(
          (v) => v.variant_id === variantId
        );
        if (variant) {
          variant.inventory_quantity = availableStock;
        }
      }
      const product = state.items.find((p) => p._id === productId);
      if (product) {
        const variant = product.variants.find(
          (v) => v.variant_id === variantId
        );
        if (variant) {
          variant.inventory_quantity = availableStock;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // When fetch starts: Set loading=true, clear errors
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When fetch succeeds: Store data + metadata (lastFetchTime, lastParams)
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.lastFetchTime = Date.now();        // 🕐 Store current time
        state.lastParams = action.meta.arg;      // 📋 Store params used

        // Handle various response formats from API
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          state.totalPages = 1;
        } else if (action.payload.results) {
          state.items = action.payload.results;
          state.totalPages = action.payload.total_pages || 1;
        } else if (action.payload.data) {
          state.items = Array.isArray(action.payload.data) 
            ? action.payload.data 
            : [action.payload.data];
          state.totalPages = 1;
        } else {
          state.items = [];
          state.totalPages = 1;
        }
      })
      // When fetch fails: Show error, allow retry
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
        state.hasFetched = false;      // Allows retry
        state.items = [];              // Clear stale data
      })
      // Product detail cases
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch product details';
      });
  },
});

export const { resetProducts, updateProductStock } = productSlice.actions;
export default productSlice.reducer;
