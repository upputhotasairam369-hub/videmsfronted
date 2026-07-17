import React, { useState } from 'react';

const CategoryPills = () => {
    const categories = ['All', 'Sofas', 'Beds', 'Dining', 'Mattress', 'Decor'];
    const [activeCategory, setActiveCategory] = useState('Sofas');

    return (
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 py-8 px-4 w-full">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    // 🚀 YOUR FIX: border-none applied, using solid bg colors instead of outlines
                    className={`px-7 py-2.5 rounded-full text-[15px] font-medium transition-colors duration-200 select-none border-none !shadow-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none ${activeCategory === cat
                            ? 'bg-[#f97316] text-white' // Solid Orange Active State
                            : 'bg-[#f3f4f6] text-gray-600 hover:bg-[#e5e7eb] hover:text-gray-900' // Solid Light Gray Inactive State
                        }`}
                    style={{
                        WebkitTapHighlightColor: 'transparent',
                        outline: 'none',
                        boxShadow: 'none'
                    }}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryPills;