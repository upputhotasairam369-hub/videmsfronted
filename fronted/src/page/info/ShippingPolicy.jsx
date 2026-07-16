import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const ShippingPolicy = () => {
  return (
    <InfoPageLayout 
      title="Shipping Policy" 
      subtitle="Fast, safe, and reliable delivery for your premium furniture."
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Delivery Timelines</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        We strive to deliver your furniture as quickly and safely as possible. Standard items in stock are typically dispatched within 3-5 business days and delivered within 7-14 business days. Custom orders are manufactured specifically for you and require 4-6 weeks for delivery.
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 mt-8">Shipping Charges</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Enjoy complimentary white-glove delivery and assembly on all orders above ₹10,000 within major metropolitan areas. For orders below this threshold or deliveries to remote locations, a nominal shipping fee will be calculated at checkout based on your pincode.
      </p>
    </InfoPageLayout>
  );
};

export default ShippingPolicy;
