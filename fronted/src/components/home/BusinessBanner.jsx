import React, { useState, useEffect } from 'react';
import { businessBannerAPI } from '../../services/api';
import BulkOrderModal from './BulkOrderModal';

const BusinessBanner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await businessBannerAPI.get();
        if (response.data && response.data.length > 0) {
          setBanner(response.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch business banner', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-8 animate-pulse">
        <div className="bg-gray-200 h-72 md:h-96 lg:h-[450px] rounded-2xl w-full"></div>
      </div>
    );
  }

  if (!banner) return null;

  // Smart URL Builder to fix HTTP/HTTPS and relative path issues
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('http://')) return imagePath.replace('http://', 'https://');
    return `https://videmsbackend-production.up.railway.app${imagePath}`;
  };

  return (
    <>
      {/* Added more padding on desktop to improve aspect ratio so cover doesn't crop too much */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-24 xl:px-40 py-8 md:py-12 relative group cursor-default">
        {/* Increased desktop height to lg:h-[550px] to give the image more vertical breathing room */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:shadow-3xl flex flex-col justify-center items-center text-center h-72 md:h-[400px] lg:h-[550px]"
          style={{
            backgroundImage: `url(${getImageUrl(banner.image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Glassmorphism overlay */}
          <div
            className="absolute inset-0"
            style={{ background: banner.gradient_overlay || 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))' }}
          ></div>

          <div className="relative z-10 p-6 md:p-12 max-w-3xl mx-auto flex flex-col items-center">
            <span className="text-white/80 text-xs md:text-sm lg:text-base font-semibold tracking-widest uppercase mb-4 opacity-0 transform translate-y-4 animate-[fade-in-up_0.8s_ease-out_forwards]">
              {banner.small_heading}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight opacity-0 transform translate-y-4 animate-[fade-in-up_1s_ease-out_0.2s_forwards]">
              {banner.title}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-8 max-w-2xl font-light opacity-0 transform translate-y-4 animate-[fade-in-up_1s_ease-out_0.4s_forwards]">
              {banner.subtitle}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-white text-sm md:text-base transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] opacity-0 transform translate-y-4 animate-[fade-in-up_1s_ease-out_0.6s_forwards] outline-none focus:outline-none"
              style={{ backgroundColor: banner.button_color || '#f97316' }}
            >
              {banner.button_text}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <BulkOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default BusinessBanner;
