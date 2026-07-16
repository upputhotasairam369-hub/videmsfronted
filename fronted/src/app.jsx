// src/app.jsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authslice';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer/Footer';
import MobileBottomNav from './components/layout/mobilebottomnav';
import HomePage from './page/homepage';
import ProductPage from './page/productpage';
import AllProductsPage from './page/allproductspage';
import CartPage from './page/cartpage';
import CheckoutPage from './page/checkoutpage';
import LoginPage from './page/loginpage';
import WishlistPage from './page/wishlist';
import ErrorBoundary from './components/common/errorboundary';
import AccountPage from './page/accountpage';

// Info Pages
import AboutUs from './page/info/AboutUs';
import Blogs from './page/info/Blogs';
import TwentyYearsOfTrust from './page/info/TwentyYearsOfTrust';
import CancellationPolicy from './page/info/CancellationPolicy';
import ServiceWarranty from './page/info/ServiceWarranty';
import UsageCare from './page/info/UsageCare';
import FAQ from './page/info/FAQ';
import TermsConditions from './page/info/TermsConditions';
import PrivacyPolicy from './page/info/PrivacyPolicy';
import RefundPolicy from './page/info/RefundPolicy';
import ShippingPolicy from './page/info/ShippingPolicy';
import StoreLocator from './page/info/StoreLocator';
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<AllProductsPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            
            {/* Info Page Routes */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/twenty-years-of-trust" element={<TwentyYearsOfTrust />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="/service-warranty" element={<ServiceWarranty />} />
            <Route path="/usage-care" element={<UsageCare />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/store-locator" element={<StoreLocator />} />
          </Routes>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </ErrorBoundary>
  );
};

export default App;