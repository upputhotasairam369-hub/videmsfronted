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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-sm md:text-base text-gray-500 mt-2">Fresh designs for your home</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-[#f97316] hover:text-[#ea580c] hidden md:flex items-center uppercase tracking-wide transition">
            View All Collection
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
