package com.food.delivery.controller;

import com.food.delivery.model.Order;
import com.food.delivery.model.OrderStatus;
import com.food.delivery.model.User;
import com.food.delivery.service.DeliveryService;
import com.food.delivery.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private UserService userService;

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAssignedOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);

        List<Order> orders = deliveryService.getAssignedOrders(user.getId());
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        Order updatedOrder = deliveryService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }
}
