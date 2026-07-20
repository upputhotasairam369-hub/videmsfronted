import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SocialIcons from './SocialIcons';
import FooterColumn from './FooterColumn';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/cart' || location.pathname === '/checkout') {
    return null;
  }

  const customerServiceLinks = [
    { label: 'Cancellation Policy', path: '/cancellation-policy' },
    { label: 'Service Assurance / Warranty', path: '/service-warranty' },
    { label: 'Usage & Care', path: '/usage-care' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Terms & Conditions', path: '/terms-conditions' },
  ];

  const aboutUsLinks = [
    { label: 'About Us', path: '/about-us' },
    { label: 'Blogs', path: '/blogs' },
    { label: '20 Years of Trust', path: '/twenty-years-of-trust' },
  ];

  return (
    <footer className="bg-[#2F3640] text-[#C8D0D8] border-t border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-24 py-12 xs:py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 xs:gap-x-6 xs:gap-y-12 md:gap-12 lg:gap-16">
          
          {/* Section 1: Company Info */}
          <div className="flex flex-col">
            <Link to="/" className="mb-6 inline-block">
              <h1 className="text-fluid-base lg:text-fluid-lg font-black tracking-tight text-[#FFFFFF] flex items-center gap-2">
                <img src="https://i.postimg.cc/q7hqkqwB/568094498-17843891301597329-6427631544708793099-n.jpg" alt="Videm's Furniture" className="h-10 w-10 object-cover rounded-md" />
                Videm's <span className="text-[#f97316]">Furniture</span>
              </h1>
            </Link>
            <p className="text-[#C8D0D8] text-fluid-sm leading-relaxed mb-6 xs:mb-8 font-light">
              India's trusted destination for stylish & affordable furniture. Elevating living spaces with premium craftsmanship.
            </p>
            <SocialIcons />
          </div>

          {/* Section 2: Customer Service */}
          <FooterColumn title="Customer Service" links={customerServiceLinks} />

          {/* Section 3: About Videms */}
          <FooterColumn title="About Videms" links={aboutUsLinks} />

          {/* Section 4: Contact Us */}
          <div className="flex flex-col">
            <h4 className="text-[#FFFFFF] font-bold text-fluid-base lg:text-fluid-lg mb-4 xs:mb-6 tracking-wide uppercase">Contact Us</h4>
            <div className="space-y-3 xs:space-y-4 text-[#C8D0D8] text-fluid-sm font-light">
              <p className="flex flex-col">
                <span className="text-xs text-[#C8D0D8] opacity-80 uppercase tracking-wider font-semibold mb-1">Email Support</span>
                <a href="mailto:videmsfurniture@gmail.com" className="hover:text-[#F97316] transition-colors duration-300">
                  videmsfurniture@gmail.com
                </a>
              </p>
              <p className="flex flex-col">
                <span className="text-xs text-[#C8D0D8] opacity-80 uppercase tracking-wider font-semibold mb-1">Phone Support</span>
                <a href="tel:08069252525" className="hover:text-[#F97316] transition-colors duration-300">
                  080 6925 2525
                </a>
              </p>
              <p className="flex flex-col">
                <span className="text-xs text-[#C8D0D8] opacity-80 uppercase tracking-wider font-semibold mb-1">Availability</span>
                <span>10:00 AM – 6:00 PM</span>
              </p>
              <div className="pt-4">
                <Link to="/store-locator" className="block w-full sm:w-auto text-center border border-gray-600 hover:border-[#F97316] hover:text-[#F97316] text-[#FFFFFF] px-4 xs:px-6 py-3 md:py-2.5 rounded-full transition-all duration-300 text-fluid-sm tracking-wide bg-transparent">
                  Store Locator
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Section 6: Footer Bottom */}
      <div className="border-t border-[#1E272E] bg-[#1E272E]">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#C8D0D8] text-fluid-sm text-center w-full md:w-auto order-2 md:order-1 mt-4 md:mt-0">
            © 2026 Videms Furniture. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-3 xs:gap-4 md:gap-8 text-fluid-sm text-[#C8D0D8] order-1 md:order-2 w-full md:w-auto">
            <Link to="/privacy-policy" className="hover:text-[#F97316] transition-colors duration-300">Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:text-[#F97316] transition-colors duration-300">Refund Policy</Link>
            <Link to="/shipping-policy" className="hover:text-[#F97316] transition-colors duration-300">Shipping Policy</Link>
            <Link to="/terms-conditions" className="hover:text-[#F97316] transition-colors duration-300">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
