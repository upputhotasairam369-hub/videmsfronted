import React from 'react';
import { useNavigate } from 'react-router-dom';

const MegaMenu = ({ category, onClose }) => {
  const navigate = useNavigate();

  const handleSubClick = (sub) => {
    navigate(`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`);
    onClose();
  };

  const handleMainClick = () => {
    navigate(`/products?category=${encodeURIComponent(category.name)}`);
    onClose();
  };

  return (
    <div
      className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 z-50 hidden md:block"
      onMouseEnter={() => { }}
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3">
            <h3
              className="text-lg font-semibold text-gray-900 mb-4 cursor-pointer hover:text-[#f97316] transition-colors"
              onClick={handleMainClick}
            >
              {category.name}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {category.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubClick(sub)}
                  className="group flex items-center p-3 rounded-lg hover:bg-gray-50 transition outline-none focus:outline-none border-none bg-transparent w-full text-left"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 flex-shrink-0 overflow-hidden">
                    <img
                      src={`https://placehold.co/100x100/d2bab0/4a3229?text=${sub[0]}`}
                      alt={sub}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#f97316]">
                    {sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Featured
              </p>
              <img
                src="https://placehold.co/300x200/fdf8f6/8a6252?text=New+Arrivals"
                alt="Featured"
                className="w-full rounded-md mb-2"
              />
              <p className="text-sm font-medium text-gray-900">
                New {category.name} Collection
              </p>
              <p className="text-xs text-gray-500 mt-1">Upto 40% Off</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;