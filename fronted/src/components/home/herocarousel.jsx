import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { publicAPI } from '../../services/api';

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🚀 FETCH DYNAMIC BANNERS FROM DJANGO
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await publicAPI.getBanners();
        if (data && data.length > 0) {
          setSlides(data);
        } else {
          // Fallback if you haven't added any banners in the Django Admin yet!
          setSlides([{
            id: 'fallback',
            title: 'Welcome to Videm\'s Gallery',
            subtitle: 'Discover our exclusive collection of hand-crafted pieces.',
            tag: 'New Collection',
            image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            link_url: '/products'
          }]);
        }
      } catch (error) {
        console.error("Failed to fetch banners", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    setTouchStart(null);
  };

  // 🚀 SMART IMAGE URL BUILDER
  // This ensures images from Django get the correct localhost:8000 prefix,
  // but external images (like unsplash) are left alone.
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin text-[#f97316] w-8 h-8" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <img
            src={getImageUrl(slide.image)}
            alt={slide.title}
            // 🚀 Added object-center to keep the focal point in the middle
            // If you want NO zooming at all (but you will get empty space on the sides), 
            // you can change object-cover to object-contain. 
            // But object-cover object-center is usually best for Hero banners!
            className="w-full h-full object-cover object-center"
            loading={index === 0 ? 'eager' : 'lazy'}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-12 left-4 md:bottom-20 md:left-12 lg:left-16 max-w-xl">
            <span className="inline-block px-3 py-1 bg-[#f97316] text-white text-xs font-bold uppercase tracking-wider rounded-sm mb-4">
              {slide.tag || 'Featured'}
            </span>
            <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-gray-200 text-sm md:text-lg mb-8 max-w-md">
                {slide.subtitle}
              </p>
            )}
            <button
              onClick={() => navigate(slide.link_url || '/products')}
              className="bg-[#f97316] text-white px-8 py-3.5 rounded-md font-bold text-sm md:text-base hover:bg-orange-600 transition active:scale-95 shadow-md outline-none border-none"
            >
              Shop The Collection
            </button>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition z-20 hidden sm:block outline-none border-none"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition z-20 hidden sm:block outline-none border-none"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all outline-none border-none ${index === current ? 'bg-[#f97316] w-6' : 'bg-white/60'
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;