import React, { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';
import CategorySkeleton from './CategorySkeleton';
import { getCategories } from '../../../services/api';

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchCategoryData = async () => {
            try {
                const data = await getCategories();
                if (isMounted) {
                    // Strictly enforce exactly 4 categories in the specified order:
                    // Row 1: Sofas, Dining
                    // Row 2: Beds, Office table & Study chairs
                    const desiredOrder = ["sofa", "dining", "bed", "office"];
                    const sortedData = [];
                    
                    desiredOrder.forEach(keyword => {
                        const match = data.find(c => c.name.toLowerCase().includes(keyword) && !sortedData.includes(c));
                        if (match) sortedData.push(match);
                    });
                    
                    // Fill any missing slots with remaining categories
                    for (const item of data) {
                        if (sortedData.length >= 4) break;
                        if (!sortedData.includes(item)) sortedData.push(item);
                    }

                    setCategories(sortedData.slice(0, 4));
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError('We are currently updating our collections. Please check back shortly.');
                    setLoading(false);
                }
            }
        };

        fetchCategoryData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="w-full bg-[#FAF9F6]">
            <div className="max-w-screen-2xl mx-auto px-3 md:px-8 lg:px-12 py-6 md:py-10 lg:py-12">
                <div className="flex flex-col items-center text-center mb-5 md:mb-8">
                    <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-gray-900 tracking-tight">
                        Shop by Category
                    </h2>
                    <p className="mt-2 md:mt-3 text-[clamp(0.875rem,2vw,1.125rem)] text-gray-500 max-w-2xl mx-auto">
                        Explore our premium collections crafted for your home
                    </p>
                </div>

            {error ? (
                <div className="text-center py-10 text-[clamp(0.875rem,2vw,1.125rem)] text-gray-500 font-medium bg-white rounded-lg mx-3 md:mx-0 shadow-sm border border-gray-100">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 lg:gap-6 w-full">
                    {/* 
                       MOBILE (Default): grid-cols-2 creates a 2x2 grid.
                       DESKTOP (md:): md:grid-cols-4 forces a single 4-column row.
                    */}
                    {loading ? (
                        // Render 4 skeletons while loading
                        Array.from({ length: 4 }).map((_, index) => (
                            <CategorySkeleton key={index} />
                        ))
                    ) : categories.length > 0 ? (
                        categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))
                    ) : (
                        <div className="col-span-2 md:col-span-4 text-center py-10 text-[clamp(0.875rem,2vw,1.125rem)] text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
                            No categories available at the moment.
                        </div>
                    )}
                </div>
            )}
            </div>
        </section>
    );
};

export default CategorySection;