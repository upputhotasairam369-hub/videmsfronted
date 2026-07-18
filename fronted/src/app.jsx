// src/app.jsx
import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authslice';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer/Footer';
import MobileBottomNav from './components/layout/mobilebottomnav';
import ErrorBoundary from './components/common/errorboundary';

// Lazy load the page components for code-splitting
const HomePage = lazy(() => import('./page/homepage'));
const ProductPage = lazy(() => import('./page/productpage'));
const AllProductsPage = lazy(() => import('./page/allproductspage'));
const CartPage = lazy(() => import('./page/cartpage'));
const CheckoutPage = lazy(() => import('./page/checkoutpage'));
const LoginPage = lazy(() => import('./page/loginpage'));
const WishlistPage = lazy(() => import('./page/wishlist'));
const AccountPage = lazy(() => import('./page/accountpage'));

// Info Pages lazy loaded
const AboutUs = lazy(() => import('./page/info/AboutUs'));
const Blogs = lazy(() => import('./page/info/Blogs'));
const TwentyYearsOfTrust = lazy(() => import('./page/info/TwentyYearsOfTrust'));
const CancellationPolicy = lazy(() => import('./page/info/CancellationPolicy'));
const ServiceWarranty = lazy(() => import('./page/info/ServiceWarranty'));
const UsageCare = lazy(() => import('./page/info/UsageCare'));
const FAQ = lazy(() => import('./page/info/FAQ'));
const TermsConditions = lazy(() => import('./page/info/TermsConditions'));
const PrivacyPolicy = lazy(() => import('./page/info/PrivacyPolicy'));
const RefundPolicy = lazy(() => import('./page/info/RefundPolicy'));
const ShippingPolicy = lazy(() => import('./page/info/ShippingPolicy'));
const StoreLocator = lazy(() => import('./page/info/StoreLocator'));

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
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
              <div className="w-8 h-8 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
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
          </Suspense>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </ErrorBoundary>
  );
};

export default App;