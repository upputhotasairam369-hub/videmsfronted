import React from 'react';
import { Link } from 'react-router-dom';

const CombinationCard = ({ combination, isActive = true }) => {
  return (
    <Link 
      to={`/products?combination=${combination.slug}`}
      className={`group flex flex-col w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[28vw] flex-shrink-0 snap-center block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 ease-out transform ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'} md:hover:-translate-y-1`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={combination.cover_image} 
          alt={combination.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
          {combination.products?.length || 0} Products
        </div>
      </div>
      <div className="p-2 md:p-3">
        <h3 className="text-[clamp(1rem,3vw,1.25rem)] font-bold text-gray-900 mb-0.5">{combination.title}</h3>
        {combination.description && (
          <p className="text-gray-500 text-[clamp(0.75rem,1.5vw,0.875rem)] line-clamp-2 mb-1.5">
            {combination.description}
          </p>
        )}
        <div className="inline-flex items-center text-[#f97316] text-sm md:text-base font-semibold group-hover:text-[#ea580c] transition-colors">
          Explore Collection 
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default CombinationCard;
