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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop by Combination</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover curated furniture combinations perfectly designed for your complete room setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
