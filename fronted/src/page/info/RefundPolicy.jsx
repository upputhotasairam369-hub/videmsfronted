import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const RefundPolicy = () => {
  return (
    <InfoPageLayout 
      title="Refund Policy" 
      subtitle="Clear and straightforward refund procedures."
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Eligibility for Refunds</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Refunds are issued for items that are returned within 7 days of delivery in their original, unused condition. Custom-made, personalized, or clearance items are final sale and not eligible for refunds unless they arrive damaged or defective.
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 mt-8">Refund Process</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. Approved refunds will be processed automatically to your original method of payment within 5-7 business days. Please note that shipping costs are non-refundable.
      </p>
    </InfoPageLayout>
  );
};

export default RefundPolicy;
