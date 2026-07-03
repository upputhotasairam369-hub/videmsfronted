import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeroCarousel from '../components/home/herocarousel';
import PromoBanner from '../components/home/promobanner';
import CategoryGrid from '../components/home/catergorygrid';
import ProductGrid from '../components/home/productgrid';
import { fetchProducts } from '../store/slices/productslice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, featured } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 10, featured: true }));
  }, [dispatch]);

  // Running slides // 
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=600&fit=crop',
      title: 'Modern Living Room Sets',
      subtitle: 'Transform your space with our premium collection',
      tag: 'Best Seller',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=600&fit=crop',
      title: 'Cozy Bedroom Essentials',
      subtitle: 'Sleep in comfort and style',
      tag: 'New',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&h=600&fit=crop',
      title: 'Elegant Dining Collection',
      subtitle: 'Make every meal memorable',
      tag: 'Trending',
    },
  ];

  // Shop by the category //
  const categories = [
    {
      id: 1,
      name: 'Sofas',
      slug: 'sofas',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    },
    {
      id: 2,
      name: 'Beds',
      slug: 'beds',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop',
    },
    {
      id: 3,
      name: 'Dining',
      slug: 'dining',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=400&fit=crop',
    },
    {
      id: 4,
      name: 'Wardrobes',
      slug: 'wardrobes',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
    },
    {
      id: 5,
      name: 'Study',
      slug: 'study',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop',
    },
  ];

  return (
    <div className="space-y-10 md:space-y-16 pb-16">
      <HeroCarousel slides={slides} />

      {/* 🚀 Duplicate buttons removed from here! It just calls your CategoryGrid directly now. */}
      <CategoryGrid categories={categories} />

      <ProductGrid
        title="Bestsellers"
        subtitle="Customer favorites this month"
        products={items?.slice(0, 8) || []}
      />

      <div className="container mx-auto px-4">
        <div className="bg-primary-50 rounded-2xl p-6 md:p-10 text-center flex flex-col items-center justify-center border border-primary-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
            Furnish Your Dream Home with EMI
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl">
            Experience the joy of premium furniture without the upfront cost. Pay in easy installments starting at ₹999/month with our No Cost EMI options.
          </p>

          <button
            className="bg-[#f97316] text-white px-8 py-3 rounded-md font-bold hover:bg-[#ea580c] transition-all duration-200 !outline-none focus:!outline-none focus-visible:!outline-none !ring-0 !ring-offset-0 focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 select-none border-0 bg-clip-padding !shadow-none"
            style={{
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            Explore EMI Options
          </button>
        </div>
      </div>

      <ProductGrid
        title="Trending Furniture"
        subtitle="Fresh designs for your home"
        products={items?.slice(2, 6) || []}
      />
    </div>
  );
};

export default HomePage;