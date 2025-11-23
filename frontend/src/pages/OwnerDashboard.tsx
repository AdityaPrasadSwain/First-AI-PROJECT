import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Edit, Trash, Store, Utensils, DollarSign, TrendingUp, X, Package, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    veg: boolean;
    imageUrl: string;
}

interface Restaurant {
    id: number;
    name: string;
}

interface Order {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    restaurant?: {
        id: number;
        name: string;
    };
    address?: {
        addressLine: string;
        city: string;
    };
    items: Array<{
        id: number;
        menuItem: {
            name: string;
            price: number;
        };
        quantity: number;
        price: number;
    }>;
}

const OwnerDashboard = () => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
    const { register, handleSubmit, reset, setValue } = useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurantData();
    }, []);

    const fetchRestaurantData = async () => {
        try {
            console.log('[OwnerDashboard] Fetching restaurant data...');
            const resResponse = await api.get('/restaurants/my');
            console.log('[OwnerDashboard] My restaurants response:', resResponse.data);
            if (resResponse.data.length > 0) {
                const r = resResponse.data[0];
                setRestaurant(r);
                console.log('[OwnerDashboard] Fetching menu and orders for restaurant:', r.id);
                const [menuResponse, ordersResponse] = await Promise.all([
                    api.get(`/restaurants/${r.id}/menu`),
                    api.get(`/orders/restaurant/${r.id}`)
                ]);
                console.log('[OwnerDashboard] Menu response:', menuResponse.data);
                console.log('[OwnerDashboard] Orders response:', ordersResponse.data);
                setMenu(menuResponse.data);
                setOrders(ordersResponse.data);
            } else {
                console.log('[OwnerDashboard] No restaurants found for this owner');
            }
        } catch (error: any) {
            console.error('[OwnerDashboard] Error fetching data:', error);
            console.error('[OwnerDashboard] Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            await api.put(`/orders/${orderId}/status?status=${newStatus}`);
            Swal.fire({
                icon: 'success',
                title: 'Status Updated!',
                text: `Order status changed to ${newStatus}`,
                timer: 1500,
                showConfirmButton: false
            });
            fetchRestaurantData();
        } catch (error) {
            console.error('Error updating order status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update order status'
            });
        }
    };

    const onSubmit = async (data: any) => {
        if (!restaurant) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No restaurant selected. Please refresh the page.'
            });
            return;
        }

        // Ensure proper data types
        const payload = {
            ...data,
            price: parseFloat(data.price),
            veg: Boolean(data.veg)
        };

        try {
            if (editingItem) {
                await api.put(`/menu-items/${editingItem.id}`, payload);
            } else {
                await api.post(`/restaurants/${restaurant.id}/menu`, payload);
            }
            setShowAddModal(false);
            setEditingItem(null);
            reset();
            fetchRestaurantData();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: editingItem ? 'Item updated successfully' : 'Item added successfully',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error: any) {
            console.error('Error saving item:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save item';
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage
            });
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/menu-items/${id}`);
                fetchRestaurantData();
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting item:', error);
                Swal.fire(
                    'Error!',
                    'Failed to delete item.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        setValue('name', item.name);
        setValue('description', item.description);
        setValue('price', item.price);
        setValue('veg', item.veg);
        setValue('imageUrl', item.imageUrl);
        setShowAddModal(true);
    };

    const openAddModal = () => {
        setEditingItem(null);
        reset();
        setShowAddModal(true);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <div className="spinner" style={{ width: '60px', height: '60px', borderWidth: '4px' }}></div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
            <Navbar />

            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                {/* Header Section */}
                <div className="animate-fade-in-down" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '1.5rem',
                    padding: '2.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative circles */}
                    <div className="animate-float" style={{
                        position: 'absolute',
                        width: '200px',
                        height: '200px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        top: '-50px',
                        right: '-50px'
                    }}></div>

                    <div style={{
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '0.5rem'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)'
                                }}>
                                    <Store size={32} color="white" />
                                </div>
                                <h1 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    margin: 0
                                }}>
                                    {restaurant ? restaurant.name : 'Restaurant Dashboard'}
                                </h1>
                            </div>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '1.1rem',
                                margin: 0
                            }}>
                                Manage your menu and orders
                            </p>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="btn btn-primary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '1rem 1.5rem',
                                background: 'white',
                                color: '#667eea',
                                borderRadius: '1rem',
                                border: 'none',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <Plus size={20} />
                            Add Menu Item
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stagger-children" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {[
                        { icon: Utensils, label: 'Total Items', value: menu.length, color: '#ff6b6b', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' },
                        { icon: DollarSign, label: 'Avg Price', value: `₹${menu.length > 0 ? Math.round(menu.reduce((acc, item) => acc + item.price, 0) / menu.length) : 0}`, color: '#4ecdc4', gradient: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)' },
                        { icon: TrendingUp, label: 'Active', value: menu.length, color: '#667eea', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
                    ].map((stat, idx) => (
                        <div key={idx} className="card-3d-lift" style={{
                            background: 'white',
                            borderRadius: '1.5rem',
                            padding: '1.5rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                background: stat.gradient,
                                borderRadius: '50%',
                                opacity: 0.1
                            }}></div>
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    background: stat.gradient,
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem',
                                    boxShadow: `0 4px 15px ${stat.color}40`
                                }}>
                                    <stat.icon size={24} color="white" />
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#8b92a8', margin: 0, marginBottom: '0.25rem' }}>
                                    {stat.label}
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="animate-fade-in" style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    background: 'white',
                    padding: '0.5rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                }}>
                    <button
                        onClick={() => setActiveTab('menu')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            borderRadius: '0.75rem',
                            background: activeTab === 'menu' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                            color: activeTab === 'menu' ? 'white' : '#8b92a8',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Utensils size={20} />
                        Menu Items
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            borderRadius: '0.75rem',
                            background: activeTab === 'orders' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                            color: activeTab === 'orders' ? 'white' : '#8b92a8',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Package size={20} />
                        Orders ({orders.length})
                    </button>
                </div>

                {/* Orders Section */}
                {activeTab === 'orders' && (
                    <div className="animate-fade-in-up" style={{
                        background: 'white',
                        borderRadius: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
                            borderBottom: '1px solid #e4e9f7'
                        }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#1a1a2e',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <Package size={24} />
                                Restaurant Orders
                            </h2>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {orders.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    color: '#8b92a8'
                                }}>
                                    <Package size={48} style={{ margin: '0 auto 1rem' }} />
                                    <p style={{ fontSize: '1.1rem' }}>No orders yet</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {orders.map((order) => (
                                        <div key={order.id} style={{
                                            border: '1px solid #e4e9f7',
                                            borderRadius: '1rem',
                                            padding: '1.5rem',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'start',
                                                marginBottom: '1rem',
                                                flexWrap: 'wrap',
                                                gap: '1rem'
                                            }}>
                                                <div>
                                                    <p style={{
                                                        fontSize: '0.875rem',
                                                        color: '#8b92a8',
                                                        marginBottom: '0.25rem'
                                                    }}>
                                                        Order #{order.id}
                                                    </p>
                                                    <p style={{
                                                        fontSize: '0.875rem',
                                                        color: '#8b92a8',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}>
                                                        <Clock size={14} />
                                                        {new Date(order.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div style={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: '700',
                                                    color: '#667eea'
                                                }}>
                                                    ₹{order.totalAmount}
                                                </div>
                                            </div>

                                            <div style={{
                                                marginBottom: '1rem',
                                                paddingBottom: '1rem',
                                                borderBottom: '1px solid #f0f0f0'
                                            }}>
                                                {order.items.map((item) => (
                                                    <p key={item.id} style={{
                                                        fontSize: '0.95rem',
                                                        color: '#1a1a2e',
                                                        margin: '0.25rem 0'
                                                    }}>
                                                        {item.menuItem.name} × {item.quantity}
                                                    </p>
                                                ))}
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    background: '#f8f9fa',
                                                    color: '#1a1a2e'
                                                }}>
                                                    Current: {order.status}
                                                </span>
                                                {order.status === 'PLACED' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            border: 'none',
                                                            borderRadius: '0.5rem',
                                                            background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                            fontSize: '0.875rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        Confirm Order
                                                    </button>
                                                )}
                                                {order.status === 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            border: 'none',
                                                            borderRadius: '0.5rem',
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                            fontSize: '0.875rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        Start Preparing
                                                    </button>
                                                )}
                                                {order.status === 'PREPARING' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            border: 'none',
                                                            borderRadius: '0.5rem',
                                                            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                            fontSize: '0.875rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        Out for Delivery
                                                    </button>
                                                )}
                                                {order.status === 'OUT_FOR_DELIVERY' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            border: 'none',
                                                            borderRadius: '0.5rem',
                                                            background: 'linear-gradient(135deg, #44a08d 0%, #4ecdc4 100%)',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                            fontSize: '0.875rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        Mark as Delivered
                                                    </button>
                                                )}
                                                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            border: 'none',
                                                            borderRadius: '0.5rem',
                                                            background: 'rgba(255, 107, 107, 0.1)',
                                                            color: '#ff6b6b',
                                                            fontWeight: '600',
                                                            fontSize: '0.875rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Menu Items Table */}
                {activeTab === 'menu' && !restaurant ? (
                    <div className="animate-fade-in" style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'white',
                        borderRadius: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                    }}>
                        <Store size={64} color="#8b92a8" style={{ marginBottom: '1rem' }} />
                        <p style={{ fontSize: '1.25rem', color: '#8b92a8' }}>
                            You don't have any restaurants listed yet.
                        </p>
                    </div>
                ) : activeTab === 'menu' ? (
                    <div className="animate-fade-in-up" style={{
                        background: 'white',
                        borderRadius: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
                            borderBottom: '1px solid #e4e9f7'
                        }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#1a1a2e',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <Utensils size={24} />
                                Menu Items
                            </h2>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <th style={{
                                            padding: '1rem 1.5rem',
                                            textAlign: 'left',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: '#8b92a8',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Item</th>
                                        <th style={{
                                            padding: '1rem 1.5rem',
                                            textAlign: 'left',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: '#8b92a8',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Description</th>
                                        <th style={{
                                            padding: '1rem 1.5rem',
                                            textAlign: 'left',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: '#8b92a8',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Price</th>
                                        <th style={{
                                            padding: '1rem 1.5rem',
                                            textAlign: 'left',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: '#8b92a8',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Type</th>
                                        <th style={{
                                            padding: '1rem 1.5rem',
                                            textAlign: 'right',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: '#8b92a8',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menu.map((item) => (
                                        <tr key={item.id} style={{
                                            borderBottom: '1px solid #f0f0f0',
                                            transition: 'background 0.2s ease'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    {item.imageUrl && (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                borderRadius: '0.75rem',
                                                                objectFit: 'cover',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                            }}
                                                        />
                                                    )}
                                                    <span style={{
                                                        fontSize: '0.95rem',
                                                        fontWeight: '600',
                                                        color: '#1a1a2e'
                                                    }}>{item.name}</span>
                                                </div>
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                fontSize: '0.875rem',
                                                color: '#8b92a8',
                                                maxWidth: '300px'
                                            }}>
                                                {item.description}
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                fontSize: '1rem',
                                                fontWeight: '700',
                                                color: '#667eea'
                                            }}>
                                                ₹{item.price}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <span style={{
                                                    padding: '0.375rem 0.875rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    background: item.veg ? 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)' : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                                    color: 'white',
                                                    boxShadow: item.veg ? '0 2px 8px rgba(78, 205, 196, 0.3)' : '0 2px 8px rgba(255, 107, 107, 0.3)'
                                                }}>
                                                    {item.veg ? '🌱 Veg' : '🍖 Non-Veg'}
                                                </span>
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                textAlign: 'right'
                                            }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button style={{
                                                        padding: '0.5rem',
                                                        background: 'rgba(102, 126, 234, 0.1)',
                                                        color: '#667eea',
                                                        border: 'none',
                                                        borderRadius: '0.5rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                        onClick={() => handleEdit(item)}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                                                            e.currentTarget.style.transform = 'scale(1.1)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                        }}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button style={{
                                                        padding: '0.5rem',
                                                        background: 'rgba(255, 107, 107, 0.1)',
                                                        color: '#ff6b6b',
                                                        border: 'none',
                                                        borderRadius: '0.5rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                        onClick={() => handleDelete(item.id)}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)';
                                                            e.currentTarget.style.transform = 'scale(1.1)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                        }}>
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}

                {/* Add Modal */}
                {showAddModal && (
                    <div className="animate-fade-in" style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        zIndex: 1000
                    }}>
                        <div className="animate-scale-in" style={{
                            background: 'white',
                            borderRadius: '1.5rem',
                            maxWidth: '500px',
                            width: '100%',
                            padding: '2rem',
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: 'bold',
                                    color: '#1a1a2e',
                                    margin: 0
                                }}>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.05)',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '600',
                                        color: '#1a1a2e',
                                        fontSize: '0.9rem'
                                    }}>Item Name</label>
                                    <input
                                        {...register('name')}
                                        placeholder="Margherita Pizza"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            border: '2px solid #e4e9f7',
                                            borderRadius: '0.75rem',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#667eea';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e4e9f7';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '600',
                                        color: '#1a1a2e',
                                        fontSize: '0.9rem'
                                    }}>Description</label>
                                    <textarea
                                        {...register('description')}
                                        placeholder="Delicious pizza with fresh ingredients"
                                        required
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            border: '2px solid #e4e9f7',
                                            borderRadius: '0.75rem',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s ease',
                                            outline: 'none',
                                            resize: 'vertical'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#667eea';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e4e9f7';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '600',
                                        color: '#1a1a2e',
                                        fontSize: '0.9rem'
                                    }}>Price (₹)</label>
                                    <input
                                        {...register('price')}
                                        type="number"
                                        placeholder="299"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            border: '2px solid #e4e9f7',
                                            borderRadius: '0.75rem',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#667eea';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e4e9f7';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '600',
                                        color: '#1a1a2e',
                                        fontSize: '0.9rem'
                                    }}>Image URL</label>
                                    <input
                                        {...register('imageUrl')}
                                        placeholder="https://example.com/image.jpg"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            border: '2px solid #e4e9f7',
                                            borderRadius: '0.75rem',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#667eea';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e4e9f7';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem',
                                    background: '#f8f9fa',
                                    borderRadius: '0.75rem'
                                }}>
                                    <input
                                        {...register('veg')}
                                        type="checkbox"
                                        id="veg"
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer'
                                        }}
                                    />
                                    <label htmlFor="veg" style={{
                                        fontSize: '1rem',
                                        color: '#1a1a2e',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}>🌱 Vegetarian</label>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginTop: '0.5rem'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: '1rem',
                                            border: '2px solid #e4e9f7',
                                            background: 'white',
                                            color: '#1a1a2e',
                                            borderRadius: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{
                                            flex: 1,
                                            padding: '1rem',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            borderRadius: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {editingItem ? 'Update Item' : 'Add Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
