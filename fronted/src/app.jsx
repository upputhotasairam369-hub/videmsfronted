// src/app.jsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authslice';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer';
import MobileBottomNav from './components/layout/mobilebottomnav';
import HomePage from './page/homepage';
import ProductPage from './page/productpage';
import AllProductsPage from './page/allproductspage';
import CartPage from './page/cartpage';
import CheckoutPage from './page/checkoutpage';
import LoginPage from './page/loginpage';
import WishlistPage from './page/wishlist';
import AdminDashboard from './page/admindashboard';
import ErrorBoundary from './components/common/errorboundary';
import AccountPage from './page/accountpage'; // 🚀 Import the new page!

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
            {/* 🚀 Add the Account Route to prevent the blank screen crash */}
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </ErrorBoundary>
  );
};

export default App;