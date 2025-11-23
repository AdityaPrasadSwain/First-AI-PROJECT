package com.food.delivery.dto;

import com.food.delivery.model.OrderStatus;
import com.food.delivery.model.PaymentMethod;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private RestaurantInfo restaurant;
    private AddressInfo address;
    private List<OrderItemInfo> items;
    private Double totalAmount;
    private OrderStatus status;
    private String paymentStatus;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime deliveredAt;

    @Data
    public static class RestaurantInfo {
        private Long id;
        private String name;
        private String cuisineType;
    }

    @Data
    public static class AddressInfo {
        private Long id;
        private String addressLine;
        private String city;
        private String state;
        private String pincode;
    }

    @Data
    public static class OrderItemInfo {
        private Long id;
        private MenuItemInfo menuItem;
        private Integer quantity;
        private Double price;
    }

    @Data
    public static class MenuItemInfo {
        private Long id;
        private String name;
        private Double price;
        private Boolean veg;
    }
}
