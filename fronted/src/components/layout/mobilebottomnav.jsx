import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useCart } from '../../hooks/usecart';
import { useWishlist } from '../../hooks/useWishlist'; // 🚀 1. Imported the hook

const MobileBottomNav = () => {
  const location = useLocation();
  const { getItemCount } = useCart();
  const { items: wishlistItems = [] } = useWishlist(); // 🚀 2. Grab wishlist items
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    // 🚀 3. Added the badge count logic here!
    { icon: Heart, label: 'Wishlist', path: '/wishlist', badge: wishlistItems.length },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: getItemCount() },
    {
      icon: User,
      label: 'Account',
      path: isAuthenticated ? '/account' : '/login',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden safe-area-pb">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center w-full h-full relative"
            >
              <div className="relative">
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-primary-700' : 'text-gray-500'
                    }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#dc2626] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 ${isActive ? 'text-primary-700 font-medium' : 'text-gray-500'
                  }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;