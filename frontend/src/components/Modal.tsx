import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    size?: 'small' | 'medium' | 'large';
}

const Modal = ({ isOpen, onClose, children, title, size = 'medium' }: ModalProps) => {
    if (!isOpen) return null;

    const getWidth = () => {
        switch (size) {
            case 'small':
                return '400px';
            case 'large':
                return '800px';
            default:
                return '600px';
        }
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(5px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '1rem',
                animation: 'fadeIn 0.2s ease'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="animate-scale-in"
                style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    width: '100%',
                    maxWidth: getWidth(),
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {title && (
                    <div style={{
                        padding: '1.5rem 2rem',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#1a1a2e',
                            margin: 0
                        }}>
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255, 107, 107, 0.1)',
                                color: '#ff6b6b',
                                border: 'none',
                                borderRadius: '0.75rem',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
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
                            <X size={20} />
                        </button>
                    </div>
                )}
                <div style={{
                    padding: '2rem',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
