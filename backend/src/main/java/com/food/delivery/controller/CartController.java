package com.food.delivery.controller;

import com.food.delivery.model.Cart;
import com.food.delivery.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(authentication.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestParam Long menuItemId, @RequestParam Integer quantity,
            Authentication authentication) {
        return ResponseEntity.ok(cartService.addToCart(authentication.getName(), menuItemId, quantity));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Cart> removeFromCart(@PathVariable Long itemId, Authentication authentication) {
        return ResponseEntity.ok(cartService.removeFromCart(authentication.getName(), itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<Cart> updateCartItemQuantity(
            @PathVariable Long itemId,
            @RequestParam Integer quantity,
            Authentication authentication) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(authentication.getName(), itemId, quantity));
    }
}
