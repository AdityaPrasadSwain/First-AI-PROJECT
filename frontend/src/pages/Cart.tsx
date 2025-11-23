import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';

interface CartItem {
    id: number;
    menuItem: {
        id: number;
        name: string;
        price: number;
        veg: boolean;
    };
    quantity: number;
    price: number;
}

interface Cart {
    id: number;
    items: CartItem[];
    totalAmount: number;
}

const Cart = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const { refreshCart } = useCart();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            await removeItem(itemId);
            return;
        }
        try {
            await api.put(`/cart/update/${itemId}?quantity=${newQuantity}`);
            await fetchCart();
            await refreshCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await api.delete(`/cart/remove/${itemId}`);
            await fetchCart();
            await refreshCart();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart/clear');
            await fetchCart();
            await refreshCart();
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
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

    if (!cart || cart.items.length === 0) {
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
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)'
                    }}>
                        <ShoppingBag size={60} color="white" />
                    </div>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#1a1a2e',
                        marginBottom: '1rem'
                    }}>
                        Your cart is empty
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#8b92a8',
                        marginBottom: '2rem'
                    }}>
                        Looks like you haven't added anything yet
                    </p>
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '9999px',
                        fontWeight: '700',
                        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
                        }}>
                        Browse Restaurants
                        <ArrowRight size={20} />
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
                maxWidth: '1000px',
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
                    <ShoppingBag size={36} />
                    Your Cart
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '1.5rem'
                }}>
                    {/* Cart Items */}
                    <div className="animate-fade-in-up" style={{
                        background: 'white',
                        borderRadius: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0'
                        }}>
                            {cart.items.map((item, index) => (
                                <div key={item.id} className="card-3d-lift" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1.5rem',
                                    borderBottom: index < cart.items.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        flex: 1
                                    }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            border: `2px solid ${item.menuItem.veg ? '#4ecdc4' : '#ff6b6b'}`,
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                background: item.menuItem.veg ? '#4ecdc4' : '#ff6b6b',
                                                borderRadius: '50%'
                                            }}></div>
                                        </div>
                                        <div>
                                            <h3 style={{
                                                fontSize: '1.125rem',
                                                fontWeight: '700',
                                                color: '#1a1a2e',
                                                marginBottom: '0.25rem'
                                            }}>
                                                {item.menuItem.name}
                                            </h3>
                                            <p style={{
                                                fontSize: '0.95rem',
                                                color: '#8b92a8'
                                            }}>
                                                ₹{item.price} each
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            borderRadius: '0.75rem',
                                            padding: '0.5rem'
                                        }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'white',
                                                    color: '#667eea',
                                                    border: 'none',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#667eea';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'white';
                                                    e.currentTarget.style.color = '#667eea';
                                                }}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span style={{
                                                fontSize: '1.125rem',
                                                fontWeight: '700',
                                                color: '#1a1a2e',
                                                minWidth: '30px',
                                                textAlign: 'center'
                                            }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'white',
                                                    color: '#667eea',
                                                    border: 'none',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#667eea';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'white';
                                                    e.currentTarget.style.color = '#667eea';
                                                }}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <span style={{
                                            fontSize: '1.5rem',
                                            fontWeight: '800',
                                            color: '#667eea'
                                        }}>
                                            ₹{item.price * item.quantity}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            style={{
                                                padding: '0.75rem',
                                                background: 'rgba(255, 107, 107, 0.1)',
                                                color: '#ff6b6b',
                                                border: 'none',
                                                borderRadius: '0.75rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)';
                                                e.currentTarget.style.transform = 'scale(1.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="animate-fade-in" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
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

                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '2rem'
                            }}>
                                <span style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.9)'
                                }}>
                                    Total Amount
                                </span>
                                <span style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}>
                                    ₹{cart.totalAmount}
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: '1rem'
                            }}>
                                <button
                                    onClick={clearCart}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '0.75rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                                >
                                    Clear Cart
                                </button>
                                <Link
                                    to="/checkout"
                                    className="btn"
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '1rem',
                                        background: 'white',
                                        color: '#667eea',
                                        textDecoration: 'none',
                                        borderRadius: '0.75rem',
                                        fontWeight: '700',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Checkout
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
