import React, { useState, memo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, CheckCircle2, Clock, Check } from 'lucide-react';
import { useCart } from '../../hooks/usecart';
import { useWishlist } from '../../hooks/useWishlist';

const ProductCard = memo(({ product }) => {
  const { items: cartItems = [], addItem } = useCart();

  const wishlist = useWishlist() || {};
  const wishlistItems = wishlist.items || [];

  const navigate = useNavigate();

  // ── Popup State ──
  const [popup, setPopup] = useState({ show: false, message: '', actionText: '', link: '' });

  const showPopup = (message, actionText, link) => {
    setPopup({ show: true, message, actionText, link });
    setTimeout(() => setPopup({ show: false, message: '', actionText: '', link: '' }), 2500);
  };

  const _id = product?._id || product?.id || product?.productId || Math.random().toString();
  const name = product?.name || product?.title || 'Premium Furniture';
  const finish = product?.finish || 'Premium Finish';
  const slug = product?.slug || _id;

  const primaryVariant = product?.variants?.[0] || {};
  const safePrice = Number(primaryVariant?.price || product?.price) || 0;
  const safeMrp = Number(primaryVariant?.compare_price || product?.mrp || product?.compare_price) || 0;

  // Track stock constraints directly from the database schema structures
  const availableStock = (primaryVariant?.inventory_quantity || 0) - (primaryVariant?.inventory_reserved || 0);
  const isOutOfStock = availableStock <= 0;

  let displayImage = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80';
  if (product?.images?.length > 0) {
    const primaryImgObj = product.images.find(img => img.is_primary) || product.images[0];
    displayImage = primaryImgObj?.url || primaryImgObj || displayImage;
  } else if (product?.imageUrl || product?.image) {
    displayImage = product.imageUrl || product.image;
  }

  const discountPercent = safeMrp > 0 && safeMrp > safePrice ? Math.round(((safeMrp - safePrice) / safeMrp) * 100) : 0;

  const inCart = cartItems.some(item => String(item.productId) === String(_id));
  const isInWishlist = wishlistItems.some(item => String(item.productId) === String(_id));

  const selectedVariantId = primaryVariant?.variant_id || primaryVariant?.id || 'default';

  // =========================================================================
  // 🚀 FIXED: ENFORCE INVENTORY QUANTITY WHEN ADDING TO WISHLIST
  // =========================================================================
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      if (wishlist.removeItem) {
        wishlist.removeItem(_id, selectedVariantId);
      }
    } else {
      // 🚀 The Fix is here: We must pass 'availableStock' so the wishlist remembers it!
      if (wishlist.addItem) {
        wishlist.addItem(_id, selectedVariantId, name, safePrice, displayImage, availableStock);
      } else if (wishlist.toggleItem) {
        wishlist.toggleItem({
          productId: _id,
          variantId: selectedVariantId,
          name,
          price: safePrice,
          image: displayImage,
          inventory_quantity: availableStock // 🚀 Dynamic database limit saved to local storage
        });
      }
      showPopup('Item added to wishlist', 'VIEW WISHLIST', '/wishlist');
    }
  };

  // =========================================================================
  // 🚀 FIXED: ENFORCE INVENTORY QUANTITY FROM PRODUCT CARD ENDPOINTS
  // =========================================================================
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;
    if (inCart) {
      navigate('/cart');
      return;
    }

    // Pass down the available stock configurations into the normalization schema
    const normalizedProduct = {
      ...product,
      _id: _id,
      name: name,
      price: safePrice,
      slug: slug,
      images: [{ url: displayImage }],
      inventory_quantity: availableStock // Enforces database limit natively
    };

    const selectedVariant = {
      variant_id: selectedVariantId,
      price: safePrice,
      compare_price: safeMrp,
      inventory_quantity: availableStock // 🚀 Dynamic database stock value bound to payload context
    };

    // Card buttons default to initial item increment addition of 1
    addItem(normalizedProduct, selectedVariant, 1);
    showPopup('Item added to cart', 'GO TO CART', '/cart');
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group relative">
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer">
          <Link to={`/product/${slug}`} className="outline-none focus:outline-none border-none select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <img
              src={displayImage}
              alt={name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80';
              }}
            />
          </Link>

          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-[#dc2626] text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm tracking-wide pointer-events-none">
              {discountPercent}% OFF
            </div>
          )}

          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full
              backdrop-blur-md
              hover:scale-110 active:scale-95
              transition-all duration-300
              appearance-none !outline-none focus:!outline-none focus-visible:!outline-none
              !ring-0 !ring-offset-0 !border-0 select-none z-10
              ${isInWishlist
                ? 'bg-white/90 opacity-100'
                : 'bg-white/70 opacity-100 hover:bg-white/90'
              }`}
            style={{
              WebkitTapHighlightColor: 'transparent',
              boxShadow: isInWishlist
                ? '0 4px 16px rgba(239,68,68,0.35), 0 2px 6px rgba(0,0,0,0.15)'
                : '0 4px 14px rgba(0,0,0,0.15), 0 2px 5px rgba(0,0,0,0.1)',
              border: 'none',
              outline: 'none',
            }}
            aria-label="Toggle Wishlist"
          >
            <Heart
              size={15}
              strokeWidth={2}
              className={`transition-all duration-300 ${isInWishlist
                ? 'fill-[#ef4444] text-[#ef4444] scale-110'
                : 'fill-transparent text-gray-400 group-hover/heart:text-[#ef4444]'
                }`}
            />
          </button>
        </div>

        <div className="p-2 md:p-3 flex flex-col flex-grow">
          <Link to={`/product/${slug}`} className="block outline-none focus:outline-none border-none select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <h3 className="text-fluid-base font-bold text-gray-900 group-hover:text-[#f97316] transition-colors duration-200 truncate">
              {name}
            </h3>
          </Link>
          <p className="text-fluid-sm text-gray-500 mt-0.5 mb-2 truncate">{finish}</p>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-fluid-lg font-bold text-gray-900">₹{safePrice.toLocaleString('en-IN')}</span>
            {safeMrp > safePrice && (
              <span className="text-sm font-medium text-gray-400 line-through">₹{safeMrp.toLocaleString('en-IN')}</span>
            )}
          </div>

          <div className="mb-3 mt-auto">
            {!isOutOfStock ? (
              <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-[#16a34a] select-none">
                <CheckCircle2 size={14} /> In Stock
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-[#dc2626] select-none">
                <Clock size={14} /> Out of Stock
              </div>
            )}
          </div>

          <button
            onClick={inCart ? (e) => { e.preventDefault(); navigate('/cart'); } : handleAddToCart}
            disabled={isOutOfStock && !inCart}
            className={`w-full py-1.5 md:py-2 min-h-8 md:min-h-9 rounded-md flex items-center justify-center gap-2 font-semibold text-xs md:text-sm transition-all duration-300 select-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none ${inCart
              ? 'bg-[#10b981] text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:bg-[#059669] border border-transparent'
              : isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-white/80 backdrop-blur-md text-gray-800 border border-gray-200 hover:bg-white hover:shadow-md hover:text-[#f97316]'
              }`}
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            {inCart ? 'Go to Cart' : isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Toast Popup rendered via Portal to prevent parent transform bugs */}
      {popup.show && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 left-0 right-0 mx-auto z-[9999] bg-[#222222] text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center justify-between gap-3 w-max max-w-[90vw] animate-fade-in-up">
          <span className="text-xs font-medium tracking-wide">
            {popup.message}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(popup.link);
            }}
            className="px-4 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 select-none border-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none bg-[#f97316] text-white hover:bg-[#ea6c0a]"
            style={{
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              boxShadow: 'none',
            }}
          >
            {popup.actionText}
          </button>
        </div>,
        document.body
      )}
    </>
  );
});

export default ProductCard;