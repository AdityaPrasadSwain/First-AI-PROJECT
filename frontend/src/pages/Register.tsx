import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, User, Mail, Lock, Phone, AlertCircle } from 'lucide-react';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            setError('');
            const response = await api.post('/auth/register', data);
            login(response.data.token, {
                name: response.data.name,
                email: response.data.email,
                role: response.data.role
            });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Circles */}
            <div className="animate-float" style={{
                position: 'absolute',
                width: '500px',
                height: '500px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '50%',
                top: '-250px',
                left: '-150px',
            }}></div>
            <div className="animate-float" style={{
                position: 'absolute',
                width: '350px',
                height: '350px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '50%',
                bottom: '-100px',
                right: '-100px',
                animationDelay: '2s'
            }}></div>

            <div className="glass animate-scale-in" style={{
                width: '100%',
                maxWidth: '500px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '2rem',
                padding: '2.5rem',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                        borderRadius: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 10px 30px rgba(78, 205, 196, 0.3)'
                    }} className="animate-bounce">
                        <UserPlus size={32} color="white" />
                    </div>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#1a1a2e',
                        marginBottom: '0.5rem'
                    }}>
                        Create Account
                    </h2>
                    <p style={{ color: '#8b92a8', fontSize: '0.95rem' }}>
                        Sign up to get started with delicious food delivery
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="animate-fade-in-down" style={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                    }}>
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#1a1a2e',
                            fontSize: '0.9rem'
                        }}>
                            Full Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#8b92a8'
                            }}>
                                <User size={20} />
                            </div>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                type="text"
                                placeholder="John Doe"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 0.875rem 0.875rem 3rem',
                                    border: `2px solid ${errors.name ? '#ff6b6b' : '#e4e9f7'}`,
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    background: 'white',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4ecdc4';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(78, 205, 196, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.name ? '#ff6b6b' : '#e4e9f7';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.name && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                {errors.name.message as string}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#1a1a2e',
                            fontSize: '0.9rem'
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#8b92a8'
                            }}>
                                <Mail size={20} />
                            </div>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                type="email"
                                placeholder="your.email@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 0.875rem 0.875rem 3rem',
                                    border: `2px solid ${errors.email ? '#ff6b6b' : '#e4e9f7'}`,
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    background: 'white',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4ecdc4';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(78, 205, 196, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.email ? '#ff6b6b' : '#e4e9f7';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.email && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                {errors.email.message as string}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#1a1a2e',
                            fontSize: '0.9rem'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#8b92a8'
                            }}>
                                <Lock size={20} />
                            </div>
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                type="password"
                                placeholder="Enter your password"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 0.875rem 0.875rem 3rem',
                                    border: `2px solid ${errors.password ? '#ff6b6b' : '#e4e9f7'}`,
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    background: 'white',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4ecdc4';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(78, 205, 196, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.password ? '#ff6b6b' : '#e4e9f7';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.password && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                {errors.password.message as string}
                            </p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#1a1a2e',
                            fontSize: '0.9rem'
                        }}>
                            Phone Number (Optional)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#8b92a8'
                            }}>
                                <Phone size={20} />
                            </div>
                            <input
                                {...register('phone')}
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 0.875rem 0.875rem 3rem',
                                    border: '2px solid #e4e9f7',
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    background: 'white',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4ecdc4';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(78, 205, 196, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e4e9f7';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-secondary"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            background: loading ? '#8b92a8' : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '0.5rem',
                            boxShadow: '0 10px 30px rgba(78, 205, 196, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                Creating account...
                            </div>
                        ) : (
                            <>Create Account</>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    margin: '1.5rem 0'
                }}>
                    <div style={{ flex: 1, height: '1px', background: '#e4e9f7' }}></div>
                    <span style={{ color: '#8b92a8', fontSize: '0.85rem' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: '#e4e9f7' }}></div>
                </div>

                {/* Sign In Link */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#8b92a8', fontSize: '0.95rem' }}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            style={{
                                color: '#4ecdc4',
                                fontWeight: '600',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#44a08d';
                                e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#4ecdc4';
                                e.currentTarget.style.textDecoration = 'none';
                            }}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
