import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Activity,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';
import { adminAPI } from '../services/api';
import ProtectedRoute from '../components/common/protectedroute';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, prodRes, orderRes] = await Promise.all([
        adminAPI.dashboard(),
        adminAPI.products({ limit: 10 }),
        adminAPI.orders({ limit: 10 }),
      ]);
      setStats(dashRes.data);
      setProducts(prodRes.data.results);
      setOrders(orderRes.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 6390 },
    { name: 'Sun', sales: 3490 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 65, color: '#16a34a' },
    { name: 'Shipped', value: 20, color: '#2563eb' },
    { name: 'Pending', value: 10, color: '#d97706' },
    { name: 'Cancelled', value: 5, color: '#dc2626' },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    +12%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹2.4L</p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    +8%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-500">Orders Today</p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                    +24%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">1,284</p>
                <p className="text-sm text-gray-500">New Customers</p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                    -3%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <p className="text-sm text-gray-500">Pending Orders</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Sales Overview
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#b45309"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Status
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {orderStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Products</h3>
              <button className="bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-800">
                + Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0]?.url}
                            alt=""
                            className="w-10 h-10 rounded bg-gray-100 object-cover"
                          />
                          <span className="font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        ₹{product.variants?.[0]?.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${
                            product.variants?.[0]?.inventory_quantity < 10
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {product.variants?.[0]?.inventory_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.is_active
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-primary-600 hover:text-primary-800 font-medium">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3">Order #</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-primary-700">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4">{order.user_id}</td>
                      <td className="px-6 py-4 font-medium">
                        ₹{order.grand_total?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                          ${
                            order.status === 'delivered'
                              ? 'bg-green-50 text-green-700'
                              : order.status === 'shipped'
                              ? 'bg-blue-50 text-blue-700'
                              : order.status === 'cancelled'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-primary-700">Admin Panel</h2>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  activeTab === item.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-3 flex items-center justify-between">
          <h2 className="font-bold text-primary-700">Admin</h2>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
          >
            {sidebarItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 pt-16 md:pt-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab}
              </h1>
              <div className="flex items-center gap-2">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
                  />
                </div>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
