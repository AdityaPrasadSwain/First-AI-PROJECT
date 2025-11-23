import { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import { Users, ShoppingBag, Store } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, orders: 0, restaurants: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock stats for now as we don't have a dedicated stats endpoint
        // In a real app, we would fetch this from /api/admin/stats
        setLoading(false);
        setStats({ users: 150, orders: 45, restaurants: 12 });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <Users className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <ShoppingBag className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                            <Store className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Restaurants</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.restaurants}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                    <p className="text-gray-500">No recent activity to show.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
