// src/hooks/usecart.js
import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  setReservation,
  clearCart as clearCartAction // 🚀 1. IMPORT THE REDUX ACTION HERE
} from '../store/slices/cartslice';
import { cartAPI } from '../services/api';

export const useCart = () => {
  const dispatch = useDispatch();

  // Connect directly to Redux for live updates
  const items = useSelector((state) => state.cart?.items) || [];

  const addItem = async (product, variant, quantity = 1) => {
    // ========================================================
    // ⚡ INSTANT SPEED FIX (OPTIMISTIC UPDATE)
    // Dispatch to Redux immediately BEFORE calling the API.
    // This updates the button and Navbar instantly with 0ms delay!
    // ========================================================
    dispatch(addToCart({ product, variant, quantity }));

    // ========================================================
    // SILENT BACKGROUND SYNC
    // Talk to the backend without freezing the UI
    // ========================================================
    try {
      const cartId = localStorage.getItem('cartId') || `cart_${Date.now()}`;
      localStorage.setItem('cartId', cartId);

      const response = await cartAPI.reserve({
        product_id: product._id || product.id,
        variant_id: variant.variant_id || 'default',
        quantity,
        cart_id: cartId,
      });

      if (response.data?.status === 'reserved') {
        dispatch(
          setReservation({
            productId: product._id || product.id,
            variantId: variant.variant_id || 'default',
            reservationId: response.data.reservation_id,
          })
        );
      }
      return { success: true };
    } catch (error) {
      console.warn('Backend API reserve failed, but item is instantly saved in local UI.');
      return {
        success: true,
        error: error.response?.data?.error || 'Failed to sync with backend',
      };
    }
  };

  const removeItem = (productId, variantId) => {
    dispatch(removeFromCart({ productId, variantId }));
  };

  const changeQuantity = (productId, variantId, quantity) => {
    dispatch(updateQuantity({ productId, variantId, quantity }));
  };

  const getCartTotal = () => {
    return items.reduce(
      (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
  };

  const getItemCount = () => {
    return items.length;
  };

  // 🚀 2. CREATE THE CLEAR CART FUNCTION
  const clearCart = () => {
    dispatch(clearCartAction());
  };

  return {
    items,
    addItem,
    removeItem,
    changeQuantity,
    getCartTotal,
    getItemCount,
    clearCart, // 🚀 3. EXPORT IT HERE SO CHECKOUT CAN USE IT
  };
};