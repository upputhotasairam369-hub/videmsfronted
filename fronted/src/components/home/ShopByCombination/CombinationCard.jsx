import React from 'react';
import { Link } from 'react-router-dom';

const CombinationCard = ({ combination }) => {
  return (
    <Link 
      to={`/products?combination=${combination.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={combination.cover_image} 
          alt={combination.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
          {combination.products?.length || 0} Products
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{combination.title}</h3>
        {combination.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {combination.description}
          </p>
        )}
        <div className="inline-flex items-center text-[#f97316] font-semibold group-hover:text-[#ea580c] transition-colors">
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
