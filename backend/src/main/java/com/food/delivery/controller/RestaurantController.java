package com.food.delivery.controller;

import com.food.delivery.model.MenuItem;
import com.food.delivery.model.Restaurant;
import com.food.delivery.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<List<Restaurant>> getMyRestaurants(Authentication authentication) {
        return ResponseEntity.ok(restaurantService.getRestaurantsByOwner(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurants(@RequestParam String query) {
        return ResponseEntity.ok(restaurantService.searchRestaurants(query));
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant,
            Authentication authentication) {
        return ResponseEntity.ok(restaurantService.createRestaurant(restaurant, authentication.getName()));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<List<MenuItem>> getMenu(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getMenuByRestaurant(id));
    }

    @PostMapping("/{id}/menu")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<MenuItem> addMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(restaurantService.addMenuItem(id, menuItem));
    }
}
