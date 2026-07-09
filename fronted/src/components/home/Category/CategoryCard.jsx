import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    const imageUrl = category.cover_image || 'https://placehold.co/400x500?text=No+Image';

    return (
        <Link
            to={`/shop/${category.slug}`}
            className="group flex flex-col block cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 rounded-xl"
            aria-label={`Shop ${category.name} category`}
        >
            <div className="relative overflow-hidden rounded-xl shadow-sm transition-all duration-300 group-hover:shadow-2xl aspect-[4/5] bg-gray-100">
                <img
                    src={imageUrl}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {/* Optional subtle overlay for premium feel */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>

            <h3 className="mt-5 text-center text-lg md:text-xl font-medium text-gray-800 transition-colors duration-300 group-hover:text-gray-500">
                {category.name}
            </h3>
        </Link>
    );
};

export default CategoryCard;