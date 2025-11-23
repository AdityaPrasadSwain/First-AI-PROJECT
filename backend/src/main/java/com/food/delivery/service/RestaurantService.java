package com.food.delivery.service;

import com.food.delivery.model.MenuItem;
import com.food.delivery.model.Restaurant;
import com.food.delivery.model.User;
import com.food.delivery.repository.MenuItemRepository;
import com.food.delivery.repository.RestaurantRepository;
import com.food.delivery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findByIsActiveTrue();
    }

    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public List<Restaurant> searchRestaurants(String query) {
        return restaurantRepository.findByNameContainingIgnoreCase(query);
    }

    public Restaurant createRestaurant(Restaurant restaurant, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        restaurant.setOwner(owner);
        return restaurantRepository.save(restaurant);
    }

    public MenuItem addMenuItem(Long restaurantId, MenuItem menuItem) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        menuItem.setRestaurant(restaurant);
        return menuItemRepository.save(menuItem);
    }

    public List<MenuItem> getMenuByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public MenuItem updateMenuItem(Long id, MenuItem itemDetails) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        menuItem.setName(itemDetails.getName());
        menuItem.setDescription(itemDetails.getDescription());
        menuItem.setPrice(itemDetails.getPrice());
        menuItem.setVeg(itemDetails.isVeg());
        menuItem.setImageUrl(itemDetails.getImageUrl());

        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menuItemRepository.delete(menuItem);
    }

    public List<Restaurant> getRestaurantsByOwner(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return restaurantRepository.findByOwnerId(owner.getId());
    }
}
