import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Toast, { ToastType } from '../components/Toast';
import { User, Mail, MapPin, Plus, Edit, Trash, Lock, Phone } from 'lucide-react';

interface Address {
    id: number;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
}

export default function Profile() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [addressForm, setAddressForm] = useState({ addressLine: '', city: '', state: '', pincode: '' });

    useEffect(() => {
        fetchProfile();
        fetchAddresses();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setUser(response.data);
            setProfileForm({
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            showToast('Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/users/addresses');
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/profile', profileForm);
            setUser(response.data);
            setShowEditProfile(false);
            showToast('Profile updated successfully!', 'success');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            showToast(error.response?.data?.message || 'Failed to update profile', 'error');
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        try {
            await api.put('/users/password', {
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            });
            setShowChangePassword(false);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            showToast('Password changed successfully!', 'success');
        } catch (error: any) {
            console.error('Error changing password:', error);
            showToast(error.response?.data?.message || 'Failed to change password', 'error');
        }
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await api.put(`/users/addresses/${editingAddress.id}`, addressForm);
                showToast('Address updated successfully!', 'success');
            } else {
                await api.post('/users/addresses', addressForm);
                showToast('Address added successfully!', 'success');
            }
            setShowAddressModal(false);
            setEditingAddress(null);
            setAddressForm({ addressLine: '', city: '', state: '', pincode: '' });
            fetchAddresses();
        } catch (error) {
            console.error('Error saving address:', error);
            showToast('Failed to save address', 'error');
        }
    };

    const handleDeleteAddress = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/users/addresses/${id}`);
            showToast('Address deleted successfully!', 'success');
            fetchAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
            showToast('Failed to delete address', 'error');
        }
    };

    const openEditAddress = (address: Address) => {
        setEditingAddress(address);
        setAddressForm({
            addressLine: address.addressLine,
            city: address.city,
            state: address.state,
            pincode: address.pincode
        });
        setShowAddressModal(true);
    };

    const openAddAddress = () => {
        setEditingAddress(null);
        setAddressForm({ addressLine: '', city: '', state: '', pincode: '' });
        setShowAddressModal(true);
    };

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
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
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
                    <User size={36} />
                    My Profile
                </h1>

                {/* User Info Card */}
                <div className="animate-fade-in-up" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '1.5rem',
                    padding: '2.5rem',
                    marginBottom: '2rem',
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
                            width: '100px',
                            height: '100px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            border: '3px solid rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <User size={50} color="white" />
                        </div>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '1rem'
                        }}>
                            {user?.name}
                        </h2>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.9)',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '1.1rem'
                            }}>
                                <Mail size={20} />
                                {user?.email}
                            </div>
                            {user?.phone && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    fontSize: '1.1rem'
                                }}>
                                    <Phone size={20} />
                                    {user.phone}
                                </div>
                            )}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                width: 'fit-content'
                            }}>
                                {user?.role.replace('_', ' ')}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setShowEditProfile(true)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'white',
                                    color: '#667eea',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <Edit size={18} />
                                Edit Profile
                            </button>
                            <button
                                onClick={() => setShowChangePassword(true)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                            >
                                <Lock size={18} />
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Addresses Section */}
                <div style={{ marginTop: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 className="animate-fade-in-left" style={{
                            fontSize: '1.75rem',
                            fontWeight: 'bold',
                            color: '#1a1a2e',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <MapPin size={28} />
                            Saved Addresses
                        </h2>
                        <button
                            onClick={openAddAddress}
                            className="btn btn-primary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '9999px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                            }}
                        >
                            <Plus size={18} />
                            Add Address
                        </button>
                    </div>

                    {addresses.length === 0 ? (
                        <div className="animate-scale-in" style={{
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            background: 'white',
                            borderRadius: '1.5rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                        }}>
                            <MapPin size={64} color="#8b92a8" style={{ marginBottom: '1rem' }} />
                            <p style={{ fontSize: '1.1rem', color: '#8b92a8' }}>
                                No saved addresses yet. Add one to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="stagger-children" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.25rem'
                        }}>
                            {addresses.map((address) => (
                                <div key={address.id} className="card-3d-lift" style={{
                                    background: 'white',
                                    borderRadius: '1.25rem',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                                            borderRadius: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)'
                                        }}>
                                            <MapPin size={20} color="white" />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => openEditAddress(address)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(102, 126, 234, 0.1)',
                                                    color: '#667eea',
                                                    border: 'none',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(address.id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(255, 107, 107, 0.1)',
                                                    color: '#ff6b6b',
                                                    border: 'none',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)'}
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p style={{
                                        fontSize: '1rem',
                                        color: '#1a1a2e',
                                        marginBottom: '0.25rem',
                                        lineHeight: '1.5'
                                    }}>
                                        {address.addressLine}
                                    </p>
                                    <p style={{
                                        fontSize: '0.95rem',
                                        color: '#8b92a8',
                                        lineHeight: '1.5'
                                    }}>
                                        {address.city}, {address.state} - {address.pincode}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profile">
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>Name</label>
                        <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '0.75rem',
                                border: '2px solid #f0f0f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>Email</label>
                        <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '0.75rem',
                                border: '2px solid #f0f0f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>Phone</label>
                        <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '0.75rem',
                                border: '2px solid #f0f0f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '1.05rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Save Changes
                    </button>
                </form>
            </Modal>

            {/* Change Password Modal */}
            <Modal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} title="Change Password">
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>Current Password</label>
                        <input
                            type="password"
                            value={passwordForm.oldPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '0.75rem',
                                border: '2px solid #f0f0f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>New Password</label>
                        <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '0.75rem',
                                border: '2px solid #f0f0f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>Confirm New Password</label>
                        <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '0.75rem',
                                border: '2px solid #f0f0f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '1.05rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        Change Password
                    </button>
                </form>
            </Modal>

            {/* Address Modal */}
            <Modal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                title={editingAddress ? 'Edit Address' : 'Add New Address'}
            >
                <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>Address Line</label>
                        <input
                            type="text"
                            value={addressForm.addressLine}
                            onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '0.75rem',
                                border: '2px solid #f0f0f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                            required
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>City</label>
                            <input
                                type="text"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    borderRadius: '0.75rem',
                                    border: '2px solid #f0f0f0',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>State</label>
                            <input
                                type="text"
                                value={addressForm.state}
                                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    borderRadius: '0.75rem',
                                    border: '2px solid #f0f0f0',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>Pincode</label>
                        <input
                            type="text"
                            value={addressForm.pincode}
                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '0.75rem',
                                border: '2px solid #f0f0f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '1.05rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        {editingAddress ? 'Update Address' : 'Add Address'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
