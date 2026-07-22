import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/usecart';
import { getImageUrl } from '../utils/helper';

const WishlistPage = () => {
    const navigate = useNavigate();
    const { items: rawWishlistItems = [], removeItem, clearWishlist } = useWishlist() || {};
    const { addItem, items: cartItems = [] } = useCart();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validWishlistItems = Array.isArray(rawWishlistItems)
        ? rawWishlistItems.filter(item => item && item.productId && String(item.productId) !== 'undefined')
        : [];

    const [toast, setToast] = useState({ show: false, message: '' });
    const toastTimer = useRef(null);

    const showToast = (message) => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToast({ show: true, message });
        toastTimer.current = setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 2500);
    };

    useEffect(() => {
        return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
    }, []);

    // =========================================================================
    // 🚀 BULLETPROOF MOVE TO CART LOGIC
    // =========================================================================
    const handleMoveToCart = async (item) => {
        // 1. Build the Normalized Product Payload
        const normalizedProduct = {
            _id: item.productId,
            name: item.name || 'Premium Furniture',
            price: Number(item.price) || 0,
            images: [{ url: item.image || '' }],
            // Strictly enforce the inventory quantity passed from the Product Page
            inventory_quantity: item.inventory_quantity
        };

        // 2. Build the Variant Payload
        const selectedVariant = {
            variant_id: item.variantId || 'default',
            price: Number(item.price) || 0,
            inventory_quantity: item.inventory_quantity
        };

        // 3. Dispatch to Cart & Remove from Wishlist
        await addItem(normalizedProduct, selectedVariant, 1);
        removeItem(item.productId, item.variantId);
        showToast(`${item.name || 'Item'} moved to cart`);
    };

    if (validWishlistItems.length === 0) {
        return (
            <div className="bg-gray-50 min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
                <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-lg w-full">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart size={36} className="text-red-500" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight">Your Wishlist is Empty</h2>
                    <p className="text-sm md:text-base text-gray-500 mb-8">Save items that you love here. Review them anytime and easily move them to your cart.</p>

                    <Link to="/" className="inline-block bg-[#f97316] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition-all duration-300 w-full tracking-wide active:scale-[0.98] select-none border-none outline-none focus:outline-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
                        CONTINUE SHOPPING
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f4f5f7] min-h-screen py-6 md:py-10 font-sans relative overflow-hidden">

            {/* Toast Notification */}
            <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-400 ease-out pointer-events-none flex justify-center ${toast.show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
                <div className="bg-gray-900 text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 w-max">
                    <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                    <span className="text-sm font-medium tracking-wide">{toast.message}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-gray-100 gap-4 sm:gap-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-50 p-2.5 rounded-lg">
                                <Heart size={24} className="text-red-500 fill-red-500" strokeWidth={2} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">My Wishlist</h1>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">{validWishlistItems.length} {validWishlistItems.length === 1 ? 'Item' : 'Items'} Saved</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { if (window.confirm('Clear your entire wishlist?')) clearWishlist(); }}
                            className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors select-none outline-none focus:outline-none"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            CLEAR ALL
                        </button>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50/50">
                        {validWishlistItems.map((item, index) => {
                            const price = Number(item.price) || 0;
                            const inCart = cartItems.some(cartItem => String(cartItem.productId) === String(item.productId) && String(cartItem.variantId) === String(item.variantId));

                            return (
                                <div key={`${item.productId}_${index}`} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col group relative">

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeItem(item.productId, item.variantId)}
                                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all duration-200 z-10 appearance-none outline-none focus:outline-none border-none select-none"
                                        style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 onClick={() => navigate(`/product/${item.productId}`)} className="text-[16px] font-bold text-gray-900 group-hover:text-[#f97316] transition-colors duration-200 truncate cursor-pointer select-none">
                                            {item.name}
                                        </h3>

                                        {item.variantId && item.variantId !== 'default' && (
                                            <p className="text-xs text-gray-500 mt-1 font-medium">Variant: {String(item.variantId).replace('var_', '')}</p>
                                        )}

                                        <div className="mt-3 mb-5">
                                            <span className="text-xl font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
                                        </div>

                                        <button
                                            onClick={() => inCart ? navigate('/cart') : handleMoveToCart(item)}
                                            className={`mt-auto w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 select-none outline-none focus:outline-none focus:ring-0 ${inCart ? 'bg-[#10b981] text-white hover:bg-[#059669]' : 'bg-gray-900 text-white hover:bg-[#f97316]'}`}
                                            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                                        >
                                            {inCart ? (
                                                <>
                                                    <CheckCircle2 size={16} /> Go to Cart
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart size={16} /> Move to Cart
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WishlistPage;