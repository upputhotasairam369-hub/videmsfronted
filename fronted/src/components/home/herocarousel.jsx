import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { publicAPI } from '../../services/api';
import { fetchProducts } from '../../store/slices/productslice';

const HeroCarousel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
            title: 'Welcome to Videm\'s Furniture',
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
  // Handles 3 cases: full HTTPS URLs, relative paths from Django, and HTTP→HTTPS upgrade
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // Already a full HTTPS URL — use as-is
    if (imagePath.startsWith('https://')) return imagePath;
    // HTTP URL from Django serializer — upgrade to HTTPS
    if (imagePath.startsWith('http://')) return imagePath.replace('http://', 'https://');
    // Relative path (e.g. /media/banners/...) — prepend the backend origin
    return `https://videmsbackend-production.up.railway.app${imagePath}`;
  };

  if (loading) {
    return (
      <div className="w-full h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-[60vh] xl:h-[65vh] flex items-center justify-center bg-gray-100 border-b border-gray-200">
        <Loader2 className="animate-spin text-[#f97316] w-8 h-8" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-[60vh] xl:h-[65vh] overflow-hidden bg-gray-100 border-b border-gray-200 shadow-sm"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          role="button"
          tabIndex={0}
          aria-label={`Navigate to ${slide.title}`}
          onClick={() => {
            const dest = slide.link_url || '/products';
            if (dest.startsWith('http')) window.location.href = dest;
            else navigate(dest);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const dest = slide.link_url || '/products';
              if (dest.startsWith('http')) window.location.href = dest;
              else navigate(dest);
            }
          }}
          onMouseEnter={() => {
            if (slide.link_url === '/products' || !slide.link_url) {
              dispatch(fetchProducts({ page: 1, limit: 20 }));
            }
          }}
          className={`group absolute inset-0 cursor-pointer overflow-hidden transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-105"
            style={{ backgroundImage: `url('${getImageUrl(slide.image)}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-12 left-4 md:bottom-20 md:left-12 lg:left-16 max-w-xl">
            <span className="inline-block px-3 py-1 bg-[#f97316] text-white text-xs font-bold uppercase tracking-wider rounded-sm mb-4">
              {slide.tag || 'Featured'}
            </span>
            <h2 className="text-white text-2xl md:text-fluid-h1 font-black mb-3 md:mb-4 leading-tight drop-shadow-lg">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-gray-200 text-sm md:text-fluid-base mb-4 md:mb-8 max-w-md drop-shadow-md">
                {slide.subtitle}
              </p>
            )}
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