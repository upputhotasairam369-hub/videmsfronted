import React, { useEffect, useState } from 'react';
import { useInventory } from '../../hooks/useinventory';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const getStockStatus = (stock) => {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'in_stock';
};

const StockIndicator = ({ productId, variantId, initialStock }) => {
  const [stock, setStock] = useState(initialStock ?? 0);
  const [status, setStatus] = useState(getStockStatus(initialStock ?? 0));

  useInventory(productId);

  useEffect(() => {
    const nextStock = initialStock ?? 0;
    setStock(nextStock);
    setStatus(getStockStatus(nextStock));
  }, [initialStock]);

  useEffect(() => {
    const handleStockUpdate = (event) => {
      if (
        event.detail?.productId === productId &&
        event.detail?.variantId === variantId
      ) {
        const nextStock = event.detail.availableStock ?? 0;
        setStock(nextStock);
        setStatus(getStockStatus(nextStock));
      }
    };

    window.addEventListener('stockUpdate', handleStockUpdate);
    return () => window.removeEventListener('stockUpdate', handleStockUpdate);
  }, [productId, variantId]);

  const config = {
    out_of_stock: {
      icon: AlertCircle,
      text: 'Sold Out',
      className: 'text-red-600 font-semibold',
    },
    low_stock: {
      icon: Clock,
      text: `Only ${stock} left`,
      className: 'text-orange-600 font-medium',
    },
    in_stock: {
      icon: CheckCircle,
      text: 'In Stock',
      className: 'text-green-700',
    },
  };

  const { icon: Icon, text, className } = config[status];

  return (
    <span className={`flex items-center gap-1 text-xs ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {text}
    </span>
  );
};

export default StockIndicator;
