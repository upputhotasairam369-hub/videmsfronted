import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Loader, User, Mail, ShieldCheck } from 'lucide-react';
import { authAPI } from '../services/api';
import {
  loginWithOtp,
  setOtpSent,
  clearError,
  updateUserProfile // 🚀 We use the new Thunk we added to authslice!
} from '../store/slices/authslice';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error, otpSent, isAuthenticated, user } = useSelector((state) => state.auth);

  // 🚀 FIX 1: Prevent Amnesia. Load from sessionStorage so it survives page refreshes!
  const [phone, setPhone] = useState(() => sessionStorage.getItem('saved_phone') || '');
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);

  // Profile Form State for Step 3
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  const from = location.state?.from?.pathname || '/';

  // 🚀 KEEP STORAGE IN SYNC
  useEffect(() => {
    sessionStorage.setItem('saved_phone', phone);
  }, [phone]);

  // 🚀 THE TRAFFIC CONTROLLER: Where should the user go?
  useEffect(() => {
    if (isAuthenticated && user) {
      // If they are logged in but missing a name, do nothing (stay and render the profile form)
      if (!user.first_name || !user.email) {
        return;
      }
      // If fully logged in and profile is complete -> Clean up and send home!
      sessionStorage.removeItem('saved_phone');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  // --- Handlers ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.match(/^[0-9]{10}$/)) return;

    setSendingOtp(true);
    try {
      await authAPI.sendOtp({ phone });
      dispatch(setOtpSent(true));
      dispatch(clearError());
    } catch (err) {
      console.error("Failed to send OTP", err);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    dispatch(loginWithOtp({ phone, otp }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // Dispatch the data to Django. When successful, the 'Traffic Controller' useEffect above will auto-redirect!
    dispatch(updateUserProfile(profile));
  };

  // =========================================================================
  // STEP 3 RENDER: Complete Profile Form
  // =========================================================================
  if (isAuthenticated && (!user?.first_name || !user?.email)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#f97316]">
              <User size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="mt-2 text-sm text-gray-500">Just a few more details to set up your account.</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">First Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#f97316] outline-none transition-colors"
                  placeholder="John"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#f97316] outline-none transition-colors"
                  placeholder="Doe"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#f97316] outline-none transition-colors"
                  placeholder="john@example.com"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f97316] text-white py-3.5 rounded-xl font-bold tracking-wide hover:bg-[#ea580c] transition disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'SAVE & CONTINUE'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 1 & 2 RENDER: Phone & OTP Forms
  // =========================================================================
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Secure login with your phone number</p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-bold text-gray-500">
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  className="pl-14 w-full px-4 py-3 border border-gray-200 rounded-xl font-medium focus:border-[#f97316] transition outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

            <button
              type="submit"
              disabled={sendingOtp || phone.length !== 10}
              className="w-full bg-[#f97316] text-white py-3.5 rounded-xl font-bold tracking-wide hover:bg-[#ea580c] transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {sendingOtp ? <Loader className="w-5 h-5 animate-spin" /> : <>SEND OTP <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium pt-2">
              <ShieldCheck size={14} className="text-green-500" />
              <span>We never share your personal information.</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-8 space-y-6 animate-fade-in-up">
            <div className="text-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Enter the OTP sent to</p>
              <p className="font-bold text-gray-900 text-lg mt-1">+91 {phone}</p>
            </div>

            <div>
              <input
                type="text"
                placeholder="••••••"
                maxLength={6}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-center text-3xl tracking-[0.4em] font-bold focus:border-[#f97316] outline-none transition-colors"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#f97316] text-white py-3.5 rounded-xl font-bold tracking-wide hover:bg-[#ea580c] transition disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'VERIFY & LOGIN'}
            </button>

            <button
              type="button"
              onClick={() => { dispatch(setOtpSent(false)); setOtp(''); }}
              className="w-full text-sm text-gray-500 hover:text-[#f97316] font-semibold transition-colors"
            >
              Edit Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;