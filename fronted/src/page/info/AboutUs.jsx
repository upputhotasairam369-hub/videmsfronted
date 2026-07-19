import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const AboutUs = () => {
  return (
    <InfoPageLayout 
      title="About Us" 
      subtitle="Discover the story behind Videms Furniture, where premium craftsmanship meets modern design."
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Story</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Founded with a vision to redefine luxury living, Videms Furniture has been curating and crafting premium furniture for discerning homes. Our journey began with a simple belief: furniture should be more than just functional; it should be a work of art that elevates your daily life.
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 mt-8">Our Craftsmanship</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        We partner with the finest artisans and use ethically sourced, high-quality materials to ensure that every piece we create stands the test of time. From the careful selection of woods to the precision of the joinery, our commitment to excellence is unwavering.
      </p>
    </InfoPageLayout>
  );
};

export default AboutUs;
