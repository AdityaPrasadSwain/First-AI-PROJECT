import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, ChefHat, LayoutDashboard, Truck } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartItemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }} className="animate-fade-in-down">
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 1rem'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '70px'
                }}>
                    {/* Logo */}
                    <Link to="/" style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'transform 0.2s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{
                            width: '45px',
                            height: '45px',
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                        }}>
                            <ChefHat size={24} color="white" />
                        </div>
                        <span style={{
                            fontSize: '1.75rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            FoodExpress
                        </span>
                    </Link>

                    {/* Navigation Items */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {isAuthenticated ? (
                            <>
                                {/* Cart Icon */}
                                <Link to="/cart" style={{
                                    position: 'relative',
                                    color: '#1a1a2e',
                                    textDecoration: 'none',
                                    padding: '0.5rem',
                                    borderRadius: '0.75rem',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}>
                                    <div style={{ position: 'relative' }}>
                                        <ShoppingCart size={22} />
                                        {cartItemCount > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)'
                                            }}>
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </div>
                                </Link>

                                {/* User Dropdown */}
                                <div style={{ position: 'relative' }} className="group">
                                    <button style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#1a1a2e',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}>
                                        <User size={18} />
                                        <span>{user?.name}</span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 'calc(100% + 0.5rem)',
                                        width: '220px',
                                        background: 'rgba(255, 255, 255, 0.98)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '1rem',
                                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                                        border: '1px solid rgba(0, 0, 0, 0.05)',
                                        padding: '0.5rem',
                                        opacity: 0,
                                        visibility: 'hidden',
                                        transform: 'translateY(-10px)',
                                        transition: 'all 0.3s ease',
                                        zIndex: 1000
                                    }} className="group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                                        <Link to="/profile" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            color: '#1a1a2e',
                                            textDecoration: 'none',
                                            borderRadius: '0.5rem',
                                            transition: 'all 0.2s ease',
                                            fontSize: '0.95rem'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                            }}>
                                            <User size={16} />
                                            Profile
                                        </Link>

                                        <Link to="/orders" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            color: '#1a1a2e',
                                            textDecoration: 'none',
                                            borderRadius: '0.5rem',
                                            transition: 'all 0.2s ease',
                                            fontSize: '0.95rem'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                            }}>
                                            <ShoppingCart size={16} />
                                            My Orders
                                        </Link>

                                        {user?.role === 'RESTAURANT_OWNER' && (
                                            <Link to="/owner/dashboard" style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem 1rem',
                                                color: '#1a1a2e',
                                                textDecoration: 'none',
                                                borderRadius: '0.5rem',
                                                transition: 'all 0.2s ease',
                                                fontSize: '0.95rem'
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                }}>
                                                <LayoutDashboard size={16} />
                                                Dashboard
                                            </Link>
                                        )}

                                        {user?.role === 'DELIVERY_BOY' && (
                                            <Link to="/delivery/dashboard" style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem 1rem',
                                                color: '#1a1a2e',
                                                textDecoration: 'none',
                                                borderRadius: '0.5rem',
                                                transition: 'all 0.2s ease',
                                                fontSize: '0.95rem'
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                }}>
                                                <Truck size={16} />
                                                Delivery Dashboard
                                            </Link>
                                        )}

                                        <div style={{
                                            height: '1px',
                                            background: 'rgba(0, 0, 0, 0.05)',
                                            margin: '0.5rem 0'
                                        }}></div>

                                        <button onClick={handleLogout} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            color: '#ff6b6b',
                                            background: 'transparent',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontSize: '0.95rem',
                                            fontWeight: '500',
                                            textAlign: 'left'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                            }}>
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <Link to="/login" style={{
                                    color: '#1a1a2e',
                                    textDecoration: 'none',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '0.75rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.95rem'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}>
                                    Login
                                </Link>
                                <Link to="/register" style={{
                                    background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                                    color: 'white',
                                    textDecoration: 'none',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '9999px',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.95rem'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
                                    }}>
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .group:hover > div {
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: translateY(0) !important;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
