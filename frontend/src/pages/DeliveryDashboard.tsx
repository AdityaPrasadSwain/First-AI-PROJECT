import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button, Chip, Box, CircularProgress } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
    id: number;
    menuItem: {
        name: string;
        price: number;
    };
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    restaurant: {
        name: string;
        address: string;
    };
    address: {
        street: string;
        city: string;
        zipCode: string;
    };
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

const DeliveryDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'DELIVERY_BOY') {
            navigate('/');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/delivery/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: number, status: string) => {
        try {
            await api.put(`/delivery/orders/${orderId}/status`, null, {
                params: { status }
            });
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                Delivery Dashboard
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order) => (
                    <div key={order.id}>
                        <Card elevation={3} sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6">Order #{order.id}</Typography>
                                    <Chip
                                        label={order.status}
                                        color={order.status === 'DELIVERED' ? 'success' : 'primary'}
                                        variant="outlined"
                                    />
                                </Box>

                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Restaurant:</strong> {order.restaurant.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {order.restaurant.address}
                                </Typography>

                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Delivery Address:</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {order.address.street}, {order.address.city}, {order.address.zipCode}
                                </Typography>

                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Items:</strong>
                                </Typography>
                                {order.items.map((item) => (
                                    <Typography key={item.id} variant="body2">
                                        {item.quantity}x {item.menuItem.name}
                                    </Typography>
                                ))}

                                <Box mt={2} pt={2} borderTop={1} borderColor="divider">
                                    <Typography variant="h6" align="right">
                                        Total: ${order.totalAmount.toFixed(2)}
                                    </Typography>
                                </Box>

                                <Box mt={2} display="flex" gap={2} justifyContent="flex-end">
                                    {order.status === 'PREPARING' && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => updateStatus(order.id, 'OUT_FOR_DELIVERY')}
                                        >
                                            Pick Up Order
                                        </Button>
                                    )}
                                    {order.status === 'OUT_FOR_DELIVERY' && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => updateStatus(order.id, 'DELIVERED')}
                                        >
                                            Mark Delivered
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="col-span-1 md:col-span-2">
                        <Box textAlign="center" py={4}>
                            <Typography variant="h6" color="text.secondary">
                                No assigned orders found.
                            </Typography>
                        </Box>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default DeliveryDashboard;
