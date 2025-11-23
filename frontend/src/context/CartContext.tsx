import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

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

interface CartContextType {
    cart: Cart | null;
    cartItemCount: number;
    refreshCart: () => Promise<void>;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const refreshCart = async () => {
        if (!isAuthenticated) {
            console.log('[CartContext] User not authenticated, clearing cart');
            setCart(null);
            return;
        }

        try {
            setLoading(true);
            console.log('[CartContext] Fetching cart...');
            const response = await api.get('/cart');
            console.log('[CartContext] Cart response:', response.data);
            setCart(response.data);
        } catch (error: any) {
            console.error('[CartContext] Error fetching cart:', error);
            console.error('[CartContext] Error details:', error.response?.data);
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('[CartContext] isAuthenticated changed:', isAuthenticated);
        refreshCart();
    }, [isAuthenticated]);

    const cartItemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{ cart, cartItemCount, refreshCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
