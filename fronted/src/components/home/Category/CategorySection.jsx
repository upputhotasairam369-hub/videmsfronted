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
        <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
            <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                    Shop by Category
                </h2>
                <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
                    Explore our premium collections crafted for your home
                </p>
            </div>

            {error ? (
                <div className="text-center py-12 text-base md:text-lg text-gray-500 font-medium bg-gray-50 rounded-lg mx-4 md:mx-0">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full">
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
                        <div className="col-span-2 md:col-span-4 text-center py-12 text-base md:text-lg text-gray-500">
                            No categories available at the moment.
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default CategorySection;