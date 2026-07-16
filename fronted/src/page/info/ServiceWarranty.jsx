import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const ServiceWarranty = () => {
  return (
    <InfoPageLayout 
      title="Service Assurance & Warranty" 
      subtitle="Comprehensive coverage ensuring your furniture stays pristine for years."
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">5-Year Structural Warranty</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Every piece of Videms furniture comes with a comprehensive 5-year warranty against manufacturing defects in materials and workmanship. This covers structural issues, significant joint failures, and hardware malfunctions under normal residential use.
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 mt-8">Exclusions</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Please note that our warranty does not cover normal wear and tear, modifications made by the customer, damage caused by improper cleaning methods, or environmental factors such as prolonged exposure to direct sunlight or extreme humidity.
      </p>
    </InfoPageLayout>
  );
};

export default ServiceWarranty;
