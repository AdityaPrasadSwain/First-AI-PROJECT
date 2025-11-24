package com.food.delivery.service;

import com.food.delivery.model.Order;
import com.food.delivery.model.OrderStatus;
import com.food.delivery.model.User;
import com.food.delivery.repository.OrderRepository;
import com.food.delivery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Order> getAssignedOrders(Long deliveryBoyId) {
        User deliveryBoy = userRepository.findById(deliveryBoyId)
                .orElseThrow(() -> new RuntimeException("Delivery Boy not found"));
        return orderRepository.findByDeliveryBoy(deliveryBoy);
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public List<Order> getAvailableOrders() {
        // Logic to find orders that are ready for pickup and not assigned (if
        // applicable)
        // For now, let's assume admin assigns, or we can add logic here later.
        // This is a placeholder if we want a "pool" of orders.
        return List.of();
    }
}
