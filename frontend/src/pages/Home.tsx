import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Search, Star, Clock, TrendingUp, MapPin } from 'lucide-react';

interface Restaurant {
    id: number;
    name: string;
    description: string;
    cuisineType: string;
    avgRating: number;
    deliveryTime: number;
    imageUrl?: string;
}

const Home = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async (query = '') => {
        try {
            const endpoint = query ? `/restaurants/search?query=${query}` : '/restaurants';
            const response = await api.get(endpoint);
            setRestaurants(response.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRestaurants(searchTerm);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Navbar />

            {/* Hero Section with 3D Effects */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '5rem 0',
                marginBottom: '3rem',
                position: 'relative',
                overflow: 'hidden'
            }} className="animate-fade-in">
                {/* Floating circles for decoration */}
                <div style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    top: '-100px',
                    right: '-100px',
                }} className="animate-float"></div>
                <div style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    bottom: '-50px',
                    left: '-50px',
                    animationDelay: '1s'
                }} className="animate-float"></div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '1.5rem',
                        textShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }} className="animate-fade-in-down">
                        Delicious Food <span className="gradient-text" style={{
                            background: 'linear-gradient(135deg, #feca57 0%, #ff6b6b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Delivered</span> Fast! 🍕
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '2rem',
                        maxWidth: '600px',
                        margin: '0 auto 2rem'
                    }} className="animate-fade-in-up">
                        Order from your favorite restaurants and get it delivered to your doorstep
                    </p>

                    {/* Search Bar with Glass Effect */}
                    <form onSubmit={handleSearch} style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        display: 'flex',
                        gap: '0.75rem'
                    }} className="animate-scale-in">
                        <div style={{
                            position: 'relative',
                            flexGrow: 1,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '1rem',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                display: 'flex',
                                alignItems: 'center',
                                color: '#8b92a8'
                            }}>
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    border: 'none',
                                    borderRadius: '1rem',
                                    fontSize: '1rem',
                                    background: 'transparent',
                                    color: '#1a1a2e',
                                    outline: 'none'
                                }}
                                placeholder="Search for restaurants, cuisine or a dish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                padding: '1rem 2rem',
                                borderRadius: '1rem',
                                border: 'none',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Restaurant List */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem 3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }} className="animate-fade-in-left">
                    <TrendingUp size={28} style={{ color: '#667eea' }} />
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#1a1a2e'
                    }}>
                        Popular Restaurants
                    </h2>
                </div>

                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} style={{
                                background: 'white',
                                borderRadius: '1.5rem',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}>
                                <div className="skeleton" style={{ height: '200px' }}></div>
                                <div style={{ padding: '1rem' }}>
                                    <div className="skeleton" style={{ height: '24px', marginBottom: '0.5rem' }}></div>
                                    <div className="skeleton" style={{ height: '16px', marginBottom: '0.5rem', width: '60%' }}></div>
                                    <div className="skeleton" style={{ height: '16px', width: '40%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '1.5rem'
                    }} className="stagger-children">
                        {restaurants.map((restaurant) => (
                            <Link
                                key={restaurant.id}
                                to={`/restaurant/${restaurant.id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="card-3d-lift" style={{
                                    background: 'white',
                                    borderRadius: '1.5rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{
                                        height: '220px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={restaurant.imageUrl || `https://source.unsplash.com/random/800x600/?restaurant,${restaurant.cuisineType}`}
                                            alt={restaurant.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60';
                                            }}
                                        />
                                        {/* Gradient Overlay */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '50%',
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)'
                                        }}></div>
                                    </div>
                                    <div style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                            <h3 style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '700',
                                                color: '#1a1a2e',
                                                margin: 0
                                            }}>
                                                {restaurant.name}
                                            </h3>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                                                color: 'white',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.875rem',
                                                fontWeight: 'bold',
                                                gap: '0.25rem',
                                                boxShadow: '0 4px 10px rgba(78, 205, 196, 0.3)'
                                            }}>
                                                {restaurant.avgRating} <Star size={14} fill="white" />
                                            </div>
                                        </div>
                                        <p style={{
                                            fontSize: '0.875rem',
                                            color: '#8b92a8',
                                            marginBottom: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <MapPin size={14} />
                                            {restaurant.cuisineType}
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            fontSize: '0.875rem',
                                            color: '#8b92a8'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={16} />
                                                {restaurant.deliveryTime} mins
                                            </div>
                                            <div style={{
                                                fontWeight: '600',
                                                color: '#667eea'
                                            }}>
                                                ₹200 for two
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && restaurants.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'white',
                        borderRadius: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }} className="animate-fade-in">
                        <p style={{ fontSize: '1.25rem', color: '#8b92a8' }}>
                            No restaurants found. Try a different search!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
