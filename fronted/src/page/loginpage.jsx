import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Loader, User, Mail } from 'lucide-react';
import { loginWithGoogle, clearError, updateUserProfile } from '../store/slices/authslice';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Profile Form State for Step 2
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  const from = location.state?.from?.pathname || '/';

  // Use REACT_APP_GOOGLE_CLIENT_ID from env or fallback to the correct client ID if deployed to Vercel without env vars
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "35112506714-6tn1eei86r6hf2aibhddtc00l26luc9a.apps.googleusercontent.com";

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.first_name || !user.email) {
        return;
      }
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(loginWithGoogle({ credential: credentialResponse.credential }));
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(profile));
  };

  if (isAuthenticated && (!user?.first_name || !user?.email)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up">
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

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Log in</h2>
            <p className="mt-2 text-sm text-gray-600">Continue with Google to securely access your account</p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="rectangular"
                size="large"
                theme="outline"
                text="continue_with"
                width="100%"
              />
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase">Or continue with email</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Email login functionality coming soon!"); }}>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#f97316] outline-none transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#f97316] outline-none transition-colors"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold tracking-wide hover:bg-black transition flex items-center justify-center"
              >
                SIGN IN
              </button>
            </form>

            {loading && (
              <div className="flex justify-center mt-4">
                <Loader className="w-6 h-6 animate-spin text-[#f97316]" />
              </div>
            )}

            {error && <p className="text-sm text-red-600 text-center font-medium mt-4">{error}</p>}

          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;