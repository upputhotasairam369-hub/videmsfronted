import React, { useState, useEffect, useRef } from 'react';
import { useCombinations } from '../../../hooks/useCombinations';
import CombinationCard from './CombinationCard';
import CombinationSkeleton from './CombinationSkeleton';

const CombinationSection = () => {
  const { combinations, loading, error } = useCombinations();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Removed auto-scroll useEffect as requested

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const card = scrollRef.current.children[0];
      const scrollAmount = card ? card.clientWidth + 16 : clientWidth;
      const index = Math.round(scrollLeft / scrollAmount);
      setActiveIndex(index);
    }
  };

  const scrollToDot = (index) => {
    if (scrollRef.current) {
      const card = scrollRef.current.children[0];
      const scrollAmount = card ? card.clientWidth + 16 : scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: index * scrollAmount, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

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
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <h2 className="text-[clamp(1.25rem,3.5vw,2rem)] font-bold text-gray-900 tracking-tight">
            Exclusive Combo Collections
          </h2>
          <p className="mt-2 md:mt-3 text-[clamp(0.875rem,2vw,1.125rem)] text-gray-500 max-w-2xl mx-auto">
            Thoughtfully paired furniture sets with exclusive savings, only at Videm's.
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 lg:gap-8 w-full pb-4 md:pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <CombinationSkeleton key={idx} />
              ))
            ) : (
              combinations.map((combo, idx) => (
                <CombinationCard 
                  key={combo.id} 
                  combination={combo} 
                  isActive={activeIndex === idx} 
                />
              ))
            )}
          </div>
          
          {/* Navigation Dots */}
          {!loading && combinations.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 md:mt-6">
              {combinations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToDot(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    activeIndex === idx 
                      ? 'w-6 md:w-8 h-2 md:h-2.5 bg-[#f97316]' 
                      : 'w-2 md:w-2.5 h-2 md:h-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CombinationSection;
