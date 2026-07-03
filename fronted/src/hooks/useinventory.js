import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateProductStock } from '../store/slices/productslice';
import { InventoryService } from '../services/inventoryservices';

export const useInventory = (productId) => {
  const dispatch = useDispatch();
  const serviceRef = useRef(null);

  useEffect(() => {
    if (!productId) return;

    const handleUpdate = (data) => {
      const detail = {
        productId: data.product_id,
        variantId: data.variant_id,
        availableStock: data.available_stock,
      };

      dispatch(
        updateProductStock({
          productId: detail.productId,
          variantId: detail.variantId,
          availableStock: detail.availableStock,
        })
      );

      window.dispatchEvent(new CustomEvent('stockUpdate', { detail }));
    };

    serviceRef.current = new InventoryService(productId, handleUpdate);
    serviceRef.current.connect();

    return () => {
      if (serviceRef.current) {
        serviceRef.current.disconnect();
      }
    };
  }, [productId, dispatch]);
};
