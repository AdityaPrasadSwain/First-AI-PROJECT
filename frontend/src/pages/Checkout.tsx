import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { MapPin, CreditCard, Smartphone, Banknote, ChevronRight } from 'lucide-react';
import Toast, { ToastType } from '../components/Toast';

interface Address {
    id: number;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
}

type PaymentMethod = 'COD' | 'CARD' | 'UPI';

const Checkout = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
    const [newAddress, setNewAddress] = useState({ addressLine: '', city: '', state: '', pincode: '' });
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
    const [upiId, setUpiId] = useState('');
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/users/addresses');
            setAddresses(response.data);
            if (response.data.length > 0) {
                setSelectedAddress(response.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            showToast('Failed to load addresses', 'error');
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users/addresses', newAddress);
            setShowAddAddress(false);
            setNewAddress({ addressLine: '', city: '', state: '', pincode: '' });
            fetchAddresses();
            showToast('Address added successfully!', 'success');
        } catch (error) {
            console.error('Error adding address:', error);
            showToast('Failed to add address', 'error');
        }
    };

    const placeOrder = async () => {
        if (!selectedAddress) {
            showToast('Please select a delivery address', 'warning');
            return;
        }
        try {
            await api.post(`/orders?addressId=${selectedAddress}&paymentMethod=${paymentMethod}`);
            // Clear card details after successful order
            setCardDetails({ number: '', expiry: '', cvv: '' });
            setUpiId('');
            showToast('Order placed successfully!', 'success');
            setTimeout(() => {
                navigate('/orders');
            }, 1500);
        } catch (error) {
            console.error('Error placing order:', error);
            showToast('Failed to place order', 'error');
        }
    };

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Navbar />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
                <h1 className="animate-fade-in-down" style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#1a1a2e',
                    marginBottom: '2rem'
                }}>
                    Checkout
                </h1>

                {/* Address Selection */}
                <div className="animate-fade-in-up" style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <MapPin size={24} color="#667eea" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
                            Delivery Address
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {addresses.map((addr) => (
                            <label
                                key={addr.id}
                                className="card-3d-lift"
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    padding: '1.25rem',
                                    border: selectedAddress === addr.id ? '2px solid #667eea' : '2px solid #f0f0f0',
                                    borderRadius: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: selectedAddress === addr.id ? 'rgba(102, 126, 234, 0.05)' : 'white'
                                }}
                            >
                                <input
                                    type="radio"
                                    name="address"
                                    value={addr.id}
                                    checked={selectedAddress === addr.id}
                                    onChange={() => setSelectedAddress(addr.id)}
                                    style={{
                                        marginTop: '0.25rem',
                                        marginRight: '1rem',
                                        width: '18px',
                                        height: '18px',
                                        accentColor: '#667eea'
                                    }}
                                />
                                <div>
                                    <p style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.25rem' }}>
                                        {addr.addressLine}
                                    </p>
                                    <p style={{ fontSize: '0.95rem', color: '#8b92a8' }}>
                                        {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {!showAddAddress ? (
                        <button
                            onClick={() => setShowAddAddress(true)}
                            style={{
                                marginTop: '1rem',
                                color: '#667eea',
                                background: 'rgba(102, 126, 234, 0.1)',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                        >
                            + Add New Address
                        </button>
                    ) : (
                        <form onSubmit={handleAddAddress} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Address Line"
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        borderRadius: '0.75rem',
                                        border: '2px solid #f0f0f0',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                    value={newAddress.addressLine}
                                    onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                    required
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        style={{
                                            padding: '0.875rem',
                                            borderRadius: '0.75rem',
                                            border: '2px solid #f0f0f0',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        style={{
                                            padding: '0.875rem',
                                            borderRadius: '0.75rem',
                                            border: '2px solid #f0f0f0',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        style={{
                                            padding: '0.875rem',
                                            borderRadius: '0.75rem',
                                            border: '2px solid #f0f0f0',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                        value={newAddress.pincode}
                                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '0.75rem 2rem',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Save Address
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddAddress(false)}
                                        style={{
                                            padding: '0.75rem 2rem',
                                            background: 'rgba(0, 0, 0, 0.05)',
                                            color: '#1a1a2e',
                                            border: 'none',
                                            borderRadius: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Payment Method */}
                <div className="animate-fade-in" style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <CreditCard size={24} color="#667eea" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
                            Payment Method
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Cash on Delivery */}
                        <div
                            onClick={() => setPaymentMethod('COD')}
                            className="card-3d-lift"
                            style={{
                                padding: '1.25rem',
                                border: paymentMethod === 'COD' ? '2px solid #4ecdc4' : '2px solid #f0f0f0',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: paymentMethod === 'COD' ? 'rgba(78, 205, 196, 0.05)' : 'white'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                                        borderRadius: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Banknote size={24} color="white" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>
                                            Cash on Delivery
                                        </p>
                                        <p style={{ fontSize: '0.9rem', color: '#8b92a8', margin: '0.25rem 0 0 0' }}>
                                            Pay when your order arrives
                                        </p>
                                    </div>
                                </div>
                                {paymentMethod === 'COD' && (
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        background: '#4ecdc4',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        ✓
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Credit/Debit Card */}
                        <div
                            onClick={() => setPaymentMethod('CARD')}
                            className="card-3d-lift"
                            style={{
                                padding: '1.25rem',
                                border: paymentMethod === 'CARD' ? '2px solid #667eea' : '2px solid #f0f0f0',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: paymentMethod === 'CARD' ? 'rgba(102, 126, 234, 0.05)' : 'white'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: paymentMethod === 'CARD' ? '1rem' : 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CreditCard size={24} color="white" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>
                                            Credit / Debit Card
                                        </p>
                                        <p style={{ fontSize: '0.9rem', color: '#8b92a8', margin: '0.25rem 0 0 0' }}>
                                            Visa, MasterCard, Rupay
                                        </p>
                                    </div>
                                </div>
                                {paymentMethod === 'CARD' && (
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        background: '#667eea',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        ✓
                                    </div>
                                )}
                            </div>
                            {paymentMethod === 'CARD' && (
                                <div className="animate-scale-in" style={{ paddingTop: '1rem', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        maxLength={16}
                                        style={{
                                            padding: '0.875rem',
                                            borderRadius: '0.75rem',
                                            border: '2px solid #f0f0f0',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                        value={cardDetails.number}
                                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '') })}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            style={{
                                                padding: '0.875rem',
                                                borderRadius: '0.75rem',
                                                border: '2px solid #f0f0f0',
                                                fontSize: '1rem',
                                                outline: 'none'
                                            }}
                                            value={cardDetails.expiry}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length >= 2) {
                                                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                                }
                                                setCardDetails({ ...cardDetails, expiry: value });
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVV"
                                            maxLength={3}
                                            style={{
                                                padding: '0.875rem',
                                                borderRadius: '0.75rem',
                                                border: '2px solid #f0f0f0',
                                                fontSize: '1rem',
                                                outline: 'none'
                                            }}
                                            value={cardDetails.cvv}
                                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* UPI */}
                        <div
                            onClick={() => setPaymentMethod('UPI')}
                            className="card-3d-lift"
                            style={{
                                padding: '1.25rem',
                                border: paymentMethod === 'UPI' ? '2px solid #ff6b6b' : '2px solid #f0f0f0',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: paymentMethod === 'UPI' ? 'rgba(255, 107, 107, 0.05)' : 'white'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: paymentMethod === 'UPI' ? '1rem' : 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                                        borderRadius: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Smartphone size={24} color="white" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>
                                            UPI Payment
                                        </p>
                                        <p style={{ fontSize: '0.9rem', color: '#8b92a8', margin: '0.25rem 0 0 0' }}>
                                            Google Pay, PhonePe, Paytm
                                        </p>
                                    </div>
                                </div>
                                {paymentMethod === 'UPI' && (
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        background: '#ff6b6b',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        ✓
                                    </div>
                                )}
                            </div>
                            {paymentMethod === 'UPI' && (
                                <div className="animate-scale-in" style={{ paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                                    <input
                                        type="text"
                                        placeholder="Enter UPI ID (e.g. user@paytm)"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            borderRadius: '0.75rem',
                                            border: '2px solid #f0f0f0',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#ff6b6b'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Place Order Button */}
                <button
                    onClick={placeOrder}
                    className="btn"
                    style={{
                        width: '100%',
                        padding: '1.25rem',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '1rem',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 107, 107, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 107, 107, 0.3)';
                    }}
                >
                    Place Order
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default Checkout;
