import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productAPI.list(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await productAPI.detail(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
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
  },
  reducers: {
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
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
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

export const { updateProductStock } = productSlice.actions;
export default productSlice.reducer;
