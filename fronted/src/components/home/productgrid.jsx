import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../product/productcart';

const ProductGrid = ({ title, products, subtitle }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6 md:mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm md:text-base text-gray-500 mt-2">{subtitle}</p>
            )}
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-brand-orange hover:text-orange-600 hidden md:flex items-center uppercase tracking-wide transition"
          >
            View All Collection
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <Link
          to="/products"
          className="w-full mt-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 md:hidden hover:bg-gray-50 uppercase tracking-wide flex justify-center transition"
        >
          View All Collection
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;
