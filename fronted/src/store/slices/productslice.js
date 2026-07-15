import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/api';

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
    condition: (params, { getState }) => {
      const { products } = getState();
      const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
      const isSameParams = JSON.stringify(params) === JSON.stringify(products.lastParams);
      const isCacheValid = products.lastFetchTime && (Date.now() - products.lastFetchTime < CACHE_TIME);
      
      if (isSameParams && isCacheValid && products.items.length > 0) {
        console.log('⚡ Skipping fetch: Using cached products (params unchanged and cache < 5m old)');
        return false; // Cancels the fetch
      }
      return true;
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
    hasFetched: false, // ⚠️ This is ALWAYS reset, allowing fresh fetches
    lastFetchTime: null,
    lastParams: null,
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
    invalidateProducts: (state) => {
      // 🔥 CRITICAL: Reset the cache flag to force a fresh fetch
      state.hasFetched = false;
      state.items = []; // Clear stale items too
      state.error = null;
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.lastFetchTime = Date.now();
        state.lastParams = action.meta.arg;

        // Handle both paginated and direct array responses
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          state.totalPages = 1;
        } else if (action.payload.results) {
          state.items = action.payload.results;
          state.totalPages = action.payload.total_pages || 1;
        } else if (action.payload.data) {
          state.items = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
          state.totalPages = 1;
        } else {
          state.items = [];
          state.totalPages = 1;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
        // ⚠️ Don't set hasFetched to true on error, allowing retry
        state.hasFetched = false;
        state.items = []; // Clear any stale data
      })
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

export const { resetProducts, invalidateProducts, updateProductStock } = productSlice.actions;
export default productSlice.reducer;
