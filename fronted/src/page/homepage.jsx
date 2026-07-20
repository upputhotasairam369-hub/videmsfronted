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
      title: 'Modern Sofas Collection',
      subtitle: 'Transform your space with our premium collection',
      tag: 'Best Seller',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=600&fit=crop',
      title: 'Cozy Beds & Essentials',
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

      {/* New Arrivals */}
      <NewArrivalSection />


      {/* Business Banner Section */}
      <BusinessBanner />

    </div>
  );
};

export default HomePage;
