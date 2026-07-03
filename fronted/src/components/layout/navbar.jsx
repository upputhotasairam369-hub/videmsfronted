import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, Heart, Home, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux'; // 🚀 Imported Redux hook
import { useCart } from '../../hooks/usecart';
import { useWishlist } from '../../hooks/useWishlist';

const Navbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMobileCat, setActiveMobileCat] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const desktopSearchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🚀 Fetch Authentication State
  const { isAuthenticated } = useSelector((state) => state.auth);
  // 🚀 THE FIX: Import the items array, and simply count the unique rows (length)
  const { items: cartItems = [] } = useCart();
  const cartCount = cartItems.length;

  const { items: wishlistItems = [] } = useWishlist();
  const wishlistCount = wishlistItems.length;

  const navCategories = ['LIVING ROOM', 'BEDROOM', 'DINING', 'STUDY'];

  const megaMenuData = {
    'LIVING ROOM': [
      { title: 'Sofas', links: ['Fabric Sofas', 'Wooden Sofas', 'L-Shaped Sofas', 'Sofa Cum Beds', 'Recliners'] },
      { title: 'Seating', links: ['Lounge Chairs', 'Accent Chairs', 'Wing Chairs', 'Benches', 'Pouffes'] },
      { title: 'Tables', links: ['Coffee Tables', 'Side Tables', 'Console Tables', 'End Tables'] },
      { title: 'Storage', links: ['TV Units', 'Bookshelves', 'Display Units', 'Shoe Racks'] }
    ],
    'BEDROOM': [
      { title: 'Beds', links: ['Solid Wood Beds', 'Upholstered Beds', 'Beds with Storage', 'King Size Beds', 'Queen Size Beds'] },
      { title: 'Storage', links: ['Wardrobes', 'Chest of Drawers', 'Bedside Tables', 'Dressers'] },
      { title: 'Mattresses', links: ['Memory Foam', 'Orthopedic', 'Dual Comfort', 'Coir Mattresses'] }
    ],
    'DINING': [
      { title: 'Dining Sets', links: ['4 Seater Dining Sets', '6 Seater Dining Sets', '8 Seater Dining Sets', 'Extendable Dining'] },
      { title: 'Dining Storage', links: ['Crockery Units', 'Kitchen Cabinets', 'Sideboards'] },
      { title: 'Dining Decor', links: ['Table Linens', 'Coasters', 'Dining Serveware'] }
    ],
    'STUDY': [
      { title: 'Study Tables', links: ['Solid Wood Tables', 'Computer Tables', 'Foldable Tables'] },
      { title: 'Office Chairs', links: ['Ergonomic Chairs', 'Executive Chairs', 'Study Chairs'] },
      { title: 'Office Storage', links: ['File Cabinets', 'Office Bookcases', 'Wall Shelves'] }
    ]
  };

  const toTitleCase = (str) =>
    str.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsSearchActive(false);
    setIsMenuOpen(false);
    setActiveMobileCat(null);
  }, [location.pathname]);

  const handleDesktopSearchSubmit = (e) => {
    e.preventDefault();
    if (desktopSearchInputRef.current?.value.trim()) {
      navigate(`/products?search=${encodeURIComponent(desktopSearchInputRef.current.value)}`);
      desktopSearchInputRef.current.value = '';
    }
  };

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (mobileSearchInputRef.current?.value.trim()) {
      navigate(`/products?search=${encodeURIComponent(mobileSearchInputRef.current.value)}`);
      setIsSearchActive(false);
      mobileSearchInputRef.current.value = '';
    }
  };

  const toggleMobileSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) setTimeout(() => mobileSearchInputRef.current?.focus(), 150);
  };

  const toggleMobileCategory = (category) => {
    setActiveMobileCat(activeMobileCat === category ? null : category);
  };

  if (location.pathname === '/cart' || location.pathname === '/checkout') {
    return (
      <header className={`w-full sticky top-0 z-50 border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'bg-white/75 backdrop-blur-lg shadow-md' : 'bg-white shadow-sm'}`}>
        <div className="container mx-auto px-4 py-2 relative flex items-center justify-between">
          <div className="flex items-center gap-3 h-8">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-[#f97316] transition-all outline-none focus:outline-none focus:ring-0 border-none shadow-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <ArrowLeft size={22} strokeWidth={1.5} />
            </button>
            <Link to="/" className="flex items-center gap-2 outline-none focus:outline-none focus:ring-0 border-none select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
              <img src="https://i.postimg.cc/q7hqkqwB/568094498-17843891301597329-6427631544708793099-n.jpg" alt="Logo" className="h-7 w-7 md:h-8 md:w-8 object-cover rounded-md hidden sm:block" />
              <h1 className="text-lg md:text-xl font-black tracking-tight text-gray-900">Videm's <span className="text-[#f97316]">Gallery</span></h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center flex-1 max-w-lg mx-8 h-8">
            <button
              onClick={() => navigate('/cart')}
              className={`text-base font-medium outline-none focus:outline-none focus:ring-0 cursor-pointer hover:opacity-80 transition-opacity border-none shadow-none ${location.pathname === '/cart' ? 'text-[#f97316] font-semibold' : 'text-[#f97316]'}`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Cart
            </button>
            <div className="flex-1 border-t border-dashed border-gray-300 mx-3 mt-0.5"></div>
            <div className={`text-base font-medium select-none ${location.pathname === '/checkout' ? 'text-[#f97316] font-semibold' : 'text-gray-500'}`}>Address</div>
            <div className="flex-1 border-t border-dashed border-gray-300 mx-3 mt-0.5"></div>
            <div className="text-base font-medium text-gray-800 select-none">Payment</div>
          </div>
          <div className="hidden lg:flex flex-col text-right justify-center h-8">
            <span className="text-[11px] text-gray-600 tracking-wide leading-tight select-none">Have Questions? We're Here To Help</span>
            <span className="text-sm text-[#f97316] font-bold tracking-wide leading-tight select-none">Call : +91-9314444747</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-white shadow-sm'}`}>

        <div className={`w-full py-1 border-b border-gray-200 transition-colors duration-300 ${isScrolled ? 'bg-transparent' : 'bg-gray-50'}`}>
          <p className="text-center text-[10px] md:text-xs text-gray-700 select-none">
            Free Shipping on Orders Above ₹10,000 | <span className="text-[#f97316] font-semibold">Use Code: VIDEM10</span>
          </p>
        </div>

        <div className="container mx-auto px-4 py-2 relative flex items-center justify-between">
          <button
            className="md:hidden p-1 z-20 text-gray-700 hover:text-[#f97316] transition-colors outline-none focus:outline-none focus:ring-0 border-none shadow-none"
            onClick={() => setIsMenuOpen(true)}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Menu size={24} />
          </button>

          <Link
            to="/"
            className="group absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 z-10 flex items-center gap-2 outline-none focus:outline-none focus:ring-0 border-none select-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <img src="https://i.postimg.cc/q7hqkqwB/568094498-17843891301597329-6427631544708793099-n.jpg" alt="Videm's Gallery Logo" className="h-7 w-7 md:h-8 md:w-8 object-cover rounded-md" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight whitespace-nowrap">
              <span className="text-gray-900 group-hover:text-[#f97316] transition-colors duration-300">Videm's</span>{' '}
              <span className="text-[#f97316] group-hover:text-gray-900 transition-colors duration-300">Gallery</span>
            </h1>
          </Link>

          <form onSubmit={handleDesktopSearchSubmit} className="hidden md:flex flex-1 max-w-2xl mx-8 h-9">
            <input
              ref={desktopSearchInputRef}
              type="text"
              placeholder="Search for furniture and more..."
              className="flex-1 h-full bg-gray-100 text-sm text-gray-800 outline-none rounded-l-md px-4 focus:ring-1 focus:ring-[#f97316] transition-all border-none"
            />
            <button type="submit" className="h-9 w-11 flex-shrink-0 flex items-center justify-center bg-[#f97316] text-white rounded-r-md hover:bg-[#e8600a] transition-colors outline-none focus:outline-none focus:ring-0 border-none shadow-none select-none">
              <Search size={18} />
            </button>
          </form>

          <div className="flex items-center z-20">
            <div className="flex md:hidden items-center gap-1">
              <button onClick={toggleMobileSearch} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-orange-50 hover:text-[#f97316] transition-all duration-300 outline-none focus:outline-none focus:ring-0 border-none shadow-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
                <Search size={20} />
              </button>
              {/* 🚀 Updated Mobile Inner Profile Link */}
              <Link to={isAuthenticated ? "/account" : "/login"} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-orange-50 hover:text-[#f97316] transition-all duration-300 outline-none focus:outline-none focus:ring-0 border-none shadow-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
                <User size={20} className={isAuthenticated ? "text-[#f97316]" : ""} />
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-1 lg:gap-3 flex-shrink-0">
              {/* 🚀 Updated Desktop Profile Link */}
              <Link to={isAuthenticated ? "/account" : "/login"} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-orange-50 hover:text-[#f97316] transition-all duration-300 outline-none focus:outline-none focus:ring-0 border-none shadow-none" title="Profile" style={{ WebkitTapHighlightColor: 'transparent' }}>
                <User size={22} className={isAuthenticated ? "text-[#f97316]" : ""} />
              </Link>

              <Link to="/wishlist" className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-orange-50 hover:text-[#f97316] transition-all duration-300 outline-none focus:outline-none focus:ring-0 border-none shadow-none" title="Wishlist" style={{ WebkitTapHighlightColor: 'transparent' }}>
                <div className="relative flex items-center justify-center">
                  <Heart size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#f97316] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </div>
              </Link>

              <Link to="/cart" className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-orange-50 hover:text-[#f97316] transition-all duration-300 outline-none focus:outline-none focus:ring-0 border-none shadow-none" title="Cart" style={{ WebkitTapHighlightColor: 'transparent' }}>
                <div className="relative flex items-center justify-center">
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#f97316] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-md p-2 transition-all duration-300 origin-top ${isSearchActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
          <form onSubmit={handleMobileSearchSubmit} className="flex items-center h-9 w-full">
            <input ref={mobileSearchInputRef} type="text" placeholder="Search for furniture..." className="flex-1 h-full bg-gray-100 text-sm text-gray-800 outline-none rounded-l-md px-4 focus:ring-1 focus:ring-[#f97316] border-none" />
            <button type="submit" className="h-9 w-11 flex-shrink-0 flex items-center justify-center bg-[#f97316] text-white rounded-r-md hover:bg-[#e8600a] transition-colors outline-none focus:outline-none focus:ring-0 border-none shadow-none select-none">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Desktop Category Nav + Mega Menu */}
        <div className={`hidden md:block w-full border-t border-gray-100 relative transition-colors duration-300 ${isScrolled ? 'bg-transparent' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-12">
              {navCategories.map((category) => (
                <li key={category} className="group py-2.5">
                  <Link
                    to={`/products?category=${encodeURIComponent(toTitleCase(category))}`}
                    className="relative text-xs font-bold text-gray-800 group-hover:text-[#f97316] tracking-wide transition-colors inline-block outline-none focus:outline-none focus:ring-0 border-none select-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {category}
                    <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-[#f97316] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full"></span>
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute left-0 top-full w-full bg-white shadow-xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="container mx-auto px-12 py-6 flex justify-start gap-16">
                      {megaMenuData[category]?.map((column) => (
                        <div key={column.title} className="flex flex-col min-w-[150px]">
                          <Link
                            to={`/products?category=${encodeURIComponent(toTitleCase(category))}&subcategory=${encodeURIComponent(column.title)}`}
                            className="text-gray-900 font-bold mb-3 uppercase text-xs tracking-wider border-b border-gray-200 pb-2 hover:text-[#f97316] transition-colors outline-none focus:outline-none select-none block"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            {column.title}
                          </Link>
                          <ul className="space-y-2.5">
                            {column.links.map((link) => (
                              <li key={link}>
                                <Link
                                  to={`/products?category=${encodeURIComponent(toTitleCase(category))}&subcategory=${encodeURIComponent(link)}`}
                                  className="text-gray-500 hover:text-[#f97316] text-xs transition-colors block outline-none focus:outline-none focus:ring-0 border-none select-none"
                                  style={{ WebkitTapHighlightColor: 'transparent' }}
                                >
                                  {link}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden flex flex-col shadow-2xl">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-[#f97316] transition-colors outline-none focus:outline-none focus:ring-0 border-none shadow-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <X size={26} />
            </button>
            <div className="flex items-center gap-2 select-none">
              <img src="https://i.postimg.cc/q7hqkqwB/568094498-17843891301597329-6427631544708793099-n.jpg" alt="Logo" className="h-7 w-7 object-cover rounded-md" />
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                Videm's <span className="text-[#f97316]">Gallery</span>
              </h1>
            </div>
            <div className="w-7"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-24">
            {navCategories.map((mainCat) => (
              <div key={mainCat} className="border-b border-gray-100 last:border-none">
                <button
                  onClick={() => toggleMobileCategory(mainCat)}
                  className="w-full flex items-center justify-between py-3.5 text-left font-bold text-gray-900 text-sm uppercase tracking-wide outline-none focus:outline-none focus:ring-0 border-none shadow-none"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span>{mainCat}</span>
                  {activeMobileCat === mainCat ? <ChevronUp size={18} className="text-[#f97316]" /> : <ChevronDown size={18} />}
                </button>

                <div className={`transition-all duration-300 overflow-hidden ${activeMobileCat === mainCat ? 'max-h-[1000px] opacity-100 pb-3' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-3 pl-2">
                    {megaMenuData[mainCat]?.map((group) => (
                      <div key={group.title}>
                        <Link
                          to={`/products?category=${encodeURIComponent(toTitleCase(mainCat))}&subcategory=${encodeURIComponent(group.title)}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-xs font-bold text-[#f97316] uppercase tracking-wide mb-2 mt-1 select-none block outline-none focus:outline-none border-none"
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          {group.title}
                        </Link>
                        <ul className="space-y-2 pl-3 border-l-2 border-gray-100">
                          {group.links.map((link) => (
                            <li key={link}>
                              <Link
                                to={`/products?category=${encodeURIComponent(toTitleCase(mainCat))}&subcategory=${encodeURIComponent(link)}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="group relative inline-block text-xs text-gray-600 hover:text-[#f97316] transition-colors py-1 outline-none focus:outline-none focus:ring-0 border-none select-none"
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                              >
                                {link}
                                <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-[#f97316] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full"></span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-2 pt-2 px-2">
        <div className="flex items-center justify-around">
          <Link to="/" className="group relative flex flex-col items-center gap-1 text-gray-500 hover:text-[#f97316] transition-colors w-16 py-1 outline-none focus:outline-none focus:ring-0 border-none select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <Home size={20} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
            <span className="text-[9px] font-medium">Home</span>
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#f97316] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-1/2"></span>
          </Link>
          <button onClick={toggleMobileSearch} className="group relative flex flex-col items-center gap-1 text-gray-500 hover:text-[#f97316] transition-colors w-16 py-1 outline-none focus:outline-none focus:ring-0 border-none select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <Search size={20} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
            <span className="text-[9px] font-medium">Search</span>
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#f97316] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-1/2"></span>
          </button>

          <Link to="/wishlist" className="group relative flex flex-col items-center gap-1 text-gray-500 hover:text-[#f97316] transition-colors w-16 py-1 outline-none focus:outline-none focus:ring-0 border-none select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <div className="relative">
              <Heart size={20} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#f97316] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-medium">Wishlist</span>
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#f97316] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-1/2"></span>
          </Link>

          <Link to="/cart" className="group relative flex flex-col items-center gap-1 text-gray-500 hover:text-[#f97316] transition-colors w-16 py-1 outline-none focus:outline-none focus:ring-0 border-none select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <div className="relative">
              <ShoppingCart size={20} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#f97316] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-medium">Cart</span>
            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#f97316] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-1/2"></span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;