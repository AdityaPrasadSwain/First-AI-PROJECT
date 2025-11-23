import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Toast, { ToastType } from '../components/Toast';
import { Star, Clock, MapPin, Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    veg: boolean;
    imageUrl?: string;
    available: boolean;
}

interface Restaurant {
    id: number;
    name: string;
    description: string;
    cuisineType: string;
    avgRating: number;
    deliveryTime: number;
    address: string;
}

const RestaurantDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const { isAuthenticated } = useAuth();
    const { refreshCart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resResponse, menuResponse] = await Promise.all([
                    api.get(`/restaurants/${id}`),
                    api.get(`/restaurants/${id}/menu`)
                ]);
                setRestaurant(resResponse.data);
                setMenu(menuResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                showToast('Failed to load restaurant data', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    const addToCart = async (menuItemId: number) => {
        if (!isAuthenticated) {
            showToast('Please login to add items to cart', 'warning');
            return;
        }
        try {
            console.log('[RestaurantDetails] Adding item to cart:', menuItemId);
            const response = await api.post(`/cart/add?menuItemId=${menuItemId}&quantity=1`);
            console.log('[RestaurantDetails] Add to cart response:', response.data);
            setAddedItems(prev => new Set(prev).add(menuItemId));
            console.log('[RestaurantDetails] Refreshing cart context...');
            await refreshCart(); // Refresh cart context immediately
            console.log('[RestaurantDetails] Cart refreshed successfully');
            showToast('Item added to cart successfully!', 'success');
            setTimeout(() => {
                setAddedItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(menuItemId);
                    return newSet;
                });
            }, 2000);
        } catch (error: any) {
            console.error('[RestaurantDetails] Error adding to cart:', error);
            console.error('[RestaurantDetails] Error response:', error.response?.data);
            showToast('Failed to add item to cart', 'error');
        }
    };

    if (loading || !restaurant) {
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
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Restaurant Header */}
            <div className="animate-fade-in-down" style={{
                background: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                marginBottom: '2rem'
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '2.5rem 1rem'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        flexWrap: 'wrap',
                        gap: '1.5rem'
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#1a1a2e',
                                marginBottom: '0.5rem'
                            }}>
                                {restaurant.name}
                            </h1>
                            <p style={{
                                fontSize: '1.1rem',
                                color: '#8b92a8',
                                marginBottom: '0.75rem'
                            }}>
                                {restaurant.cuisineType}
                            </p>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#8b92a8',
                                fontSize: '0.95rem'
                            }}>
                                <MapPin size={18} />
                                {restaurant.address}
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#8b92a8',
                                fontSize: '0.95rem',
                                marginTop: '0.5rem'
                            }}>
                                <Clock size={18} />
                                {restaurant.deliveryTime} mins delivery
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '9999px',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
                        }}>
                            {restaurant.avgRating} <Star size={20} fill="white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 1rem 3rem'
            }}>
                <h2 className="animate-fade-in-left" style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1a1a2e',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    🍽️ Menu
                </h2>

                <div className="stagger-children" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem'
                }}>
                    {menu.map((item) => (
                        <div key={item.id} className="card-3d-lift" style={{
                            background: 'white',
                            borderRadius: '1.5rem',
                            padding: '1.5rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        border: `2px solid ${item.veg ? '#4ecdc4' : '#ff6b6b'}`,
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div style={{
                                            width: '10px',
                                            height: '10px',
                                            background: item.veg ? '#4ecdc4' : '#ff6b6b',
                                            borderRadius: '50%'
                                        }}></div>
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '700',
                                        color: '#1a1a2e',
                                        margin: 0
                                    }}>
                                        {item.name}
                                    </h3>
                                </div>
                                <p style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: '#667eea',
                                    marginBottom: '0.5rem'
                                }}>
                                    ₹{item.price}
                                </p>
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: '#8b92a8',
                                    lineHeight: '1.5'
                                }}>
                                    {item.description}
                                </p>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        style={{
                                            width: '140px',
                                            height: '140px',
                                            objectFit: 'cover',
                                            borderRadius: '1rem',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                )}
                                <button
                                    onClick={() => addToCart(item.id)}
                                    disabled={addedItems.has(item.id)}
                                    className="btn"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.5rem',
                                        background: addedItems.has(item.id)
                                            ? 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'
                                            : 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        fontWeight: '700',
                                        fontSize: '0.95rem',
                                        cursor: addedItems.has(item.id) ? 'default' : 'pointer',
                                        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                                        transition: 'all 0.3s ease',
                                        textTransform: 'uppercase',
                                        minWidth: '120px',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {addedItems.has(item.id) ? (
                                        <>
                                            <Check size={18} /> Added
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} /> Add
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetails;
