import { useState, useEffect, useCallback } from 'react';

const WISHLIST_UPDATE_EVENT = 'wishlist_updated';

export const useWishlist = () => {
    const [items, setItems] = useState([]);

    const loadWishlist = useCallback(() => {
        try {
            const saved = localStorage.getItem('wishlist');
            if (saved) {
                setItems(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Failed to parse wishlist from local storage", error);
        }
    }, []);

    useEffect(() => {
        loadWishlist();
        window.addEventListener(WISHLIST_UPDATE_EVENT, loadWishlist);
        window.addEventListener('storage', (e) => {
            if (e.key === 'wishlist') loadWishlist();
        });

        return () => {
            window.removeEventListener(WISHLIST_UPDATE_EVENT, loadWishlist);
            window.removeEventListener('storage', loadWishlist);
        };
    }, [loadWishlist]);

    const broadcastUpdate = (newItems) => {
        localStorage.setItem('wishlist', JSON.stringify(newItems));
        setItems(newItems);
        window.dispatchEvent(new Event(WISHLIST_UPDATE_EVENT));
    };

    // 🚀 BULLETPROOF: Forces a single object payload to prevent dropped arguments
    const normalizePayload = (args) => {
        if (args.length === 1 && typeof args[0] === 'object') return args[0];
        return {
            productId: args[0], variantId: args[1], name: args[2], price: args[3], image: args[4],
            inventory_quantity: args[5] // Safely captures stock limit
        };
    };

    const addItem = useCallback((...args) => {
        const productData = normalizePayload(args);
        const currentItems = JSON.parse(localStorage.getItem('wishlist') || '[]');

        if (!currentItems.some(i => i.productId === productData.productId && i.variantId === productData.variantId)) {
            broadcastUpdate([...currentItems, productData]);
        }
    }, []);

    const removeItem = useCallback((productId, variantId) => {
        const currentItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
        broadcastUpdate(currentItems.filter(i => !(i.productId === productId && i.variantId === variantId)));
    }, []);

    const toggleItem = useCallback((...args) => {
        const productData = normalizePayload(args);
        const currentItems = JSON.parse(localStorage.getItem('wishlist') || '[]');

        const exists = currentItems.some(i => i.productId === productData.productId && i.variantId === productData.variantId);

        if (exists) {
            broadcastUpdate(currentItems.filter(i => !(i.productId === productData.productId && i.variantId === productData.variantId)));
        } else {
            broadcastUpdate([...currentItems, productData]);
        }
    }, []);

    const clearWishlist = useCallback(() => broadcastUpdate([]), []);

    const isInWishlist = useCallback((productId, variantId) => {
        return items.some(i => i.productId === productId && i.variantId === variantId);
    }, [items]);

    return { items, addItem, removeItem, toggleItem, clearWishlist, isInWishlist };
};