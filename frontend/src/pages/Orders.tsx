import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Package, Clock, MapPin, CheckCircle, XCircle, Truck, ChefHat, ShoppingBag } from 'lucide-react';

interface Order {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    estimatedDeliveryTime?: string;
    deliveredAt?: string;
    restaurant: {
        name: string;
    };
    address: {
        addressLine: string;
        city: string;
        state: string;
        pincode: string;
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

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            console.log('[Orders] Fetching orders...');
            const response = await api.get('/orders/my');
            console.log('[Orders] Orders response:', response.data);
            setOrders(response.data);
        } catch (error: any) {
            console.error('[Orders] Error fetching orders:', error);
            console.error('[Orders] Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            'PLACED': '#feca57',
            'CONFIRMED': '#4ecdc4',
            'PREPARING': '#667eea',
            'OUT_FOR_DELIVERY': '#ff6b6b',
            'DELIVERED': '#44a08d',
            'CANCELLED': '#8b92a8'
        };
        return colors[status as keyof typeof colors] || '#8b92a8';
    };

    const getStatusIcon = (status: string) => {
        if (status === 'DELIVERED') return <CheckCircle size={20} />;
        if (status === 'CANCELLED') return <XCircle size={20} />;
        if (status === 'OUT_FOR_DELIVERY') return <Truck size={20} />;
        if (status === 'PREPARING') return <ChefHat size={20} />;
        if (status === 'CONFIRMED') return <ShoppingBag size={20} />;
        return <Clock size={20} />;
    };

    const getStatusSteps = (status: string) => {
        const steps = [
            { key: 'PLACED', label: 'Order Placed', icon: <ShoppingBag size={18} /> },
            { key: 'CONFIRMED', label: 'Confirmed', icon: <CheckCircle size={18} /> },
            { key: 'PREPARING', label: 'Preparing', icon: <ChefHat size={18} /> },
            { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: <Truck size={18} /> },
            { key: 'DELIVERED', label: 'Delivered', icon: <CheckCircle size={18} /> }
        ];
        
        const currentIndex = steps.findIndex(s => s.key === status);
        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            active: index === currentIndex
        }));
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

    if (orders.length === 0) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <Navbar />
                <div className="animate-scale-in" style={{
                    maxWidth: '600px',
                    margin: '5rem auto',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    background: 'white',
                    borderRadius: '2rem',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                    }}>
                        <Package size={60} color="white" />
                    </div>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#1a1a2e',
                        marginBottom: '1rem'
                    }}>
                        No orders yet
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#8b92a8',
                        marginBottom: '2rem'
                    }}>
                        Start exploring and place your first order!
                    </p>
                    <Link to="/" style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '9999px',
                        fontWeight: '700',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease'
                    }}>
                        Browse Restaurants
                    </Link>
                </div>
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
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                <h1 className="animate-fade-in-down" style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#1a1a2e',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <Package size={36} />
                    My Orders
                </h1>

                <div className="stagger-children" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    {orders.map((order) => (
                        <div key={order.id} className="card-3d-lift" style={{
                            background: 'white',
                            borderRadius: '1.5rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                            overflow: 'hidden'
                        }}>
                            {/* Header */}
                            <div style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
                                borderBottom: '1px solid #e4e9f7',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '1rem'
                            }}>
                                <div>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: '#8b92a8',
                                        marginBottom: '0.25rem'
                                    }}>
                                        Order ID: #{order.id}
                                    </p>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: '#8b92a8'
                                    }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '9999px',
                                    background: `${getStatusColor(order.status)}20`,
                                    color: getStatusColor(order.status),
                                    fontWeight: '700',
                                    fontSize: '0.875rem',
                                    textTransform: 'uppercase'
                                }}>
                                    {getStatusIcon(order.status)}
                                    {order.status.replace('_', ' ')}
                                </div>
                            </div>

                            {/* Items */}
                            <div style={{ padding: '1.5rem' }}>
                                {/* Restaurant Name */}
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: '#1a1a2e',
                                    marginBottom: '1rem'
                                }}>
                                    {order.restaurant.name}
                                </div>

                                {/* Delivery Status Tracker */}
                                {order.status !== 'CANCELLED' && (
                                    <div style={{
                                        padding: '1.5rem',
                                        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                                        borderRadius: '1rem',
                                        marginBottom: '1.5rem',
                                        border: '1px solid #e4e9f7'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            {getStatusSteps(order.status).map((step, index) => (
                                                <div key={step.key} style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    flex: 1,
                                                    position: 'relative'
                                                }}>
                                                    {index > 0 && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '20px',
                                                            right: '50%',
                                                            width: '100%',
                                                            height: '3px',
                                                            background: step.completed ? getStatusColor(order.status) : '#e4e9f7',
                                                            zIndex: 0
                                                        }} />
                                                    )}
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: step.completed 
                                                            ? `linear-gradient(135deg, ${getStatusColor(order.status)}, ${getStatusColor(order.status)}dd)`
                                                            : '#e4e9f7',
                                                        color: step.completed ? 'white' : '#8b92a8',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold',
                                                        zIndex: 1,
                                                        boxShadow: step.active ? `0 4px 15px ${getStatusColor(order.status)}40` : 'none',
                                                        transform: step.active ? 'scale(1.1)' : 'scale(1)',
                                                        transition: 'all 0.3s ease'
                                                    }}>
                                                        {step.icon}
                                                    </div>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        color: step.completed ? '#1a1a2e' : '#8b92a8',
                                                        fontWeight: step.active ? '700' : '500',
                                                        marginTop: '0.5rem',
                                                        textAlign: 'center',
                                                        maxWidth: '80px'
                                                    }}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Estimated Delivery Time */}
                                        {order.estimatedDeliveryTime && order.status !== 'DELIVERED' && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                padding: '0.75rem',
                                                background: 'white',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.9rem',
                                                color: '#667eea',
                                                fontWeight: '600'
                                            }}>
                                                <Clock size={16} />
                                                Estimated delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        )}
                                        
                                        {/* Delivered Time */}
                                        {order.deliveredAt && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                padding: '0.75rem',
                                                background: 'white',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.9rem',
                                                color: '#44a08d',
                                                fontWeight: '600'
                                            }}>
                                                <CheckCircle size={16} />
                                                Delivered at: {new Date(order.deliveredAt).toLocaleString('en-US', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    {order.items.map((item) => (
                                        <div key={item.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{
                                                fontSize: '1rem',
                                                color: '#1a1a2e'
                                            }}>
                                                {item.menuItem.name} × {item.quantity}
                                            </span>
                                            <span style={{
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: '#667eea'
                                            }}>
                                                ₹{item.menuItem.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}
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
                                        alignItems: 'start',
                                        gap: '0.5rem',
                                        color: '#8b92a8'
                                    }}>
                                        <MapPin size={18} style={{ marginTop: '2px' }} />
                                        <div>
                                            <p style={{ fontSize: '0.95rem', margin: 0 }}>
                                                {order.address.addressLine}, {order.address.city}
                                            </p>
                                            <p style={{ fontSize: '0.95rem', margin: 0 }}>
                                                {order.address.state} - {order.address.pincode}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem 0',
                                    borderTop: '2px dashed #e4e9f7'
                                }}>
                                    <span style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        color: '#1a1a2e'
                                    }}>
                                        Total Amount
                                    </span>
                                    <span style={{
                                        fontSize: '1.75rem',
                                        fontWeight: '800',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        ₹{order.totalAmount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;
