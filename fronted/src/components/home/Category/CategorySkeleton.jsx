import React from 'react';

const CategorySkeleton = () => {
    return (
        <div className="animate-pulse flex flex-col gap-4 w-full">
            {/* Rectangular Image Placeholder maintaining aspect ratio */}
            <div className="w-full aspect-[4/5] bg-gray-200 rounded-xl shadow-sm"></div>
            {/* Title Placeholder */}
            <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mt-2"></div>
        </div>
    );
};

export default CategorySkeleton;