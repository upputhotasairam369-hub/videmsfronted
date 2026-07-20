import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  CreditCard,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  // =========================================================================
  // CUSTOM CHECKOUT LAYOUT
  // Hides the footer completely on the Cart and Checkout pages
  // =========================================================================
  if (location.pathname === '/cart' || location.pathname === '/checkout') {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Trust Badges */}
      <div className="bg-primary-800 py-2 md:py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <div className="flex items-center justify-center text-white">
              <Truck className="w-6 h-6 mr-2" />
              <div className="text-xs">
                <p className="font-semibold">Free Shipping</p>
                <p className="text-[10px] opacity-80">On orders above ₹10k</p>
              </div>
            </div>
            <div className="flex items-center justify-center text-white">
              <Shield className="w-6 h-6 mr-2" />
              <div className="text-xs">
                <p className="font-semibold">5 Years Warranty</p>
                <p className="text-[10px] opacity-80">On all furniture</p>
              </div>
            </div>
            <div className="flex items-center justify-center text-white">
              <RotateCcw className="w-6 h-6 mr-2" />
              <div className="text-xs">
                <p className="font-semibold">Easy Returns</p>
                <p className="text-[10px] opacity-80">7 days return policy</p>
              </div>
            </div>
            <Link to="/emi" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-white hover:text-primary-200 transition cursor-pointer">
              <CreditCard className="w-6 h-6 mr-2" />
              <div className="text-xs">
                <p className="font-semibold">No Cost EMI</p>
                <p className="text-[10px] opacity-80">Starting ₹999/month</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2 md:py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {/* About Us */}
          <div>
            <h4 className="text-white font-bold mb-2 md:mb-4 text-base tracking-wide uppercase">About Us</h4>
            <p className="text-xs text-gray-400 mb-2 md:mb-4 leading-relaxed">
              We design and craft premium wooden furniture to elevate your living spaces. Experience comfort, style, and durability in every piece.
            </p>
            <div className="flex space-x-3 mb-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/videmsfurnituree/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://wa.me/919676781007" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-2 md:mt-4"><span className="text-white font-medium">Contact:</span> +91 96767 81007</p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold mb-2 md:mb-4 text-base tracking-wide uppercase">Customer Service</h4>
            <ul className="space-y-1 md:space-y-2 text-xs text-gray-400">
              <li><Link to="/track-order" className="hover:text-brand-orange transition">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-brand-orange transition">Returns & Exchange</Link></li>
              <li><Link to="/warranty" className="hover:text-brand-orange transition">Warranty Policy</Link></li>
              <li><Link to="/faq" className="hover:text-brand-orange transition">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-brand-orange transition">Contact Us</Link></li>
              <li><Link to="/emi" className="hover:text-brand-orange transition">EMI Options</Link></li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h4 className="text-white font-bold mb-2 md:mb-4 text-base tracking-wide uppercase">Top Categories</h4>
            <ul className="space-y-1 md:space-y-2 text-xs text-gray-400">
              <li><Link to="/category/sofas" className="hover:text-brand-orange transition">Sofas</Link></li>
              <li><Link to="/category/beds" className="hover:text-brand-orange transition">Beds</Link></li>
              <li><Link to="/category/dining" className="hover:text-brand-orange transition">Dining</Link></li>
              <li><Link to="/category/office-tables-study-chair" className="hover:text-brand-orange transition">Office Tables & Study Chair</Link></li>

            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-2 md:mb-4 text-base tracking-wide uppercase">Newsletter</h4>
            <p className="text-xs text-gray-400 mb-2 md:mb-4 leading-relaxed">
              Subscribe to our newsletter and get exclusive offers and updates directly to your inbox.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded focus:outline-none focus:border-brand-orange transition text-xs"
              />
              <button
                type="submit"
                className="bg-brand-orange text-white px-3 py-2 rounded font-bold hover:bg-orange-600 transition tracking-wide text-xs"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-4 pt-3 md:mt-6 md:pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs">© 2026 Videm's Furniture . All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;