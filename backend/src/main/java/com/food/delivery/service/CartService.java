package com.food.delivery.service;

import com.food.delivery.model.Cart;
import com.food.delivery.model.CartItem;
import com.food.delivery.model.MenuItem;
import com.food.delivery.model.User;
import com.food.delivery.repository.CartRepository;
import com.food.delivery.repository.MenuItemRepository;
import com.food.delivery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    public Cart getCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public Cart addToCart(String userEmail, Long menuItemId, Integer quantity) {
        Cart cart = getCart(userEmail);
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getMenuItem().getId().equals(menuItemId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setMenuItem(menuItem);
            newItem.setQuantity(quantity);
            newItem.setPrice(menuItem.getPrice());
            cart.getItems().add(newItem);
        }

        cart.calculateTotal();
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(String userEmail, Long cartItemId) {
        Cart cart = getCart(userEmail);
        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));
        cart.calculateTotal();
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String userEmail) {
        Cart cart = getCart(userEmail);
        cart.getItems().clear();
        cart.setTotalAmount(0.0);
        cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItemQuantity(String userEmail, Long cartItemId, Integer quantity) {
        Cart cart = getCart(userEmail);

        Optional<CartItem> cartItem = cart.getItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst();

        if (cartItem.isPresent()) {
            if (quantity <= 0) {
                cart.getItems().remove(cartItem.get());
            } else {
                cartItem.get().setQuantity(quantity);
            }
            cart.calculateTotal();
            return cartRepository.save(cart);
        } else {
            throw new RuntimeException("Cart item not found");
        }
    }
}
