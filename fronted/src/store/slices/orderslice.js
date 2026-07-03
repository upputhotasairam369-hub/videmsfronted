import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    currentOrder: null,
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setOrders: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setCurrentOrder, clearCurrentOrder, setOrders } =
  orderSlice.actions;
export default orderSlice.reducer;
