import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const Blogs = () => {
  return (
    <InfoPageLayout 
      title="Videms Journal" 
      subtitle="Insights, trends, and inspiration for curating beautiful spaces."
    >
      <div className="text-center text-gray-500 py-12">
        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
        <p className="text-sm">We are preparing some wonderful articles for you. Stay tuned!</p>
      </div>
    </InfoPageLayout>
  );
};

export default Blogs;
