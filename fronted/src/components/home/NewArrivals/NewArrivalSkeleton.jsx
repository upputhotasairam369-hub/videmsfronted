import React from 'react';

const NewArrivalSkeleton = () => {
  return (
    <div className="animate-pulse bg-white p-4 rounded-xl border border-gray-100 flex flex-col space-y-3">
      <div className="bg-gray-200 h-48 w-full rounded-lg"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-2"></div>
    </div>
  );
};

export default NewArrivalSkeleton;
