import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SidebarCategory = ({ categoryName, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[10px] transition-all duration-200 !outline-none focus:!outline-none focus:!ring-0 border-none shadow-none select-none text-[15px] ${isActive
                    ? 'bg-[#fff7ed] text-[#ea580c] font-semibold'
                    : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
            <span>{categoryName}</span>
            {isActive ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
    );
};

export default SidebarCategory;