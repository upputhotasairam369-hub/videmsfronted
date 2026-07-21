import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
  Star,
} from 'lucide-react';
import { fetchProductDetail } from '../../store/slices/productslice';
import StockIndicator from './stockindicator';
import { useCart } from '../../hooks/usecart';
import LoadingSpinner from '../common/lodingspinner';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, loading } = useSelector((state) => state.products);
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
  const availableStock =
    (selectedVariant.inventory_quantity || 0) -
    (selectedVariant.inventory_reserved || 0);
  const isOutOfStock = availableStock <= 0;
  const discount = selectedVariant.compare_price
    ? Math.round(
        (1 - selectedVariant.price / selectedVariant.compare_price) * 100
      )
    : 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    await addItem(currentProduct, selectedVariant, quantity);
  };

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-4 overflow-x-auto scrollbar-hide">
          <span>Home</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="capitalize">{currentProduct.category}</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900 truncate">{currentProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden relative">
              <img
                src={
                  images[activeImage]?.url ||
                  'https://placehold.co/600x600/eaddd7/6f4e40?text=No+Image'
                }
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-brand-red text-white text-sm font-bold px-3 py-1 rounded">
                  {discount}% OFF
                </span>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition ${
                    idx === activeImage
                      ? 'border-primary-600'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                  {currentProduct.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                    <Star className="w-3.5 h-3.5 text-green-700 fill-green-700" />
                    <span className="text-xs font-semibold text-green-700 ml-1">
                      4.5
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">128 Reviews</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-0" style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-0" style={{ WebkitTapHighlightColor: 'transparent' }}>
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">
                ₹{selectedVariant.price.toLocaleString()}
              </span>
              {selectedVariant.compare_price && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    ₹{selectedVariant.compare_price.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-green-600">
                    Save ₹
                    {(
                      selectedVariant.compare_price - selectedVariant.price
                    ).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <StockIndicator
              productId={currentProduct._id}
              variantId={selectedVariant.variant_id}
              initialStock={availableStock}
            />

            {/* Variants */}
            {currentProduct.variants.length > 1 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Select Variant
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.variants.map((variant) => (
                    <button
                      key={variant.variant_id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg text-sm border-2 transition ${
                        selectedVariant.variant_id === variant.variant_id
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center border border-gray-200 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-gray-50 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(availableStock, quantity + 1))
                  }
                  className="p-2.5 hover:bg-gray-50 disabled:opacity-50"
                  disabled={quantity >= availableStock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 rounded-xl font-semibold text-base transition active:scale-[0.98] ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-700 text-white hover:bg-primary-800 shadow-lg shadow-primary-700/30'
                }`}
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>
              <button
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 rounded-xl font-semibold text-base transition active:scale-[0.98] ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-100 text-primary-800 hover:bg-amber-200'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-primary-600 mb-1" />
                <span className="text-xs font-medium">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-primary-600 mb-1" />
                <span className="text-xs font-medium">5 Yr Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <RotateCcw className="w-5 h-5 text-primary-600 mb-1" />
                <span className="text-xs font-medium">Easy Returns</span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {currentProduct.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
