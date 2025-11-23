package com.food.delivery.controller;

import com.food.delivery.dto.OrderResponse;
import com.food.delivery.model.Order;
import com.food.delivery.model.PaymentMethod;
import com.food.delivery.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(
            @RequestParam Long addressId,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            Authentication authentication) {
        return ResponseEntity.ok(orderService.placeOrder(authentication.getName(), addressId, paymentMethod));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getUserOrders(authentication.getName()));
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getRestaurantOrders(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(orderService.getRestaurantOrders(restaurantId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN') or hasRole('DELIVERY_PARTNER')")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @GetMapping("/delivery/available")
    @PreAuthorize("hasRole('DELIVERY_PARTNER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAvailableDeliveries() {
        return ResponseEntity.ok(orderService.getAvailableDeliveries());
    }
}
