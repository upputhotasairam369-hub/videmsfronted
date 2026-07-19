import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Share2, Minus, Plus, ChevronRight, Star, CheckCircle2, Truck, Shield, RotateCcw } from 'lucide-react';
import { fetchProductDetail } from '../store/slices/productslice';
import StockIndicator from '../components/product/stockindicator';
import { useCart } from '../hooks/usecart';
import { useWishlist } from '../hooks/useWishlist';
import LoadingSpinner from '../components/common/lodingspinner';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, loading } = useSelector((state) => state.products);

  const { addItem } = useCart();
  const wishlist = useWishlist() || {};

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // 🚀 State for Toast Notifications and Ref for Image Scrolling
  const [toast, setToast] = useState({ show: false, message: '' });
  const imageScrollRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProductDetail(slug));
  }, [slug, dispatch]);

  useEffect(() => {
    if (currentProduct?.variants?.length > 0) {
      setSelectedVariant(currentProduct.variants[0]);
    }
  }, [currentProduct]);

  if (loading || !currentProduct) return <LoadingSpinner />;
  if (!selectedVariant) return null;

  const images = currentProduct.images || [];
  const availableStock = (selectedVariant.inventory_quantity || 0) - (selectedVariant.inventory_reserved || 0);
  const isOutOfStock = availableStock <= 0;

  const discount = selectedVariant.compare_price
    ? Math.round((1 - selectedVariant.price / selectedVariant.compare_price) * 100)
    : 0;

  const isInWishlist = wishlist.items?.some(
    item => String(item.productId) === String(currentProduct._id || currentProduct.id)
  );

  // --- UI Toast Helper ---
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // --- Functional Share Button ---
  const handleShare = async () => {
    const shareData = {
      title: currentProduct.name,
      text: `Check out this ${currentProduct.name} at Videm's Furniture!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled by user");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  // --- Scrollable Image Syncing ---
  const handleImageScroll = (e) => {
    if (!imageScrollRef.current) return;
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImage) {
      setActiveImage(newIndex);
    }
  };

  const scrollToImage = (index) => {
    setActiveImage(index);
    if (imageScrollRef.current) {
      imageScrollRef.current.scrollTo({
        left: index * imageScrollRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleWishlistToggle = () => {
    const pId = currentProduct._id || currentProduct.id;
    const vId = selectedVariant.variant_id || 'default';

    if (isInWishlist) {
      if (wishlist.removeItem) wishlist.removeItem(pId, vId);
    } else {
      if (wishlist.toggleItem) {
        wishlist.toggleItem({
          productId: pId,
          variantId: vId,
          name: currentProduct.name,
          price: selectedVariant.price,
          image: images[0]?.url || '',
          inventory_quantity: availableStock
        });
      }
      showToast('Added to Wishlist!');
    }
  };

  // --- Split Cart and Buy Now Logic ---
  const handleAddToCart = async (isBuyNow = false) => {
    if (isOutOfStock) return;
    const normalizedProduct = {
      ...currentProduct,
      _id: currentProduct._id || currentProduct.id,
      inventory_quantity: availableStock,
    };
    const variantPayload = {
      ...selectedVariant,
      variant_id: selectedVariant.variant_id || selectedVariant.id,
      inventory_quantity: availableStock,
    };

    await addItem(normalizedProduct, variantPayload, quantity);

    if (isBuyNow) {
      navigate('/cart');
    } else {
      showToast('Item added to your cart!');
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-0 relative">

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-400 ease-out pointer-events-none flex justify-center ${toast.show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
        <div className="bg-gray-900 text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 w-max">
          <CheckCircle2 size={18} className="text-green-400 shrink-0" />
          <span className="text-sm font-medium tracking-wide">{toast.message}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">

        <nav className="flex items-center text-sm text-gray-500 mb-4 overflow-x-auto scrollbar-hide">
          <span>Home</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="capitalize">{currentProduct.category}</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900 truncate">{currentProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

          {/* Image Carousel Section */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
              {/* Horizontal Scroll Snap Container */}
              <div
                ref={imageScrollRef}
                onScroll={handleImageScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              >
                {images.length > 0 ? images.map((img, idx) => (
                  <div key={idx} className="min-w-full h-full snap-center shrink-0">
                    <img
                      src={img.url}
                      alt={`${currentProduct.name} - View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )) : (
                  <div className="min-w-full h-full snap-center shrink-0 flex items-center justify-center">
                    <img src="https://placehold.co/600x600/eaddd7/6f4e40?text=No+Image" alt="Placeholder" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Discount Badge */}
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow-sm z-10 pointer-events-none">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToImage(idx)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition outline-none border-none ${idx === activeImage ? 'border-[#f97316]' : 'border-transparent'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  {currentProduct.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 text-green-700 fill-green-700" />
                    <span className="text-sm font-semibold text-green-700 ml-1">4.5</span>
                  </div>
                  <span className="text-sm text-gray-500">128 Reviews</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleWishlistToggle} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all outline-none border-none">
                  <Heart className={`w-5 h-5 transition-colors ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                <button onClick={handleShare} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 outline-none border-none">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{Number(selectedVariant.price).toLocaleString('en-IN')}
              </span>
              {selectedVariant.compare_price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{Number(selectedVariant.compare_price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    Save ₹{(selectedVariant.compare_price - selectedVariant.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            <StockIndicator
              productId={currentProduct._id || currentProduct.id}
              variantId={selectedVariant.variant_id}
              initialStock={availableStock}
            />


            {/* 🚀 DYNAMIC DESCRIPTION: Controlled by Django Admin */}
            {currentProduct.description && (
              <div className="pt-6 border-t border-gray-100 mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Product Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {currentProduct.description}
                </p>
              </div>
            )}


            {/* Actions (Add to Cart + Buy Now) */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 rounded-xl font-bold text-base tracking-wide transition active:scale-[0.98] outline-none border-none ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black shadow-md'}`}
              >
                {isOutOfStock ? 'SOLD OUT' : 'ADD TO CART'}
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 rounded-xl font-bold text-base tracking-wide transition active:scale-[0.98] outline-none border-none ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#f97316] text-white hover:bg-[#e8600a] shadow-md'}`}
              >
                BUY NOW
              </button>
            </div>

            {/* 🚀 RESTORED: Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 mt-6">
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-[#f97316] mb-1" />
                <span className="text-xs font-medium">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-[#f97316] mb-1" />
                <span className="text-xs font-medium">5 Yr Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <RotateCcw className="w-5 h-5 text-[#f97316] mb-1" />
                <span className="text-xs font-medium">Easy Returns</span>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;