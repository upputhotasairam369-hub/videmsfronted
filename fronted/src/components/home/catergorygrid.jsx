import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CategoryGrid = () => {
  const [activeTab, setActiveTab] = useState('Living');
  const tabs = ['All', 'Living', 'Bedroom', 'Dining', 'Mattress', 'Decor'];

  // 🚀 Helper to map your UI tabs to the exact Category names AllProductsPage expects
  const getCategoryParam = (tab) => {
    if (tab === 'All') return 'all';
    if (tab === 'Living') return 'Living Room';
    if (tab === 'Mattress') return 'Bedroom'; // Mattresses are under Bedroom in your mock data
    return tab; // Bedroom, Dining, Decor
  };

  // All images have been verified and perfectly matched to their titles!
  const categoryData = {
    'Living': [
      { title: 'Sofa Sets', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80' },
      { title: 'L Shape Sofa', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=400&q=80' },
      { title: 'Coffee Tables', image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=400&q=80' },
      { title: 'TV Units', image: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=400&q=80' },
      { title: 'Lounge Chairs', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80' },
      { title: 'Diwan Beds', image: 'https://images.unsplash.com/photo-1505692915650-2f92f8016405?auto=format&fit=crop&w=400&q=80' },
      { title: 'Shoe Racks', image: 'https://images.unsplash.com/photo-1595514535415-38d1796dcf98?auto=format&fit=crop&w=400&q=80' },
      { title: 'Cabinets', image: 'https://images.unsplash.com/photo-1601760561300-3620f4c0ceef?auto=format&fit=crop&w=400&q=80' },
      { title: 'Recliners', image: 'https://images.unsplash.com/photo-1583847268964-b28e5f8f8101?auto=format&fit=crop&w=400&q=80' },
      { title: 'Bookshelves', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=400&q=80' },
      { title: 'Side Tables', image: 'https://images.unsplash.com/photo-1533090368676-1fd25485d691?auto=format&fit=crop&w=400&q=80' },
      { title: 'Benches', image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&w=400&q=80' }
    ],
    'Bedroom': [
      { title: 'Beds', image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=400&q=80' },
      { title: 'King Size Bed', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80' },
      { title: 'Queen Size Beds', image: 'https://images.unsplash.com/photo-1560067174-c5a3a8f37060?auto=format&fit=crop&w=400&q=80' },
      { title: 'Sofa Cum Bed', image: 'https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=400&q=80' },
      { title: 'Bedside Tables', image: 'https://images.unsplash.com/photo-1505692794401-a024cb73d927?auto=format&fit=crop&w=400&q=80' },
      { title: 'Wardrobes', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80' }
    ],
    'Dining': [
      { title: '6 Seater Dining', image: 'https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&w=400&q=80' },
      { title: '4 Seater Dining', image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=400&q=80' },
      { title: 'Dining Tables', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=400&q=80' },
      { title: 'Dining Chairs', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80' },
      { title: 'Kitchen Racks', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80' },
      { title: 'Crockery Units', image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=400&q=80' }
    ],
    'Mattress': [
      { title: 'Memory Foam', image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=80' },
      { title: 'Orthopedic', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' }
    ],
    'Decor': [
      { title: 'Wall Art', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80' },
      { title: 'Lamps', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80' },
      { title: 'Mirrors', image: 'https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&w=400&q=80' }
    ]
  };

  categoryData['All'] = Object.keys(categoryData).filter(key => key !== 'All')
    .reduce((acc, key) => acc.concat(categoryData[key]), []).slice(0, 10);

  const currentItems = categoryData[activeTab] || [];

  return (
    <section className="w-full py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8">

        {/* ========================================================
            🚀 Navigation Tabs 
            Added premium shadow-sm and hover:shadow-md 
            ======================================================== */}
        <div className="flex justify-start md:justify-center overflow-x-auto pb-4 mb-8 gap-3 md:gap-4 [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center justify-center whitespace-nowrap px-7 py-2.5 rounded-full text-[15px] font-medium transition-all duration-200 select-none appearance-none border-0 !outline-none focus:!outline-none focus-visible:!outline-none !ring-0 !ring-offset-0 focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 bg-clip-padding shadow-sm hover:shadow-md ${activeTab === tab
                ? 'bg-[#fff7ed] text-[#ea580c]' // Active: Soft Orange background, Orange text
                : 'bg-[#f8f9fa] text-gray-600 hover:bg-[#f3f4f6] hover:text-gray-900' // Inactive: Soft Light Gray background, Gray text
                }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Circular Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 md:gap-y-12 justify-items-center">
          {currentItems.map((item, index) => (
            // 🚀 FIX APPLIED HERE: Passes both Category and Subcategory exactly as AllProductsPage expects!
            <Link
              to={`/products?category=${encodeURIComponent(getCategoryParam(activeTab))}&subcategory=${encodeURIComponent(item.title)}`}
              key={index}
              className="flex flex-col items-center group w-full max-w-[160px] md:max-w-[200px]"
            >
              {/* Aesthetic container with slate background and smooth lift-on-hover shadow effect */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-[2px] md:border-2 border-gray-100 bg-slate-50 shadow-sm group-hover:shadow-xl group-hover:border-slate-200 transition-all duration-500 ease-in-out">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </div>

              <h3 className="mt-4 text-center text-sm md:text-base font-semibold text-gray-700 group-hover:text-black transition-colors duration-300">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;