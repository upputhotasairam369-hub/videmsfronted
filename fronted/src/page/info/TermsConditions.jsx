import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const TermsConditions = () => {
  return (
    <InfoPageLayout 
      title="Terms & Conditions" 
      subtitle="The rules and guidelines for using the Videms Gallery platform."
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Acceptance of Terms</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        By accessing and using the Videms Gallery website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 mt-8">2. Intellectual Property</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        All content on this website, including text, graphics, logos, images, and software, is the property of Videms Gallery and is protected by international copyright laws. Unauthorized use or reproduction is strictly prohibited.
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 mt-8">3. Limitation of Liability</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Videms Gallery shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the services.
      </p>
    </InfoPageLayout>
  );
};

export default TermsConditions;
