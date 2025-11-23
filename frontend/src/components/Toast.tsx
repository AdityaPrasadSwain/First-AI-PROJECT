import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={24} />;
            case 'error':
                return <AlertCircle size={24} />;
            case 'warning':
                return <AlertTriangle size={24} />;
            case 'info':
                return <Info size={24} />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                    shadow: 'rgba(78, 205, 196, 0.3)'
                };
            case 'error':
                return {
                    bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                    shadow: 'rgba(255, 107, 107, 0.3)'
                };
            case 'warning':
                return {
                    bg: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
                    shadow: 'rgba(254, 202, 87, 0.3)'
                };
            case 'info':
                return {
                    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    shadow: 'rgba(102, 126, 234, 0.3)'
                };
        }
    };

    const colors = getColors();

    return (
        <div
            className="animate-slide-in-right"
            style={{
                position: 'fixed',
                top: '2rem',
                right: '2rem',
                background: colors.bg,
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '1rem',
                boxShadow: `0 10px 40px ${colors.shadow}`,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                minWidth: '300px',
                maxWidth: '500px',
                zIndex: 9999,
                backdropFilter: 'blur(10px)'
            }}
        >
            {getIcon()}
            <span style={{ flex: 1, fontWeight: '600' }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
