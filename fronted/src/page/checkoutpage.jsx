import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCart } from '../hooks/usecart';
import { AlertTriangle, Loader2, ShieldCheck, Lock, Truck, Calendar, DollarSign, LocateFixed } from 'lucide-react';
import { orderAPI } from '../services/api';

// ========================================================
// 🚀 1. DYNAMIC SCRIPT LOADERS
// ========================================================
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// OpenStreetMap Nominatim is used for free reverse geocoding instead of Google Maps API

// ========================================================
// 🚀 2. THE HARDWARE GPS WARM-UP LOOP (MAX ACCURACY)
// ========================================================
const getHardwareGPSLock = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    onError({ code: 0, message: "Geolocation not supported" });
    return;
  }

  // Directly request high-accuracy device location.
  // This natively triggers the OS-level permission prompt on mobile and waits.
  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess(position);
    },
    (error) => {
      onError(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 30000, // 30 seconds to allow the user time to accept the permission prompt
      maximumAge: 0   // Force live hardware GPS reading
    }
  );
};

// ========================================================
// 🚀 3. USER DATA SCRAPERS
// ========================================================
const getInitialUser = () => {
  try {
    const keys = ['user', 'userInfo', 'auth', 'profile', 'session'];
    for (let k of keys) {
      const item = localStorage.getItem(k);
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed.name || parsed.first_name || parsed.phone || parsed.email || parsed.mobile_number || parsed.phone_number) return parsed;
        if (parsed.user && (parsed.user.name || parsed.user.first_name || parsed.user.phone || parsed.user.mobile_number || parsed.user.phone_number)) return parsed.user;
      }
    }
  } catch (e) { }
  return null;
};

const extractPhone = (u) => {
  if (!u) return '';
  let rawPhone = '';

  const scanKeys = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key in obj) {
      if (rawPhone) return;
      if (typeof obj[key] === 'object') {
        scanKeys(obj[key]);
      } else {
        const k = key.toLowerCase();
        if (k.includes('phone') || k.includes('mobile') || k.includes('contact')) {
          const digits = String(obj[key]).replace(/\D/g, '');
          if (digits.length >= 10) rawPhone = digits;
        }
      }
    }
  };
  scanKeys(u);

  if (!rawPhone) {
    const scanValues = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key in obj) {
        if (rawPhone) return;
        if (typeof obj[key] === 'object') {
          scanValues(obj[key]);
        } else {
          const val = String(obj[key]).replace(/\D/g, '');
          if (val.length >= 10 && /^[6789]\d{9}$/.test(val.slice(-10))) {
            rawPhone = val;
          }
        }
      }
    };
    scanValues(u);
  }

  const digits = String(rawPhone).replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

