import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const FAQ = () => {
  return (
    <InfoPageLayout 
      title="Frequently Asked Questions" 
      subtitle="Find quick answers to common questions about our products, shipping, and more."
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">How long will my order take to arrive?</h3>
          <p className="text-gray-600 leading-relaxed">
            Standard delivery takes 7-14 business days, depending on your location. Custom orders may take up to 4-6 weeks for production and delivery.
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Do you offer assembly services?</h3>
          <p className="text-gray-600 leading-relaxed">
            Yes, free professional assembly is provided for all orders at the time of delivery across major metropolitan areas.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Can I customize the fabric on a sofa?</h3>
          <p className="text-gray-600 leading-relaxed">
            Absolutely! Many of our seating collections offer a variety of premium fabrics and top-grain leathers. Please visit our store or contact support for customization options.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default FAQ;
