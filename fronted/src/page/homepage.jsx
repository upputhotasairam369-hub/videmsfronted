import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeroCarousel from '../components/home/herocarousel';
import CategorySection from '../components/home/Category/CategorySection';
import CombinationSection from '../components/home/ShopByCombination/CombinationSection';
import BestSellerSection from '../components/home/BestSellers/BestSellerSection';
import NewArrivalSection from '../components/home/NewArrivals/NewArrivalSection';
import { fetchProducts } from '../store/slices/productslice';

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch fresh products every time homepage loads (relies on the smart cache logic in productslice)
    dispatch(fetchProducts({ limit: 10, featured: true }));
  }, [dispatch]);

  // Running slides
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


  return (
    <div className="space-y-10 md:space-y-16 pb-16">
      <HeroCarousel slides={slides} />
      <CategorySection />
      
      {/* 1. Shop by Combination */}
      <CombinationSection />
      
      {/* 2. Our Bestsellers */}
      <BestSellerSection />

      <div className="container mx-auto px-4">
        <div className="bg-primary-50 rounded-2xl p-6 md:p-10 text-center flex flex-col items-center justify-center border border-primary-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
            Furnish Your Dream Home with EMI
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl">
            Experience the joy of premium furniture without the upfront cost. Pay in easy installments starting at ₹999/month with our No Cost EMI options.
          </p>

          <button
            className="bg-[#f97316] text-white px-8 py-3 rounded-md font-bold hover:bg-[#ea580c] transition-all duration-200 !outline-none focus:!outline-none focus-visible:!outline-none !ring-0"
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

      {/* 3. New Arrivals */}
      <NewArrivalSection />
    </div>
  );
};

export default HomePage;
