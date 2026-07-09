import React from 'react';
import ProductCard from '../../product/productcart';

const BestSellerCard = ({ item }) => {
  // item is the HomepageBestSeller object. item.product contains the actual product data.
  // We attach a custom badge prop if the ProductCard supports it, otherwise it renders as usual.
  return <ProductCard product={{ ...item.product, badge: 'Bestseller' }} />;
};

export default BestSellerCard;
