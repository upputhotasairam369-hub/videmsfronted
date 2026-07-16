import React from 'react';
import { useNewArrivals } from '../../../hooks/useNewArrivals';
import NewArrivalCard from './NewArrivalCard';
import NewArrivalSkeleton from './NewArrivalSkeleton';
import { Link } from 'react-router-dom';

const NewArrivalSection = () => {
  const { newArrivals, loading, error } = useNewArrivals();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <p>Failed to load New Arrivals. {error}</p>
      </div>
    );
  }

  if (!loading && newArrivals.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 border-b border-gray-100 pb-4 md:pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">New Arrivals</h2>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-500">Fresh designs for your home</p>
          </div>
          <Link to="/products" className="mt-4 md:mt-0 text-sm md:text-base font-bold text-[#f97316] hover:text-[#ea580c] flex items-center uppercase tracking-wide transition">
            View All Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 w-full">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <NewArrivalSkeleton key={idx} />
            ))
          ) : (
            newArrivals.map((item) => (
              <NewArrivalCard key={item.id} item={item} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalSection;
