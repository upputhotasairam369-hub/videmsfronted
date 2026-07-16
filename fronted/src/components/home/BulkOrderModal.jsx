import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { bulkOrderAPI } from '../../services/api';

const BulkOrderModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error('File size must be less than 4MB');
        e.target.value = '';
        setFileName('');
      } else {
        setFileName(file.name);
      }
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('company_name', data.company_name);
    formData.append('customer_name', data.customer_name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('business_type', data.business_type);
    formData.append('city', data.city);
    formData.append('state', data.state);
    if (data.pincode) formData.append('pincode', data.pincode);
    if (data.estimated_quantity) formData.append('estimated_quantity', data.estimated_quantity);
    if (data.estimated_budget) formData.append('estimated_budget', data.estimated_budget);
    if (data.delivery_date) formData.append('delivery_date', data.delivery_date);
    if (data.notes) formData.append('notes', data.notes);
    
    // Convert categories to JSON string
    if (data.categories && data.categories.length > 0) {
      formData.append('categories', JSON.stringify(data.categories));
    }

    if (data.attachment && data.attachment[0]) {
      formData.append('attachment', data.attachment[0]);
    }

    try {
      await bulkOrderAPI.submit(formData);
      toast.success('Your bulk order request has been submitted successfully! Our team will contact you shortly.', {
        duration: 5000,
        position: 'top-center',
      });
      setTimeout(() => {
        reset();
        setFileName('');
        onClose();
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit the request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Toaster for notifications */}
      <Toaster />
      
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Place Bulk Order Request</h3>
            <p className="text-sm text-gray-500 mt-1">Fill out the details below and our enterprise team will reach out.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500 outline-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <form id="bulk-order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Section 1: Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company/Organization Name *</label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-3 rounded-lg border ${errors.company_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#f97316]'} focus:outline-none focus:ring-1 transition-colors`}
                  placeholder="Enter company name"
                  {...register("company_name", { required: "Company name is required" })}
                />
                {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person Full Name *</label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-3 rounded-lg border ${errors.customer_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#f97316]'} focus:outline-none focus:ring-1 transition-colors`}
                  placeholder="Enter full name"
                  {...register("customer_name", { required: "Full name is required" })}
                />
                {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#f97316]'} focus:outline-none focus:ring-1 transition-colors`}
                  placeholder="work@company.com"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                  })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#f97316]'} focus:outline-none focus:ring-1 transition-colors`}
                  placeholder="+91 98765 43210"
                  {...register("phone", { 
                    required: "Phone number is required",
                    minLength: { value: 10, message: "Must be at least 10 digits" }
                  })}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Section 2: Business Details */}
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Business Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type *</label>
                  <select 
                    className={`w-full px-4 py-3 rounded-lg border ${errors.business_type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#f97316]'} focus:outline-none focus:ring-1 transition-colors bg-white`}
                    {...register("business_type", { required: "Please select a business type" })}
                  >
                    <option value="">Select Type</option>
                    <option value="Hotel">Hotel / Resort</option>
                    <option value="Hostel">Hostel / PG</option>
                    <option value="Office">Office Workspace</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Hospital">Hospital / Clinic</option>
                    <option value="School">School</option>
                    <option value="College">College / University</option>
                    <option value="Apartment">Apartment Complex</option>
                    <option value="Builder">Builder / Real Estate</option>
                    <option value="Corporate">Corporate Gifting</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.business_type && <p className="text-red-500 text-xs mt-1">{errors.business_type.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#f97316]'} focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="Enter city"
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-lg border ${errors.state ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#f97316]'} focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="Enter state"
                    {...register("state", { required: "State is required" })}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#f97316] focus:outline-none focus:ring-1 transition-colors"
                    placeholder="Enter pincode"
                    {...register("pincode")}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Requirement Details */}
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Requirement Details</h4>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Furniture Categories Required</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Sofas', 'Dining', 'Beds', 'Office tables & Study chairs', 'Custom Furniture', 'Other'].map(category => (
                    <label key={category} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                      <input 
                        type="checkbox" 
                        value={category} 
                        className="w-4 h-4 text-[#f97316] border-gray-300 rounded focus:ring-[#f97316]"
                        {...register("categories")}
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Quantity</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#f97316] focus:outline-none focus:ring-1 transition-colors"
                    placeholder="e.g., 50 beds, 20 sofas"
                    {...register("estimated_quantity")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Budget</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#f97316] focus:outline-none focus:ring-1 transition-colors"
                    placeholder="e.g., ₹5,00,000"
                    {...register("estimated_budget")}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Delivery Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#f97316] focus:outline-none focus:ring-1 transition-colors"
                  {...register("delivery_date")}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes / Custom Requirements</label>
                <textarea 
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#f97316] focus:outline-none focus:ring-1 transition-colors resize-none"
                  placeholder="Describe your specific needs or customization requests..."
                  {...register("notes")}
                ></textarea>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Requirements (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#f97316] hover:bg-orange-50/30 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#f97316] hover:text-[#ea580c] focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          type="file" 
                          className="sr-only" 
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          {...register("attachment", {
                            onChange: handleFileChange
                          })}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 4MB</p>
                    {fileName && (
                      <p className="text-sm font-medium text-green-600 mt-2 flex items-center justify-center gap-1">
                        <CheckCircle size={14} /> {fileName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="mt-6 flex items-start">
                <div className="flex items-center h-5">
                  <input 
                    id="consent" 
                    type="checkbox" 
                    className="w-4 h-4 text-[#f97316] border-gray-300 rounded focus:ring-[#f97316]"
                    {...register("consent", { required: "You must agree to be contacted" })}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="consent" className="font-medium text-gray-700">Consent to Contact *</label>
                  <p className="text-gray-500">I agree that Videms may contact me regarding this bulk order request.</p>
                  {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="bulk-order-form"
            disabled={isSubmitting}
            className={`px-8 py-2.5 rounded-lg font-bold text-white transition-all flex items-center gap-2
              ${isSubmitting ? 'bg-[#f97316]/70 cursor-not-allowed' : 'bg-[#f97316] hover:bg-[#ea580c] hover:shadow-lg'}`}
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderModal;
