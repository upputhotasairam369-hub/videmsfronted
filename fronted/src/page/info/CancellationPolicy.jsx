import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const CancellationPolicy = () => {
  return (
    <InfoPageLayout 
      title="Cancellation & Returns" 
      subtitle="Simple, transparent policies designed with your peace of mind in focus."
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Order Cancellations</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Orders can be cancelled free of charge within 24 hours of placement. After this window, as our furniture often enters the production or dispatch phase, a nominal cancellation fee of 10% may apply. Custom-made orders cannot be cancelled once production has commenced.
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 mt-8">Returns & Exchanges</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        We offer a 7-day hassle-free return policy for standard items that arrive damaged or defective. Please ensure the item is unused and in its original packaging. Contact our support team with photographic evidence, and we will arrange a replacement or refund promptly.
      </p>
    </InfoPageLayout>
  );
};

export default CancellationPolicy;