const extractName = (u) => {
  if (!u) return '';
  let rawName = '';

  const scanName = (obj) => {
    if (!obj || typeof obj !== 'object') return;

    if (obj.fullName) { rawName = obj.fullName; return; }
    if (obj.name) { rawName = obj.name; return; }
    if (obj.first_name) { rawName = [obj.first_name, obj.last_name].filter(Boolean).join(' '); return; }
    if (obj.username) { rawName = obj.username; return; }

    for (const key in obj) {
      if (rawName) return;
      if (typeof obj[key] === 'object') scanName(obj[key]);
    }
  };

  scanName(u);
  return rawName;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items = [], clearCart } = useCart();

  const userFromRedux = useSelector((state) => state.auth?.user || state.user?.userInfo || state.auth?.userInfo || null);
  const localUser = getInitialUser();
  const currentUser = userFromRedux || localUser;

  const validItems = items.filter(item => item && item.productId && String(item.productId) !== 'undefined');

  useEffect(() => {
    if (validItems.length === 0) {
      navigate('/cart');
    }
  }, [validItems.length, navigate]);

  const hasAutoFilled = useRef(false);

  const [step, setStep] = useState(1);
  const [isBillingSame, setIsBillingSame] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [shipping, setShipping] = useState(() => {
    return {
      fullName: extractName(currentUser),
      phone: extractPhone(currentUser),
      address1: '', address2: '',
      pincode: sessionStorage.getItem('delivery_pincode') || '',
      city: '', state: ''
    };
  });

  const [billing, setBilling] = useState({
    fullName: '', email: '', phone: '', pincode: '', city: '', state: '', address1: '', address2: '', landmark: ''
  });

  useEffect(() => {
    if (userFromRedux && !hasAutoFilled.current) {
      setShipping(prev => ({
        ...prev,
        fullName: prev.fullName || extractName(userFromRedux),
        phone: prev.phone || extractPhone(userFromRedux),
      }));
      hasAutoFilled.current = true;
    }
  }, [userFromRedux]);

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [fetchingPin, setFetchingPin] = useState({ shipping: false, billing: false });

  // ========================================================
  // 🚀 4. OPENSTREETMAP NOMINATIM REVERSE GEOCODING
  // ========================================================
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    // Call our custom 30-year veteran GPS lock algorithm
    getHardwareGPSLock(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`GPS Locked! Accuracy Radius: ${Math.round(accuracy)} meters.`);

        try {
          // Use OpenStreetMap Nominatim API for free reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
          const data = await response.json();

          if (data && data.address) {
            const { address } = data;

            const fetchedPincode = address.postcode || '';
            const fetchedCity = address.city || address.town || address.village || address.state_district || '';
            const fetchedState = address.state || '';

            const streetNumber = address.house_number || '';
            const route = address.road || '';
            const fetchedAddress1 = [streetNumber, route].filter(Boolean).join(', ');

            const sublocality = address.suburb || address.neighbourhood || address.residential || '';
            const fetchedAddress2 = sublocality;

            setShipping(prev => ({
              ...prev,
              pincode: fetchedPincode,
              city: fetchedCity,
              state: fetchedState,
              address2: fetchedAddress2,
              address1: fetchedAddress1 ? fetchedAddress1 : prev.address1
            }));

            setErrors(prev => {
              const newErrors = { ...prev };
              if (fetchedPincode) delete newErrors.shipping_pincode;
              if (fetchedCity) delete newErrors.shipping_city;
              if (fetchedState) delete newErrors.shipping_state;
              if (fetchedAddress1) delete newErrors.shipping_address1;
              return newErrors;
            });
          } else {
            console.warn("Nominatim Geocoder failed");
            alert("Could not extract an exact address from your location. Please type it manually.");
          }
        } catch (error) {
          console.error("Geocoding fetch error:", error);
          alert("Network error while trying to fetch address details. Please type it manually.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === 1) alert("Location access denied. Please allow location permissions in your device settings.");
        else alert("Location signal unavailable. Are you indoors? Try stepping near a window.");
        setLoadingLocation(false);
      }
    );
  };

  const fetchLocationData = async (pin, type) => {
    const cleanPin = String(pin).trim();
    if (cleanPin.length !== 6) return;

    setFetchingPin(prev => ({ ...prev, [type]: true }));

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
      const data = await response.json();

      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const fetchedCity = po.District || po.Region || po.Division || po.Block || '';
        const fetchedState = po.State || '';

        if (type === 'shipping') {
          setShipping(prev => ({ ...prev, city: fetchedCity, state: fetchedState }));
          setErrors(prev => { const e = { ...prev }; delete e.shipping_city; delete e.shipping_state; return e; });
        } else {
          setBilling(prev => ({ ...prev, city: fetchedCity, state: fetchedState }));
        }
      }
    } catch (err) {
      console.warn("Postal API failed. User can input location manually.");
    } finally {
      setFetchingPin(prev => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    if (shipping.pincode.length === 6 && !loadingLocation) {
      fetchLocationData(shipping.pincode, 'shipping');
    }
  }, [shipping.pincode]);

  useEffect(() => {
    if (billing.pincode.length === 6) fetchLocationData(billing.pincode, 'billing');
  }, [billing.pincode]);

  const calculateShipping = (pincode) => {
    if (!pincode || pincode.length !== 6) return 0;
    const isHyderabad = /^(500|501|502)\d{3}$/.test(pincode.trim());
    return isHyderabad ? 0 : 999;
  };

  const shippingCost = calculateShipping(shipping.pincode);
  const isLocalHyderabad = /^(500|501|502)\d{3}$/.test(shipping.pincode.trim());

  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const transitDays = isLocalHyderabad ? 2 : 5;
    today.setDate(today.getDate() + transitDays);

    return today.toLocaleDateString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!shipping.fullName.trim()) newErrors.shipping_fullName = "Full Name is required";
    if (!shipping.phone.trim() || !/^\d{10}$/.test(shipping.phone.trim())) newErrors.shipping_phone = "Valid 10-digit Phone Number is required";
    if (!shipping.address1.trim()) newErrors.shipping_address1 = "Flat/House number is required";
    if (!shipping.pincode.trim() || shipping.pincode.length !== 6) newErrors.shipping_pincode = "6-digit Pincode is required";
    if (!shipping.city.trim()) newErrors.shipping_city = "City is required";
    if (!shipping.state.trim()) newErrors.shipping_state = "State is required";

    if (!isBillingSame) {
      if (!billing.fullName.trim()) newErrors.billing_fullName = "Full Name is required";
      if (!billing.phone.trim() || !/^\d{10}$/.test(billing.phone.trim())) newErrors.billing_phone = "Valid 10-digit Phone Number is required";
      if (!billing.address1.trim()) newErrors.billing_address1 = "Address is required";
      if (!billing.pincode.trim() || billing.pincode.length !== 6) newErrors.billing_pincode = "6-digit Pincode is required";
      if (!billing.city.trim()) newErrors.billing_city = "City is required";
      if (!billing.state.trim()) newErrors.billing_state = "State is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setModalMessage("Please completely fill all highlighted mandatory delivery parameters.");
      setShowModal(true);
      return;
    }

    setErrors({});
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartSubtotal = validItems.reduce((sum, item) => sum + (Number(item.price || 0) * (Number(item.quantity) || 1)), 0);
  const totalPayable = cartSubtotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'cod') {
      handleCodPayment();
    } else {
      handleRazorpayPayment();
    }
  };

  const handleCodPayment = async () => {
    setLoadingPayment(true);
    try {
      // 1. Package the user's delivery details and cart items
      const payload = {
        customer_name: shipping.fullName,
        customer_email: billing.email || currentUser?.email || "customer@example.com",
        customer_phone: shipping.phone,
        shipping_address: `${shipping.address1}, ${shipping.address2 ? shipping.address2 + ', ' : ''}${shipping.city}, ${shipping.state}`,
        pincode: shipping.pincode,
        total_amount: totalPayable,
        payment_method: 'COD',
        items: validItems.map(i => ({
          product_id: i.productId || i._id || i.id,
          variant_id: i.variantId || 'default',
          name: i.name,
          quantity: i.quantity,
          price: i.price
        }))
      };

      // 2. Send to Django Database (This auto-fills the Admin Portal & deducts stock)
      await orderAPI.create(payload);

      clearCart();
      sessionStorage.removeItem('delivery_pincode');
      alert(`Order Placed Successfully via Cash On Delivery!\nEstimated Arrival: ${getEstimatedDeliveryDate()}`);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.error || "Failed to place COD order. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setLoadingPayment(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      setLoadingPayment(false);
      return;
    }

    try {
      const payload = {
        customer_name: shipping.fullName,
        customer_email: billing.email || currentUser?.email || "customer@example.com",
        customer_phone: shipping.phone,
        shipping_address: `${shipping.address1}, ${shipping.address2 ? shipping.address2 + ', ' : ''}${shipping.city}, ${shipping.state}`,
        pincode: shipping.pincode,
        total_amount: totalPayable,
        payment_method: 'RAZORPAY',
        items: validItems.map(i => ({
          product_id: i.productId || i._id || i.id,
          variant_id: i.variantId || 'default',
          name: i.name,
          quantity: i.quantity,
          price: i.price
        }))
      };

      // 1. Tell Django to create a Pending Order and lock the stock
      const orderRes = await orderAPI.create(payload);
      const razorpayOrderId = orderRes.data.razorpay_order_id;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_TEST_KEY_HERE",
        amount: totalPayable * 100,
        currency: "INR",
        name: "Videm's Gallery",
        description: "Premium Furniture Purchase",
        order_id: razorpayOrderId, // Link the Django order to Razorpay
        theme: { color: "#e87831" },
        prefill: {
          name: shipping.fullName,
          contact: shipping.phone,
          email: billing.email || currentUser?.email || "customer@example.com"
        },
        handler: async function (response) {
          try {
            // 2. Tell Django the payment succeeded so it can mark it as "PAID"
            await orderAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            clearCart();
            sessionStorage.removeItem('delivery_pincode');
            alert("Payment Successful! Order Placed.");
            navigate('/');
          } catch (verifyError) {
            alert("Payment Verification Failed! Please contact support.");
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert("Payment Failed or Cancelled. Please try again.");
      });

      paymentObject.open();

    } catch (error) {
      alert(error.response?.data?.error || "Failed to initiate Razorpay payment. Stock may be unavailable.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="bg-[#f4f5f7] min-h-screen py-6 md:py-10 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="flex items-center justify-center gap-4 mb-8 select-none">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-[#e87831] font-bold' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-[#e87831] text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
            <span>Delivery Info</span>
          </div>
          <div className="w-12 h-px bg-gray-300" />
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#e87831] font-bold' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-[#e87831] text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
            <span>Secure Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-8 space-y-6">
            {step === 1 ? (
              <form onSubmit={handleContinueToPayment} className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100 space-y-6">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Shipping Details</h2>
                    <p className="text-xs text-gray-500">Provide the precise operational address for secure premium transport transit.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={loadingLocation}
                    className="flex items-center justify-center gap-2 bg-orange-50 text-[#e87831] border border-orange-200 hover:bg-orange-100 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 outline-none"
                  >
                    {loadingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                    {loadingLocation ? "Acquiring GPS Lock..." : "Use Current Location"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      value={shipping.fullName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setShipping(prev => ({ ...prev, fullName: val }));
                        if (errors.shipping_fullName) setErrors(prev => ({ ...prev, shipping_fullName: null }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-sm border ${errors.shipping_fullName ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:border-[#e87831]'} outline-none transition-all`}
                      placeholder="Enter Full Name"
                    />
                    {errors.shipping_fullName && <p className="text-red-500 text-xs mt-1">{errors.shipping_fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Primary Phone Number *
                    </label>
                    <input
                      type="text"
                      value={shipping.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setShipping(prev => ({ ...prev, phone: val }));
                        if (errors.shipping_phone) setErrors(prev => ({ ...prev, shipping_phone: null }));
                      }}
                      maxLength={10}
                      className={`w-full px-4 py-3 rounded-xl text-sm border ${errors.shipping_phone ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:border-[#e87831]'} outline-none transition-all`}
                      placeholder="10-digit mobile number"
                    />
                    {errors.shipping_phone && <p className="text-red-500 text-xs mt-1">{errors.shipping_phone}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Address Line 1 (Flat, House No., Building) *</label>
                    <input
                      type="text"
                      value={shipping.address1}
                      onChange={(e) => {
                        const val = e.target.value;
                        setShipping(prev => ({ ...prev, address1: val }));
                        if (errors.shipping_address1) setErrors(prev => ({ ...prev, shipping_address1: null }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-sm border ${errors.shipping_address1 ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:border-[#e87831]'} outline-none transition-all`}
                      placeholder="Flat / House No. / Floor"
                    />
                    {errors.shipping_address1 && <p className="text-red-500 text-xs mt-1">{errors.shipping_address1}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Address Line 2 (Street, Locality, Area)</label>
                    <input
                      type="text"
                      value={shipping.address2}
                      onChange={(e) => {
                        const val = e.target.value;
                        setShipping(prev => ({ ...prev, address2: val }));
                      }}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-[#e87831] rounded-xl text-sm outline-none transition-all"
                      placeholder="Colony / Street / Landmark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Postal Pincode *</label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        value={shipping.pincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setShipping(prev => ({ ...prev, pincode: val }));
                          if (errors.shipping_pincode) setErrors(prev => ({ ...prev, shipping_pincode: null }));
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-sm border ${errors.shipping_pincode ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:border-[#e87831]'} outline-none transition-all`}
                        placeholder="6-digit PIN"
                      />
                      {fetchingPin.shipping && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-[#e87831]" />}
                    </div>
                    {errors.shipping_pincode && <p className="text-red-500 text-xs mt-1">{errors.shipping_pincode}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">City *</label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(e) => {
                          const val = e.target.value;
                          setShipping(prev => ({ ...prev, city: val }));
                          if (errors.shipping_city) setErrors(prev => ({ ...prev, shipping_city: null }));
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-sm border ${errors.shipping_city ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:border-[#e87831]'} outline-none transition-all`}
                        placeholder="City"
                      />
                      {errors.shipping_city && <p className="text-red-500 text-xs mt-1">{errors.shipping_city}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">State *</label>
                      <input
                        type="text"
                        value={shipping.state}
                        onChange={(e) => {
                          const val = e.target.value;
                          setShipping(prev => ({ ...prev, state: val }));
                          if (errors.shipping_state) setErrors(prev => ({ ...prev, shipping_state: null }));
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-sm border ${errors.shipping_state ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:border-[#e87831]'} outline-none transition-all`}
                        placeholder="State"
                      />
                      {errors.shipping_state && <p className="text-red-500 text-xs mt-1">{errors.shipping_state}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                  <input type="checkbox" id="billingCheck" checked={isBillingSame} onChange={() => setIsBillingSame(!isBillingSame)} className="w-4 h-4 rounded text-[#e87831] focus:ring-[#e87831] cursor-pointer" />
                  <label htmlFor="billingCheck" className="text-sm font-medium text-gray-700 cursor-pointer select-none">Billing Address is identical to Shipping details</label>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-[#e87831] text-white py-4 rounded-xl font-bold tracking-wider hover:bg-[#cf6627] transition-all duration-300 shadow-md">
                    SAVE AND CONTINUE TO PAYMENT
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100 space-y-6 animate-fade-in">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Gateway Selection</h2>
                    <p className="text-xs text-gray-500">All connections are end-to-end encrypted under financial secure sockets layer.</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-bold text-[#e87831] hover:underline">Edit Shipping Info</button>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 text-sm text-gray-700 flex gap-3">
                  <ShieldCheck className="text-[#e87831] shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Delivery destination locked:</p>
                    <p className="text-xs mt-0.5 text-gray-600">{shipping.fullName} — {shipping.address1}, {shipping.city}, {shipping.pincode}</p>
                    <p className="text-xs mt-1 font-semibold text-[#e87831]">
                      {shippingCost === 0 ? "Local Delivery Selected (Hyderabad)" : "National Standard Shipping Selected"}
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 border rounded-xl flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-[#e87831] bg-orange-50/20 ring-1 ring-[#e87831]' : 'border-gray-200 hover:bg-gray-50/50'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-[#e87831] bg-white' : 'border-gray-300'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Razorpay Secure Checkout</p>
                    <p className="text-xs text-gray-500">Supports Credit/Debit Cards, Netbanking, UPI, and Wallet pipelines.</p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border rounded-xl flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#e87831] bg-orange-50/20 ring-1 ring-[#e87831]' : 'border-gray-200 hover:bg-gray-50/50'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#e87831] bg-white' : 'border-gray-300'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Cash On Delivery (COD)</p>
                    <p className="text-xs text-gray-500">Pay physically with cash or scan a QR code at your doorstep upon delivery.</p>
                  </div>
                </div>

                {paymentMethod === 'cod' && (
                  <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in text-sm text-gray-700">
                    <div className="flex gap-2.5 items-start">
                      <DollarSign className="text-gray-500 shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Payment Status</p>
                        <p className="font-semibold text-gray-900 mt-0.5">Pending Collection</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <Truck className="text-gray-500 shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Shipping</p>
                        <p className="font-semibold text-gray-900 mt-0.5">{shippingCost === 0 ? "Free Local Carrier" : "Standard National Express"}</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <Calendar className="text-gray-500 shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Est. Delivery</p>
                        <p className="font-semibold text-green-600 mt-0.5">{getEstimatedDeliveryDate()}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={handlePlaceOrder} disabled={loadingPayment} className="w-full bg-[#e87831] text-white py-4 rounded-xl font-bold tracking-wider hover:bg-[#cf6627] transition-all duration-300 shadow-md flex items-center justify-center gap-2">
                  {loadingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>PROCESSING SECURE ORDER...</span>
                    </>
                  ) : (
                    <span>{paymentMethod === 'cod' ? 'PLACE CASH ON DELIVERY ORDER' : `CONFIRM AND PAY ₹${totalPayable.toLocaleString('en-IN')}`}</span>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6">
            <div className="bg-white shadow-sm rounded-2xl p-5 border border-gray-100">
              <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Order Summary</h3>

              <div className="max-h-60 overflow-y-auto pr-1 space-y-3 custom-scrollbar mb-4">
                {validItems.map((item, index) => (
                  <div key={index} className="flex gap-3 text-sm items-center py-1">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900">₹{(Number(item.price) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100 text-sm font-medium text-gray-600">
                <div className="flex justify-between"><span>Cart Basket Subtotal</span><span className="text-gray-900 font-bold">₹{cartSubtotal.toLocaleString('en-IN')}</span></div>

                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">FREE</span>
                  ) : (
                    <span className="text-gray-900 font-bold">+ ₹{shippingCost.toLocaleString('en-IN')}</span>
                  )}
                </div>

                <div className="flex justify-between pt-3 border-t border-dashed border-gray-200 text-base font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-lg text-[#e87831]">₹{totalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium py-2">
              <ShieldCheck size={16} className="text-[#16a34a]" />
              <span>100% Certified Safe Multi-Tier Checkouts</span>
            </div>
          </div>

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center animate-scale-in">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Form Validation Error</h3>
            <p className="text-sm text-gray-500 mb-6">{modalMessage}</p>
            <button onClick={() => setShowModal(false)} className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-black transition-colors outline-none focus:outline-none">
              RECHECK FORM
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;