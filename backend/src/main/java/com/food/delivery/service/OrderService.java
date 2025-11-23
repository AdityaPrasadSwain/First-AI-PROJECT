package com.food.delivery.service;

import com.food.delivery.dto.OrderResponse;
import com.food.delivery.model.*;
import com.food.delivery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Transactional
    public Order placeOrder(String userEmail, Long addressId, PaymentMethod paymentMethod) {
        Cart cart = cartService.getCart(userEmail);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // Assuming all items in cart are from same restaurant for simplicity
        // In a real app, we might split orders or validate this
        Restaurant restaurant = cart.getItems().get(0).getMenuItem().getRestaurant();

        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setAddress(address);
        order.setStatus(OrderStatus.PLACED);
        order.setPaymentStatus("PENDING");
        order.setPaymentMethod(paymentMethod != null ? paymentMethod : PaymentMethod.COD);
        order.setTotalAmount(cart.getTotalAmount());
        
        // Set estimated delivery time (current time + restaurant delivery time)
        order.setEstimatedDeliveryTime(
            java.time.LocalDateTime.now().plusMinutes(restaurant.getDeliveryTime())
        );

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(cartItem.getMenuItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItems.add(orderItem);
        }
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear cart after order placement
        cartService.clearCart(userEmail);

        return savedOrder;
    }

    public List<OrderResponse> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    public List<OrderResponse> getRestaurantOrders(Long restaurantId) {
        List<Order> orders = orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }
    
    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setCreatedAt(order.getCreatedAt());
        response.setEstimatedDeliveryTime(order.getEstimatedDeliveryTime());
        response.setDeliveredAt(order.getDeliveredAt());
        
        // Map restaurant
        OrderResponse.RestaurantInfo restaurantInfo = new OrderResponse.RestaurantInfo();
        restaurantInfo.setId(order.getRestaurant().getId());
        restaurantInfo.setName(order.getRestaurant().getName());
        restaurantInfo.setCuisineType(order.getRestaurant().getCuisineType());
        response.setRestaurant(restaurantInfo);
        
        // Map address
        OrderResponse.AddressInfo addressInfo = new OrderResponse.AddressInfo();
        addressInfo.setId(order.getAddress().getId());
        addressInfo.setAddressLine(order.getAddress().getAddressLine());
        addressInfo.setCity(order.getAddress().getCity());
        addressInfo.setState(order.getAddress().getState());
        addressInfo.setPincode(order.getAddress().getPincode());
        response.setAddress(addressInfo);
        
        // Map items
        List<OrderResponse.OrderItemInfo> itemInfos = order.getItems().stream().map(item -> {
            OrderResponse.OrderItemInfo itemInfo = new OrderResponse.OrderItemInfo();
            itemInfo.setId(item.getId());
            itemInfo.setQuantity(item.getQuantity());
            itemInfo.setPrice(item.getPrice());
            
            OrderResponse.MenuItemInfo menuItemInfo = new OrderResponse.MenuItemInfo();
            menuItemInfo.setId(item.getMenuItem().getId());
            menuItemInfo.setName(item.getMenuItem().getName());
            menuItemInfo.setPrice(item.getMenuItem().getPrice());
            menuItemInfo.setVeg(item.getMenuItem().getVeg());
            itemInfo.setMenuItem(menuItemInfo);
            
            return itemInfo;
        }).collect(Collectors.toList());
        response.setItems(itemInfos);
        
        return response;
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
        order.setStatus(orderStatus);
        
        // Set delivered timestamp when order is delivered
        if (orderStatus == OrderStatus.DELIVERED) {
            order.setDeliveredAt(java.time.LocalDateTime.now());
            order.setPaymentStatus("PAID");
        }
        
        return orderRepository.save(order);
    }

    public List<OrderResponse> getAvailableDeliveries() {
        List<Order> orders = orderRepository.findByStatusInOrderByCreatedAtDesc(
            java.util.Arrays.asList(OrderStatus.PREPARING, OrderStatus.OUT_FOR_DELIVERY)
        );
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }
}
