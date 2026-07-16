import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/home/herocarousel';
import CategorySection from '../components/home/Category/CategorySection';
import CombinationSection from '../components/home/ShopByCombination/CombinationSection';
import BestSellerSection from '../components/home/BestSellers/BestSellerSection';
import NewArrivalSection from '../components/home/NewArrivals/NewArrivalSection';
import BusinessBanner from '../components/home/BusinessBanner';
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
    <div className="flex flex-col w-full pb-6 md:pb-8 bg-white">
      <HeroCarousel slides={slides} />
      <CategorySection />

      {/* Shop by Combination */}
      <CombinationSection />

      {/* Our Bestsellers */}
      <BestSellerSection />

      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        <div className="bg-primary-50 rounded-2xl p-8 md:p-12 lg:p-16 text-center flex flex-col items-center justify-center border border-primary-100 w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 tracking-tight">
            Furnish Your Dream Home with EMI
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the joy of premium furniture without the upfront cost. Pay in easy installments starting at ₹999/month with our No Cost EMI options.
          </p>

          <button
            className="bg-[#f97316] text-white px-8 md:px-10 py-3 md:py-4 rounded-md font-bold text-base md:text-lg hover:bg-[#ea580c] transition-all duration-200 !outline-none focus:!outline-none focus-visible:!outline-none !ring-0 shadow-sm"
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

      {/* Business Banner Section */}
      <BusinessBanner />

      {/* New Arrivals */}
      <NewArrivalSection />

    </div>
  );
};

export default HomePage;
