import React, { useEffect } from 'react';

const InfoPageLayout = ({ title, subtitle, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Premium Hero Banner */}
      <div className="relative bg-[#111111] py-24 md:py-32 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 animate-[fade-in-up_0.8s_ease-out_forwards]">{title}</h1>
          {subtitle && (
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-light animate-[fade-in-up_0.8s_ease-out_forwards]">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow container mx-auto px-4 md:px-12 py-8 md:py-24 max-w-4xl">
        <div className="bg-white p-4 md:p-8 lg:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-gray max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoPageLayout;
