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
                    // Strictly enforce exactly 4 categories if the API returns more
                    setCategories(data.slice(0, 4));
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
        <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Shop by Category
                </h2>
                <p className="mt-4 text-gray-500 text-sm md:text-base">
                    Explore our premium collections crafted for your home
                </p>
            </div>

            {error ? (
                <div className="text-center py-12 text-gray-500 font-medium bg-gray-50 rounded-lg">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
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
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No categories available at the moment.
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default CategorySection;