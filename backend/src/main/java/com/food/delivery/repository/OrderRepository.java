package com.food.delivery.repository;

import com.food.delivery.model.Order;
import com.food.delivery.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    List<Order> findByStatusInOrderByCreatedAtDesc(java.util.List<OrderStatus> statuses);

    List<Order> findByDeliveryBoy(com.food.delivery.model.User deliveryBoy);
}
