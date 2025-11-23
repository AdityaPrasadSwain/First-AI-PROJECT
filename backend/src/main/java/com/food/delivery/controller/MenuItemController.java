package com.food.delivery.controller;

import com.food.delivery.model.MenuItem;
import com.food.delivery.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {

    @Autowired
    private RestaurantService restaurantService;

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(restaurantService.updateMenuItem(id, menuItem));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        restaurantService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
