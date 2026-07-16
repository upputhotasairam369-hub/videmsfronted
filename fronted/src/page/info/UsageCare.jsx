import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const UsageCare = () => {
  return (
    <InfoPageLayout 
      title="Usage & Care" 
      subtitle="Expert advice on maintaining the beauty and longevity of your furniture."
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">General Maintenance</h2>
      <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
        <li>Dust frequently with a clean, soft, dry, lint-free cloth.</li>
        <li>Avoid using silicone-based polishes or harsh chemical cleaners.</li>
        <li>Keep furniture away from direct sunlight to prevent fading.</li>
        <li>Maintain a consistent humidity level in your home to prevent wood from warping or cracking.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 mt-8">Fabric & Leather Care</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        For upholstered items, vacuum weekly to prevent dust from settling into the fibers. For spills, blot immediately with a clean, absorbent cloth—do not rub. For deep cleaning, we recommend professional upholstery cleaning services. Leather should be conditioned every 6-12 months using a specialized premium leather conditioner.
      </p>
    </InfoPageLayout>
  );
};

export default UsageCare;
