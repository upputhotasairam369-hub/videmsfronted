import React from 'react';
import { useBestSellers } from '../../../hooks/useBestSellers';
import BestSellerCard from './BestSellerCard';
import BestSellerSkeleton from './BestSellerSkeleton';

const BestSellerSection = () => {
  const { bestSellers, loading, error } = useBestSellers();

  if (error) {
    return (
      <div className="text-center py-10 text-[clamp(0.875rem,2vw,1.125rem)] text-gray-500 font-medium bg-white rounded-lg mx-3 md:mx-0 shadow-sm border border-gray-100">
        <p>Failed to load Bestsellers. {error}</p>
      </div>
    );
  }

  if (!loading && bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white">
      <div className="max-w-screen-2xl mx-auto px-2 md:px-6 lg:px-8 py-3 md:py-5 lg:py-6">
        <div className="flex flex-col items-center text-center mb-3 md:mb-5">
          <h2 className="text-[clamp(1.25rem,3.5vw,2rem)] font-bold text-gray-900 tracking-tight">
            Our Bestsellers
          </h2>
          <p className="mt-2 md:mt-3 text-[clamp(0.875rem,2vw,1.125rem)] text-gray-500 max-w-2xl mx-auto px-4">
            Customer favorites, loved for their timeless style and exceptional quality.
          </p>
        </div>

        {/* Products Carousel */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-2 md:gap-3 lg:gap-4 w-full pb-2 md:pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="w-[calc(50%-0.25rem)] md:w-[calc(25%-0.5625rem)] flex-shrink-0 snap-start">
                <BestSellerSkeleton />
              </div>
            ))
          ) : (
            bestSellers.map((item) => (
              <div key={item.id} className="w-[calc(50%-0.25rem)] md:w-[calc(25%-0.5625rem)] flex-shrink-0 snap-start">
                <BestSellerCard item={item} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
