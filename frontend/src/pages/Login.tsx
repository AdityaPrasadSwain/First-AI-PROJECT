import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            setError('');
            const response = await api.post('/auth/login', data);
            login(response.data.token, {
                name: response.data.name,
                email: response.data.email,
                role: response.data.role
            });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Circles */}
            <div className="animate-float" style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                top: '-200px',
                right: '-100px',
            }}></div>
            <div className="animate-float" style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                bottom: '-150px',
                left: '-100px',
                animationDelay: '1.5s'
            }}></div>

            <div className="glass animate-scale-in" style={{
                width: '100%',
                maxWidth: '450px',
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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                    }} className="animate-bounce">
                        <LogIn size={32} color="white" />
                    </div>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#1a1a2e',
                        marginBottom: '0.5rem'
                    }}>
                        Welcome Back!
                    </h2>
                    <p style={{ color: '#8b92a8', fontSize: '0.95rem' }}>
                        Enter your credentials to access your account
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
                    {/* Email Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
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
                                {...register('email', { required: 'Email is required' })}
                                type="email"
                                placeholder="your.email@example.com"
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    border: `2px solid ${errors.email ? '#ff6b6b' : '#e4e9f7'}`,
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    background: 'white',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
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
                    <div style={{ marginBottom: '1.5rem' }}>
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
                                {...register('password', { required: 'Password is required' })}
                                type="password"
                                placeholder="Enter your password"
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    border: `2px solid ${errors.password ? '#ff6b6b' : '#e4e9f7'}`,
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    background: 'white',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            background: loading ? '#8b92a8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '0.5rem',
                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                Signing in...
                            </div>
                        ) : (
                            <>Sign In</>
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

                {/* Sign Up Link */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#8b92a8', fontSize: '0.95rem' }}>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            style={{
                                color: '#667eea',
                                fontWeight: '600',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#764ba2';
                                e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#667eea';
                                e.currentTarget.style.textDecoration = 'none';
                            }}
                        >
                            Sign up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
