import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productslice';
import ProductCard from '../components/product/productcart';
import LoadingSpinner from '../components/common/lodingspinner';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

const SIDEBAR_CATEGORIES = {
    'SOFAS': {
        'SOFAS': ['Fabric Sofas', 'Wooden Sofas', 'L-Shaped Sofas', 'Sofas Cum Beds', 'Recliners']
    },
    'DINING': {
        'DINING SETS': ['4 Seater Dining Sets', '6 - Seater Dining Sets', '8 - Seater Dining Sets', 'Extendable Dining']
    },
    'BEDS': {
        'BEDS': ['Solid Wood Beds', 'Upholstered Beds', 'Beds with Storage', 'King Size Beds', 'Queen Size Beds']
    },
    'OFFICE TABLES & STUDY CHAIR': {
        'OFFICE FURNITURE': ['L - Shape Office - Tables', 'Executive - Chairs', 'Study Chair', 'Waiting - Chairs', 'Single Gaming Chair']
    }
};

// ── Reusable style helpers ─────────────────────────────────────────────────────
// 🚀 USING YOUR EXACT OVERRIDES: border-none, !shadow-none, !outline-none
const pillBase =
    'w-full text-left px-5 py-3.5 rounded-xl transition-colors duration-200 font-medium text-[15px] ' +
    'select-none border-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none cursor-pointer';

const pillActive = 'bg-[#fff7ed] text-[#f97316]';
const pillInactive = 'bg-[#f8f9fa] text-gray-600 hover:bg-[#f3f4f6] hover:text-gray-900';

const subPillBase =
    'text-sm text-left w-full py-2.5 px-4 rounded-lg transition-colors duration-200 ' +
    'flex items-center relative select-none border-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none cursor-pointer';

const subPillActive = 'bg-[#fff7ed] text-[#f97316] font-semibold';
const subPillInactive = 'bg-transparent text-gray-500 hover:bg-[#f8f9fa] hover:text-gray-900 font-medium';

// 🚀 Forcing inline styles to kill the rendering artifacts
const flatInlineStyles = {
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
    boxShadow: 'none',
    border: 'none'
};
// ──────────────────────────────────────────────────────────────────────────────

const ProductSkeletonGrid = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8 w-full">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-100 p-4 h-[350px] flex flex-col">
                <div className="bg-gray-200 h-48 rounded-xl mb-4 w-full animate-pulse"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2 mb-4 animate-pulse"></div>
                <div className="mt-auto flex justify-between items-center">
                    <div className="bg-gray-200 h-6 rounded w-1/3 animate-pulse"></div>
                    <div className="bg-gray-200 h-8 rounded-full w-8 animate-pulse"></div>
                </div>
            </div>
        ))}
    </div>
);

const AllProductsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || searchParams.get('search') || '');
    const [activeAccordion, setActiveAccordion] = useState(() => {
        const cat = searchParams.get('category');
        return cat ? cat.toUpperCase() : null;
    });
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const { items: apiItems, loading, error } = useSelector((state) => state.products);

    const items = useMemo(() => {
        return apiItems || [];
    }, [apiItems]);

    // ── Sync state when URL params change ──
    useEffect(() => {
        const cat = searchParams.get('category') || 'all';
        const sub = searchParams.get('subcategory') || '';
        const search = searchParams.get('search') || '';
        setSelectedCategory(cat);
        setSelectedSubcategory(sub || search);
        setActiveAccordion(cat !== 'all' ? cat.toUpperCase() : null);
        setPage(1);
    }, [searchParams]);

    // ── Filter ──
    const filteredProducts = useMemo(() => {
        return items.filter(product => {
            const productCategory = (product.category || '').toLowerCase();
            const productSubcategory = (product.subcategory || '').toLowerCase();
            const productItemType = (product.item_type || '').toLowerCase();
            const productName = (product.name || '').toLowerCase();

            if (selectedSubcategory) {
                const sub = selectedSubcategory.toLowerCase();
                return (
                    productSubcategory === sub ||
                    productItemType === sub ||
                    productSubcategory.includes(sub) ||
                    productItemType.includes(sub) ||
                    productName.includes(sub)
                );
            }
            if (selectedCategory && selectedCategory !== 'all') {
                return productCategory === selectedCategory.toLowerCase();
            }
            return true;
        });
    }, [items, selectedCategory, selectedSubcategory]);

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            const priceA = a.variants?.[0]?.price || 0;
            const priceB = b.variants?.[0]?.price || 0;
            switch (sortBy) {
                case 'price_low': return priceA - priceB;
                case 'price_high': return priceB - priceA;
                case 'popular':
                case 'rating': return (b.rating || 0) - (a.rating || 0);
                default: return 0;
            }
        });
    }, [filteredProducts, sortBy]);

    const startIdx = (page - 1) * 20;
    const paginatedProducts = sortedProducts.slice(startIdx, startIdx + 20);
    const calculatedTotalPages = Math.ceil(sortedProducts.length / 20);

    useEffect(() => {
        const params = { page, limit: 20 };
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedSubcategory) params.subcategory = selectedSubcategory;
        if (sortBy !== 'newest') params.sort = sortBy;
        dispatch(fetchProducts(params));
    }, [dispatch, selectedCategory, selectedSubcategory, sortBy, page]);

    useEffect(() => {
        document.body.style.overflow = isMobileFiltersOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileFiltersOpen]);

    const handleMainCategoryClick = (mainCat) => {
        setActiveAccordion(activeAccordion === mainCat ? null : mainCat);
        setSelectedCategory(mainCat);
        setSelectedSubcategory('');
        setPage(1);
        const p = new URLSearchParams();
        p.set('category', mainCat);
        setSearchParams(p);
    };

    const handleSubCategoryClick = (subCat) => {
        setSelectedSubcategory(subCat);
        setPage(1);
        const p = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'all') p.set('category', selectedCategory);
        p.set('subcategory', subCat);
        setSearchParams(p);
        if (window.innerWidth < 768) setIsMobileFiltersOpen(false);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setPage(1);
    };

    const getDisplayCategory = () => {
        if (selectedSubcategory) return selectedSubcategory;
        if (selectedCategory === 'all') return 'All Products';
        return selectedCategory.split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
    };

    // ── Error state ──
    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Products</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition
                                   !outline-none !border-none !ring-0 !shadow-none"
                        style={flatInlineStyles}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ── Sidebar markup extracted for DRY mobile/desktop use ──
    const SidebarContent = (
        <div className="md:sticky md:top-24 space-y-4">

            {/* ── Categories card ── */}
            <div className="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] p-5 border border-gray-100">
                <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1 select-none">
                    Categories
                </h3>
                <div className="space-y-2">

                    {/* All Products */}
                    <button
                        onClick={() => {
                            setSelectedCategory('all');
                            setSelectedSubcategory('');
                            setActiveAccordion(null);
                            setPage(1);
                            setSearchParams(new URLSearchParams());
                        }}
                        className={`${pillBase} ${selectedCategory === 'all' && !selectedSubcategory ? pillActive : pillInactive}`}
                        style={flatInlineStyles}
                    >
                        All Products
                    </button>

                    {/* Main category accordions */}
                    {Object.keys(SIDEBAR_CATEGORIES).map((mainCat) => (
                        <div key={mainCat} className="flex flex-col">
                            <button
                                onClick={() => handleMainCategoryClick(mainCat)}
                                className={`${pillBase} flex items-center justify-between ${activeAccordion === mainCat ? pillActive : pillInactive}`}
                                style={flatInlineStyles}
                            >
                                <span className="capitalize tracking-wide">
                                    {mainCat.toLowerCase()}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-300 ease-out shrink-0
                                        ${activeAccordion === mainCat ? 'rotate-180 text-[#f97316]' : 'text-gray-400'}`}
                                />
                            </button>

                            {/* Accordion body */}
                            <div className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                                ${activeAccordion === mainCat ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="pl-2 pr-2 space-y-4 py-3 border-l-2 border-orange-100 ml-5 my-1.5">
                                        {Object.entries(SIDEBAR_CATEGORIES[mainCat]).map(([groupName, groupItems]) => (
                                            <div key={groupName}>
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 select-none px-3">
                                                    {groupName}
                                                </h4>
                                                <ul className="space-y-1">
                                                    {groupItems.map(item => (
                                                        <li key={item}>
                                                            <button
                                                                onClick={() => handleSubCategoryClick(item)}
                                                                className={`${subPillBase} ${selectedSubcategory === item ? subPillActive : subPillInactive}`}
                                                                style={flatInlineStyles}
                                                            >
                                                                <span className={`absolute left-4 w-1.5 h-1.5 rounded-full bg-[#f97316]
                                                                    transition-opacity duration-200
                                                                    ${selectedSubcategory === item ? 'opacity-100' : 'opacity-0'}`}
                                                                />
                                                                <span className="pl-3">{item}</span>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Sort By card ── */}
            <div className="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] p-5 border border-gray-100">
                <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1 select-none">
                    Sort By
                </h3>
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="w-full px-5 py-3.5 rounded-xl text-gray-700 text-sm font-medium
                                   bg-[#f8f9fa] hover:bg-gray-100 transition-colors cursor-pointer
                                   !border-none !shadow-none !ring-0 appearance-none !outline-none"
                        style={{ WebkitAppearance: 'none', ...flatInlineStyles }}
                    >
                        <option value="newest">Newest Arrivals</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="popular">Most Popular</option>
                        <option value="rating">Top Rated</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* ── Page header ── */}
            <div className="bg-white border-b border-gray-100 py-6 md:py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-4">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-400 text-sm hover:text-gray-800 transition-colors flex items-center gap-1.5
                                       !outline-none !border-none !ring-0 !shadow-none bg-transparent select-none cursor-pointer"
                            style={flatInlineStyles}
                        >
                            <span>←</span> Back to Home
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                                {getDisplayCategory()}
                            </h1>
                            <p className="text-gray-400 text-sm md:text-base font-medium select-none">
                                Showing {paginatedProducts.length > 0 ? startIdx + 1 : 0}–
                                {startIdx + paginatedProducts.length} of {sortedProducts.length} products
                            </p>
                        </div>

                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="md:hidden flex items-center justify-center gap-2 w-full
                                       bg-white text-gray-700
                                       py-3.5 rounded-xl font-semibold
                                       hover:bg-gray-50 transition-all
                                       !outline-none !border-none !ring-0 shadow-sm select-none"
                            style={flatInlineStyles}
                        >
                            <SlidersHorizontal size={17} />
                            Filter & Sort
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-12 gap-6 md:gap-8">

                    {/* Mobile backdrop */}
                    {isMobileFiltersOpen && (
                        <div
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] z-40 md:hidden"
                            onClick={() => setIsMobileFiltersOpen(false)}
                        />
                    )}

                    {/* ── Sidebar / Drawer ── */}
                    <div className={`
                        fixed inset-y-0 left-0 z-50 w-[85%] max-w-[340px] bg-gray-50 md:bg-transparent shadow-2xl
                        flex flex-col transform transition-transform duration-300 ease-in-out
                        md:static md:z-auto md:w-auto md:max-w-none 
                        md:shadow-none md:transform-none md:translate-x-0 md:block
                        col-span-12 md:col-span-3
                        ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>

                        {/* Mobile drawer header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 md:hidden bg-white shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Filters</h2>
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="p-2 -mr-1 text-gray-400 hover:text-gray-900
                                           bg-gray-100 hover:bg-gray-200 rounded-full transition-colors
                                           !outline-none !border-none !ring-0 !shadow-none"
                                style={flatInlineStyles}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable sidebar body */}
                        <div className="flex-1 overflow-y-auto p-5 md:p-0">
                            {SidebarContent}
                        </div>

                        {/* Mobile drawer footer */}
                        <div className="p-4 bg-white border-t border-gray-200 md:hidden shrink-0">
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl
                                           hover:bg-[#f97316] active:scale-[0.98] transition-all
                                           !outline-none !border-none !ring-0 !shadow-none"
                                style={flatInlineStyles}
                            >
                                Show {filteredProducts.length} Results
                            </button>
                        </div>
                    </div>

                    {/* ── Products grid ── */}
                    <div className="col-span-12 md:col-span-9 w-full">
                        {loading && paginatedProducts.length === 0 ? (
                            <ProductSkeletonGrid />
                        ) : paginatedProducts.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-100
                                            p-12 md:p-16 text-center h-full flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                                    <span className="text-2xl">🔍</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight select-none">
                                    No Products Found
                                </h3>
                                <p className="text-gray-400 mb-8 max-w-sm select-none">
                                    Try adjusting your filters or browse other categories.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSelectedSubcategory('');
                                        setActiveAccordion(null);
                                        setSearchParams(new URLSearchParams());
                                    }}
                                    className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold
                                               hover:bg-[#f97316] transition-colors duration-300
                                               !outline-none !border-none !ring-0 !shadow-none select-none"
                                    style={flatInlineStyles}
                                >
                                    View All Products
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                                    {paginatedProducts.map((product) => (
                                        <ProductCard key={product.id || product._id} product={product} />
                                    ))}
                                </div>

                                {/* ── Pagination ── */}
                                {calculatedTotalPages > 1 && (
                                    <div className="flex flex-wrap justify-center items-center gap-2 py-8 border-t border-gray-200 mt-8">

                                        <button
                                            onClick={() => setPage(Math.max(1, page - 1))}
                                            disabled={page === 1}
                                            className="px-5 py-2.5 rounded-xl text-gray-600 bg-white font-medium
                                                       hover:bg-gray-50
                                                       disabled:opacity-35 disabled:cursor-not-allowed
                                                       transition-all !outline-none !border-none !ring-0 !shadow-none select-none"
                                            style={flatInlineStyles}
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: Math.min(calculatedTotalPages, 5) }, (_, i) => {
                                            const pageNum = page > 3 ? page - 2 + i : i + 1;
                                            return pageNum <= calculatedTotalPages ? pageNum : null;
                                        }).map((p) => p && (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-11 h-11 flex items-center justify-center rounded-xl
                                                    transition-all font-semibold !outline-none !border-none !ring-0 !shadow-none select-none
                                                    ${page === p
                                                        ? 'bg-[#fff7ed] text-[#f97316]'
                                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                style={flatInlineStyles}
                                            >
                                                {p}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setPage(Math.min(calculatedTotalPages, page + 1))}
                                            disabled={page === calculatedTotalPages}
                                            className="px-5 py-2.5 rounded-xl text-gray-600 bg-white font-medium
                                                       hover:bg-gray-50
                                                       disabled:opacity-35 disabled:cursor-not-allowed
                                                       transition-all !outline-none !border-none !ring-0 !shadow-none select-none"
                                            style={flatInlineStyles}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProductsPage;