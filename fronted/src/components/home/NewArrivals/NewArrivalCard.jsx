import React from 'react';
import ProductCard from '../../product/productcart';

const NewArrivalCard = ({ item }) => {
  return <ProductCard product={{ ...item.product, badge: 'New Arrival' }} />;
};

export default NewArrivalCard;
