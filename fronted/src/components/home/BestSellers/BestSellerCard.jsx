import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../../product/productcart';

const BestSellerCard = ({ item }) => {
  // Grab fully hydrated products from Redux
  const reduxProducts = useSelector((state) => state.products.items) || [];
  
  // Try to find the full product to ensure dynamic variants and images are present
  const productId = item.product?._id || item.product?.id || item.product;
  const hydratedProduct = reduxProducts.find(p => (p._id || p.id) === productId) || item.product;

  return <ProductCard product={{ ...hydratedProduct, badge: 'Bestseller' }} />;
};

export default BestSellerCard;
