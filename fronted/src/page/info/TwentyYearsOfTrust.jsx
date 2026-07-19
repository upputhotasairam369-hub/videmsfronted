import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const TwentyYearsOfTrust = () => {
  return (
    <InfoPageLayout 
      title="20 Years of Trust" 
      subtitle="A legacy built on uncompromising quality and customer satisfaction."
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Two Decades of Excellence</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        For over 20 years, Videms Furniture has been synonymous with trust, durability, and exquisite design in the furniture industry. We have proudly served thousands of happy families, transforming houses into homes with our meticulously crafted pieces.
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 mt-8">Our Commitment</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Our longevity in this competitive market is a testament to our unwavering commitment to our customers. We source only the finest materials, employ generational craftsmanship, and ensure every product meets our rigorous quality standards before it reaches your door.
      </p>
    </InfoPageLayout>
  );
};

export default TwentyYearsOfTrust;
