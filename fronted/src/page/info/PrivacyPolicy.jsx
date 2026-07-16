import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const PrivacyPolicy = () => {
  return (
    <InfoPageLayout 
      title="Privacy Policy" 
      subtitle="How we collect, use, and protect your personal information."
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Data Collection</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        We collect personal information such as your name, email address, and shipping address when you make a purchase or sign up for our newsletter. This data is essential for processing your orders and keeping you informed about our latest collections.
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 mt-8">Data Security</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        We implement industry-standard security measures, including SSL encryption, to ensure your data is protected against unauthorized access, alteration, or disclosure. We do not sell or rent your personal information to third parties.
      </p>
    </InfoPageLayout>
  );
};

export default PrivacyPolicy;
