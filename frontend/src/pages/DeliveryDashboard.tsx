import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Package, MapPin, Phone, User, Clock, CheckCircle, Truck, Navigation } from 'lucide-react';
import Swal from 'sweetalert2';

interface Order {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    estimatedDeliveryTime?: string;
    restaurant: {
        id: number;
        name: string;
        address: string;
    };
    address: {
        addressLine: string;
        city: string;
        state: string;
        pincode: string;
    };
    user: {
        name: string;
        phone: string;
    };
    items: Array<{
        id: number;
        menuItem: {
            name: string;
            price: number;
        };
        quantity: number;
    }>;
}

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'available' | 'delivering'>('available');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            console.log('[DeliveryDashboard] Fetching orders...');
            const response = await api.get('/orders/delivery/available');
            console.log('[DeliveryDashboard] Orders response:', response.data);
            setOrders(response.data);
        } catch (error: any) {
            console.error('[DeliveryDashboard] Error fetching orders:', error);
            console.error('[DeliveryDashboard] Error details:', error.response?.data);
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
                text: `Order status changed to ${newStatus.replace('_', ' ')}`,
                timer: 1500,
                showConfirmButton: false
            });
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update order status'
            });
        }
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'PREPARING': '#667eea',
            'OUT_FOR_DELIVERY': '#ff6b6b',
            'DELIVERED': '#44a08d'
        };
        return colors[status] || '#8b92a8';
    };

    const availableOrders = orders.filter(o => o.status === 'PREPARING');
    const deliveringOrders = orders.filter(o => o.status === 'OUT_FOR_DELIVERY');

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
                {/* Header */}
                <div className="animate-fade-in-down" style={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                    borderRadius: '1.5rem',
                    padding: '2.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 40px rgba(255, 107, 107, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
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
                                    <Truck size={32} color="white" />
                                </div>
                                <h1 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    margin: 0
                                }}>
                                    Delivery Dashboard
                                </h1>
                            </div>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '1.1rem',
                                margin: 0
                            }}>
                                Manage your deliveries
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stagger-children" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div className="card-3d-lift" style={{
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
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '50%',
                            opacity: 0.1
                        }}></div>
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}>
                                <Package size={24} color="white" />
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#8b92a8', margin: 0, marginBottom: '0.25rem' }}>
                                Available Orders
                            </p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
                                {availableOrders.length}
                            </p>
                        </div>
                    </div>

                    <div className="card-3d-lift" style={{
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
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                            borderRadius: '50%',
                            opacity: 0.1
                        }}></div>
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem',
                                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
                            }}>
                                <Truck size={24} color="white" />
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#8b92a8', margin: 0, marginBottom: '0.25rem' }}>
                                Out for Delivery
                            </p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
                                {deliveringOrders.length}
                            </p>
                        </div>
                    </div>
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
                        onClick={() => setActiveTab('available')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            borderRadius: '0.75rem',
                            background: activeTab === 'available' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                            color: activeTab === 'available' ? 'white' : '#8b92a8',
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
                        Available ({availableOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('delivering')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            borderRadius: '0.75rem',
                            background: activeTab === 'delivering' ? 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' : 'transparent',
                            color: activeTab === 'delivering' ? 'white' : '#8b92a8',
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
                        <Truck size={20} />
                        Delivering ({deliveringOrders.length})
                    </button>
                </div>

                {/* Orders List */}
                <div className="animate-fade-in-up" style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1.5rem' }}>
                        {(activeTab === 'available' ? availableOrders : deliveringOrders).length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: '#8b92a8'
                            }}>
                                <Package size={48} style={{ margin: '0 auto 1rem' }} />
                                <p style={{ fontSize: '1.1rem' }}>
                                    {activeTab === 'available' ? 'No orders available for pickup' : 'No active deliveries'}
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {(activeTab === 'available' ? availableOrders : deliveringOrders).map((order) => (
                                    <div key={order.id} style={{
                                        border: '1px solid #e4e9f7',
                                        borderRadius: '1rem',
                                        padding: '1.5rem',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        {/* Order Header */}
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
                                                padding: '0.5rem 1rem',
                                                borderRadius: '0.5rem',
                                                background: `${getStatusColor(order.status)}20`,
                                                color: getStatusColor(order.status),
                                                fontWeight: '600',
                                                fontSize: '0.875rem'
                                            }}>
                                                {order.status.replace('_', ' ')}
                                            </div>
                                        </div>

                                        {/* Restaurant Info */}
                                        <div style={{
                                            padding: '1rem',
                                            background: '#f8f9fa',
                                            borderRadius: '0.75rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <Navigation size={16} color="#667eea" />
                                                <span style={{ fontWeight: '700', color: '#1a1a2e' }}>Pickup from:</span>
                                            </div>
                                            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a2e', margin: '0 0 0.25rem 0' }}>
                                                {order.restaurant.name}
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: '#8b92a8', margin: 0 }}>
                                                {order.restaurant.address}
                                            </p>
                                        </div>

                                        {/* Delivery Address */}
                                        <div style={{
                                            padding: '1rem',
                                            background: '#f8f9fa',
                                            borderRadius: '0.75rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <MapPin size={16} color="#ff6b6b" />
                                                <span style={{ fontWeight: '700', color: '#1a1a2e' }}>Deliver to:</span>
                                            </div>
                                            <p style={{ fontSize: '0.95rem', color: '#1a1a2e', margin: '0 0 0.25rem 0' }}>
                                                {order.address.addressLine}, {order.address.city}
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: '#8b92a8', margin: 0 }}>
                                                {order.address.state} - {order.address.pincode}
                                            </p>
                                        </div>

                                        {/* Customer Info */}
                                        <div style={{
                                            padding: '1rem',
                                            background: '#f8f9fa',
                                            borderRadius: '0.75rem',
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            gap: '1.5rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <User size={16} color="#4ecdc4" />
                                                <span style={{ fontSize: '0.95rem', color: '#1a1a2e' }}>{order.user.name}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Phone size={16} color="#4ecdc4" />
                                                <span style={{ fontSize: '0.95rem', color: '#1a1a2e' }}>{order.user.phone}</span>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div style={{
                                            marginBottom: '1rem',
                                            paddingBottom: '1rem',
                                            borderBottom: '1px solid #f0f0f0'
                                        }}>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#8b92a8', marginBottom: '0.5rem' }}>
                                                ORDER ITEMS
                                            </p>
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

                                        {/* Total and Actions */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '1rem'
                                        }}>
                                            <div style={{
                                                fontSize: '1.5rem',
                                                fontWeight: '700',
                                                color: '#667eea'
                                            }}>
                                                ₹{order.totalAmount}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {order.status === 'PREPARING' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                                                        style={{
                                                            padding: '0.75rem 1.5rem',
                                                            border: 'none',
                                                            borderRadius: '0.75rem',
                                                            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                            fontSize: '0.95rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem'
                                                        }}
                                                    >
                                                        <Truck size={18} />
                                                        Pick Up Order
                                                    </button>
                                                )}
                                                {order.status === 'OUT_FOR_DELIVERY' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                                        style={{
                                                            padding: '0.75rem 1.5rem',
                                                            border: 'none',
                                                            borderRadius: '0.75rem',
                                                            background: 'linear-gradient(135deg, #44a08d 0%, #4ecdc4 100%)',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                            fontSize: '0.95rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem'
                                                        }}
                                                    >
                                                        <CheckCircle size={18} />
                                                        Mark as Delivered
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
