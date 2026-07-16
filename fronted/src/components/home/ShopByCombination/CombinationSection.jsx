import React from 'react';
import { useCombinations } from '../../../hooks/useCombinations';
import CombinationCard from './CombinationCard';
import CombinationSkeleton from './CombinationSkeleton';

const CombinationSection = () => {
  const { combinations, loading, error } = useCombinations();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <p>Failed to load combinations. {error}</p>
      </div>
    );
  }

  if (!loading && combinations.length === 0) {
    return null; // Empty state handled silently to maintain flow
  }

  return (
    <section className="w-full bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2 md:mb-4">Shop by Combination</h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Discover curated furniture combinations perfectly designed for your complete room setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 w-full">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <CombinationSkeleton key={idx} />
            ))
          ) : (
            combinations.map((combo) => (
              <CombinationCard key={combo.id} combination={combo} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CombinationSection;
