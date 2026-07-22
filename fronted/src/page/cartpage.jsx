import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Heart, Trash2, Tag, ChevronRight,
  ShoppingBag, CheckCircle2, XCircle, Info
} from 'lucide-react';
import { useCart } from '../hooks/usecart';
import { useWishlist } from '../hooks/useWishlist';
import { getImageUrl } from '../utils/helper';

const CartPage = () => {
  const navigate = useNavigate();

  const { items = [], removeItem, changeQuantity } = useCart();
  const wishlist = useWishlist() || {};

  const [pincode, setPincode] = useState(() => sessionStorage.getItem('delivery_pincode') || '');
  const [pinStatus, setPinStatus] = useState(null);

  const [couponCode, setCouponCode] = useState('SUMMER26');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'heart' });
  const toastTimer = useRef(null);

  const showToast = (message, type = 'heart') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ show: true, message, type });
    toastTimer.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  const handleCheckPincode = () => {
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPinStatus({ type: 'error', message: 'Please enter a valid 6-digit pincode.' });
      return false;
    }

    sessionStorage.setItem('delivery_pincode', pincode);
    setPinStatus({ type: 'success', message: 'Delivery available in your area!' });
    return true;
  };

  const handleProceedToCheckout = () => {
    const isValid = handleCheckPincode();
    if (isValid) {
      navigate('/checkout');
    } else {
      showToast("Please enter a valid delivery pincode to proceed.", 'error');
    }
  };

  // =========================================================================
  // 🚀 FIXED: ENFORCE INVENTORY WHEN MOVING FROM CART TO WISHLIST
  // =========================================================================
  const handleSaveForLater = (item) => {
    // Explicitly build the payload so we don't lose the stock limit
    const wishlistPayload = {
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      price: item.price,
      image: item.image,
      // 👇 THE CRITICAL DATA LINK:
      inventory_quantity: item.maxQuantity !== undefined ? item.maxQuantity : 5
    };

    if (wishlist.toggleItem) {
      wishlist.toggleItem(wishlistPayload);
    } else if (wishlist.addItem) {
      wishlist.addItem(wishlistPayload);
    }

    removeItem(item.productId, item.variantId);
    showToast(`Moved ${item.name || 'item'} to your Wishlist`, 'heart');
  };

  const validItems = items.filter(item => item && item.productId && String(item.productId) !== 'undefined');

  useEffect(() => {
    if (items.length > 0 && validItems.length === 0) {
      localStorage.removeItem('cart');
      window.location.reload();
    }
  }, [items.length, validItems.length]);

  const totalItems = validItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  let totalDiscountedPrice = 0;
  let totalMrp = 0;

  validItems.forEach(item => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    const mrp = Number(item.compare_price || item.mrp) || Math.round(price * 1.25);
    totalDiscountedPrice += (price * qty);
    totalMrp += (mrp * qty);
  });

  const baseDiscount = Math.max(0, totalMrp - totalDiscountedPrice);
  const couponDiscount = isCouponApplied && validItems.length > 0 ? Math.min(10750, totalDiscountedPrice) : 0;

  const finalPayable = Math.max(0, totalDiscountedPrice - couponDiscount);
  const totalSavings = baseDiscount + couponDiscount;

  if (validItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-lg w-full">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} className="text-[#f97316]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight">Your cart is empty</h2>
          <p className="text-sm md:text-base text-gray-500 mb-8">Looks like you haven't added any premium furniture to your cart yet.</p>

          <div className="flex flex-col gap-3">
            <Link to="/" className="inline-block bg-[#f97316] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition-all duration-300 w-full tracking-wide active:scale-[0.98] select-none border-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', boxShadow: 'none' }}>
              START SHOPPING
            </Link>
            <Link to="/wishlist" className="inline-flex items-center justify-center gap-2 bg-transparent text-gray-800 border border-gray-200 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 w-full tracking-wide active:scale-[0.98] select-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', boxShadow: 'none' }}>
              <Heart size={18} className="text-gray-400" />
              GO TO WISHLIST
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f5f7] min-h-screen py-6 md:py-8 font-sans relative overflow-hidden">
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none flex justify-center ${toast.show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
        <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-6 py-4 rounded-2xl flex items-center gap-3.5 w-max max-w-[90%] md:max-w-sm mx-4">
          {toast.type === 'heart' ? (
            <Heart size={22} className="text-[#f97316] fill-[#f97316] shrink-0" strokeWidth={2.5} />
          ) : (
            <Info size={22} className="text-[#ef4444] shrink-0" strokeWidth={2} />
          )}
          <span className="text-sm font-medium text-gray-800 tracking-tight">{toast.message}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-5 border-b border-gray-100 gap-4 md:gap-0">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                  <h1 className="text-lg md:text-xl font-bold text-gray-900">My Cart ({totalItems})</h1>
                  <Link to="/wishlist" className="flex items-center justify-center gap-1.5 text-gray-500 hover:text-orange-500 bg-gray-50 hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-orange-100 transition-all outline-none focus:outline-none focus:ring-0 select-none" title="View Wishlist">
                    <Heart size={18} />
                    <span className="text-xs font-bold tracking-wide uppercase hidden sm:block">Wishlist</span>
                  </Link>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1 w-full md:w-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                    <div className="flex items-center text-gray-600 shrink-0">
                      <MapPin size={18} className="mr-1" />
                      <span className="text-sm font-medium">Deliver To</span>
                    </div>
                    <div className={`flex items-center border rounded-lg overflow-hidden w-full sm:w-auto transition-all duration-300 ease-out ${pinStatus?.type === 'error' ? 'border-red-300 focus-within:ring-red-300 bg-red-50' : pinStatus?.type === 'success' ? 'border-green-300 focus-within:ring-green-300' : 'border-gray-300 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400'}`}>
                      <input type="text" placeholder="Enter Pincode" value={pincode} maxLength={6} onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '')); if (pinStatus) setPinStatus(null); }} className={`w-full sm:w-36 px-3 py-2 text-sm outline-none border-none focus:outline-none focus:ring-0 ${pinStatus?.type === 'error' ? 'bg-red-50' : 'bg-transparent'}`} />
                      <button onClick={handleCheckPincode} className="bg-transparent text-[#f97316] font-bold text-xs tracking-wide px-4 py-2 border-l border-gray-200 hover:bg-orange-50 active:bg-orange-100 transition-colors duration-200 select-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none shrink-0" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', boxShadow: 'none' }}>CHECK</button>
                    </div>
                  </div>
                  {pinStatus && (
                    <div className={`flex items-center gap-1 text-[11px] font-medium mt-1 ${pinStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                      {pinStatus.type === 'success' ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {pinStatus.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                {validItems.map((item, index) => {
                  const price = Number(item.price) || 0;
                  const mrp = Number(item.compare_price || item.mrp) || Math.round(price * 1.25);
                  const discountPercent = mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

                  const qty = Number(item.quantity) || 1;
                  const maxQty = item.maxQuantity !== undefined ? Number(item.maxQuantity) : 5;

                  return (
                    <div key={`${item.productId}_${item.variantId}_${index}`} className="group flex flex-col sm:flex-row p-4 sm:p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors duration-300 ease-in-out">
                      <div className="shrink-0 mb-4 sm:mb-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 w-full sm:w-32 h-48 sm:h-32">
                        <Link to={`/product/${item.productId}`} className="outline-none focus:outline-none border-none select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
                          <img loading="lazy" src={getImageUrl(item.image)} alt={item.name || 'Product Image'} className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-[1.04]" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'; }} />
                        </Link>
                      </div>

                      <div className="sm:ml-6 flex-1 flex flex-col justify-between">
                        <div>
                          <Link to={`/product/${item.productId}`} className="outline-none focus:outline-none border-none select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
                            <h3 className="text-base font-semibold text-gray-900 tracking-tight leading-snug group-hover:text-[#f97316] transition-colors duration-300">{item.name || 'Premium Furniture Item'}</h3>
                          </Link>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Variant: {String(item.variantId || '').replace('var_', '') || 'Default'}</p>

                          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-700 mr-3 hidden sm:inline-block">Qty.</span>
                              <div className="flex items-center border border-gray-300 rounded-lg bg-white transition-colors duration-200 hover:border-gray-400 overflow-hidden">

                                <button
                                  onClick={() => { if (qty > 1) changeQuantity(item.productId, item.variantId, qty - 1) }}
                                  disabled={qty <= 1}
                                  className={`w-8 h-8 flex items-center justify-center text-gray-600 transition-all duration-200 select-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none ${qty <= 1 ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-orange-50 hover:text-[#f97316] active:scale-90'}`}
                                  style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', boxShadow: 'none' }}
                                >-</button>

                                <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-gray-200">{qty}</span>

                                <button
                                  onClick={() => {
                                    if (qty < maxQty) {
                                      changeQuantity(item.productId, item.variantId, qty + 1);
                                    } else {
                                      showToast(`Only ${maxQty} units available in stock`, 'error');
                                    }
                                  }}
                                  disabled={qty >= maxQty}
                                  className={`w-8 h-8 flex items-center justify-center text-gray-600 transition-all duration-200 select-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none ${qty >= maxQty ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-orange-50 hover:text-[#f97316] active:scale-90'}`}
                                  style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', boxShadow: 'none' }}
                                >+</button>
                              </div>
                            </div>

                            <div className="flex flex-col">
                              {discountPercent > 0 && <span className="text-xs md:text-sm font-semibold tracking-wide text-[#22c55e] mb-0.5">Limited-Time Deal</span>}
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-gray-900">₹{(price * qty).toLocaleString('en-IN')}</span>
                                {mrp > price && <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">₹{(mrp * qty).toLocaleString('en-IN')}</span>}
                                {discountPercent > 0 && <span className="text-xs sm:text-sm font-bold text-[#22c55e]">{discountPercent}% OFF</span>}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-start gap-4 mt-6 pt-5 border-t border-gray-100 sm:border-0 sm:pt-0 sm:mt-auto">
                          <button onClick={() => handleSaveForLater(item)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 select-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none active:scale-[0.98] bg-transparent text-gray-800 border-none hover:bg-gray-50" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', boxShadow: 'none' }}>
                            <Heart size={16} className="text-gray-400" />
                            <span className="whitespace-nowrap">Save for Later</span>
                          </button>
                          <button onClick={() => removeItem(item.productId, item.variantId)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-red-500 bg-red-50 border-none hover:bg-red-100 transition-all duration-200 active:scale-[0.98] select-none !outline-none focus:!outline-none focus-visible:!outline-none !ring-0 !ring-offset-0 focus:!ring-0 !shadow-none" title="Remove from Cart" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', boxShadow: 'none' }}>
                            <Trash2 size={16} />
                            <span className="whitespace-nowrap">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4 md:sticky md:top-6">

            <div className="bg-white shadow-sm rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors duration-300 flex flex-col overflow-hidden">
              <div className="p-4 md:p-5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">Price Detail <span className="font-normal text-gray-500 text-sm">({totalItems} Items)</span></h3>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <div className="flex justify-between items-center text-sm font-medium text-gray-700"><span>MRP</span><span>₹{totalMrp.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-700"><span>Discount</span><span className="text-[#22c55e]">- ₹{baseDiscount.toLocaleString('en-IN')}</span></div>
                {isCouponApplied && (
                  <div className="flex justify-between items-center text-sm font-medium text-gray-700"><span>Coupon ({couponCode})</span><span className="text-[#22c55e]">- ₹{couponDiscount.toLocaleString('en-IN')}</span></div>
                )}
              </div>
              <div className="px-4 md:px-5 py-4 md:py-5 border-t border-gray-100 border-dashed bg-gray-50/50">
                <div className="flex justify-between items-start">
                  <span className="text-base font-semibold text-gray-900">Total Payable</span>
                  <div className="flex flex-col items-end">
                    <span className="text-lg md:text-xl font-bold text-gray-900">₹{finalPayable.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-gray-500 mt-1">Inclusive of all taxes</span>
                  </div>
                </div>
              </div>
              {totalSavings > 0 && (
                <div className="p-3 md:p-4 bg-[#f0fdf4] border-t border-[#bbf7d0]">
                  <p className="text-xs md:text-sm font-medium text-[#166534] text-center">Congratulations! You've Just saved ₹{totalSavings.toLocaleString('en-IN')} On Your Order.</p>
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-col gap-3 md:gap-4 mb-8 lg:mb-0">
              <p className="text-xs text-gray-500 text-center font-medium">EMI Starting ₹2,085/Month</p>
              <button onClick={handleProceedToCheckout} className="w-full bg-[#f97316] text-white py-2.5 md:py-3 rounded-lg text-sm font-semibold tracking-wide hover:bg-black active:scale-[0.98] transform transition-all duration-300 select-none border-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', boxShadow: 'none' }}>PLACE ORDER</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;