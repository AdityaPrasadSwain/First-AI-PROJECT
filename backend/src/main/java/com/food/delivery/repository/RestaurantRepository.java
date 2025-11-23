package com.food.delivery.repository;

import com.food.delivery.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByIsActiveTrue();

    List<Restaurant> findByNameContainingIgnoreCase(String name);

    List<Restaurant> findByCuisineTypeContainingIgnoreCase(String cuisineType);

    List<Restaurant> findByOwnerId(Long ownerId);
}
