import React from 'react';

const CombinationSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col space-y-4">
      <div className="bg-gray-200 h-64 md:h-80 w-full rounded-2xl"></div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
};

export default CombinationSkeleton;
