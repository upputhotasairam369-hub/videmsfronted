import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const StoreLocator = () => {
  return (
    <InfoPageLayout 
      title="Store Locator" 
      subtitle="Visit our flagship showroom to experience the quality and comfort of our furniture firsthand."
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-8 max-w-3xl mx-auto hover:shadow-md transition-shadow duration-300">
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Videms Gallery</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 text-gray-600">
                <MapPin className="w-6 h-6 text-[#f97316] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                  <p className="leading-relaxed">Videms Gallery Showroom<br/>123 Furniture Avenue, Design District<br/>Bangalore, Karnataka 560001</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-gray-600">
                <Clock className="w-6 h-6 text-[#f97316] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                  <p>Monday - Sunday: 10:00 AM – 8:00 PM</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 text-gray-600">
                <Phone className="w-6 h-6 text-[#f97316] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <a href="tel:08069252525" className="hover:text-[#f97316] transition-colors">080 6925 2525</a>
                </div>
              </div>

              <div className="flex items-start gap-4 text-gray-600">
                <Mail className="w-6 h-6 text-[#f97316] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <a href="mailto:videmsgallery@gmail.com" className="hover:text-[#f97316] transition-colors">videmsgallery@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100 flex justify-center">
            <a 
              href="https://maps.google.com/?q=Videms+Gallery" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-4 rounded-full font-semibold tracking-wide transition-colors duration-300 inline-flex items-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default StoreLocator;
