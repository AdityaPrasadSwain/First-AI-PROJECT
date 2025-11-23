package com.food.delivery.controller;

import com.food.delivery.dto.UpdatePasswordRequest;
import com.food.delivery.dto.UpdateProfileRequest;
import com.food.delivery.model.Address;
import com.food.delivery.model.User;
import com.food.delivery.repository.AddressRepository;
import com.food.delivery.repository.UserRepository;
import com.food.delivery.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found")));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(userService.updateProfile(authentication.getName(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(@RequestBody UpdatePasswordRequest request,
            Authentication authentication) {
        userService.updatePassword(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<Address>> getAddresses(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(addressRepository.findByUserId(user.getId()));
    }

    @PostMapping("/addresses")
    public ResponseEntity<Address> addAddress(@RequestBody Address address, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        address.setUser(user);
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address address,
            Authentication authentication) {
        return ResponseEntity.ok(userService.updateAddress(authentication.getName(), id, address));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id, Authentication authentication) {
        userService.deleteAddress(authentication.getName(), id);
        return ResponseEntity.ok().build();
    }
}
