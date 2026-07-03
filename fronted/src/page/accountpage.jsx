// src/page/accountpage.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authslice';
import { LogOut, User, Mail, Phone, ShoppingBag } from 'lucide-react';

const AccountPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Fetch the currently logged-in user details from Redux
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout()); // Clears token and state
        navigate('/login'); // Sends user back to login screen
    };

    if (!user) return null;

    return (
        <div className="min-h-[70vh] bg-[#f4f5f7] py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up">
                    <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-[#f97316] shrink-0">
                            <User size={36} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 capitalize">{user.first_name} {user.last_name}</h2>
                            <p className="text-sm font-medium text-gray-500 mt-1">Premium Member</p>
                        </div>
                    </div>

                    <div className="space-y-5 mb-10">
                        <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">{user.email || 'No email provided'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">+91 {user.username}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-black transition-colors outline-none focus:outline-none"
                        >
                            <ShoppingBag size={20} />
                            MY ORDERS
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3.5 rounded-xl font-bold hover:bg-red-100 transition-colors outline-none focus:outline-none"
                        >
                            <LogOut size={20} />
                            LOGOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;