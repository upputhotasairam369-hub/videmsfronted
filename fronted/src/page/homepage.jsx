import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/home/herocarousel';
import CategorySection from '../components/home/Category/CategorySection';
import CombinationSection from '../components/home/ShopByCombination/CombinationSection';
import BestSellerSection from '../components/home/BestSellers/BestSellerSection';
import NewArrivalSection from '../components/home/NewArrivals/NewArrivalSection';
import { fetchProducts } from '../store/slices/productslice';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Smart cache in productslice handles deduplication automatically
    dispatch(fetchProducts({ limit: 10, featured: true }));
  }, [dispatch]);

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

  // ✅ FIX #3: PREFETCH on hover - start loading before user navigates
  const handleShopCollectionHover = () => {
    console.log('🎯 User hovering - prefetching all products');
    // This will fetch ALL products, but Redux cache logic prevents duplicate calls
    dispatch(fetchProducts({ limit: 20 }));
  };

  const handleShopCollectionClick = () => {
    navigate('/products');
  };

  return (
    <div className="space-y-10 md:space-y-16 pb-16">
      <HeroCarousel slides={slides} />
      <CategorySection />
      
      {/* Shop by Combination */}
      <CombinationSection />
      
      {/* Our Bestsellers */}
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

      {/* New Arrivals */}
      <NewArrivalSection />

      {/* 🎯 SHOP THE COLLECTION SECTION WITH PREFETCH */}
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Ready to Shop?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our complete collection of premium furniture handpicked for your home.
          </p>
          <button
            onMouseEnter={handleShopCollectionHover}
            onTouchStart={handleShopCollectionHover}
            onClick={handleShopCollectionClick}
            className="bg-white text-[#f97316] px-8 py-3.5 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 !outline-none !border-none !ring-0 !shadow-none"
            style={{
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            Shop the Collection →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
