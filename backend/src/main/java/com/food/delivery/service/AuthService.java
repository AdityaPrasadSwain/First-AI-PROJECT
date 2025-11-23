package com.food.delivery.service;

import com.food.delivery.dto.AuthResponse;
import com.food.delivery.dto.LoginRequest;
import com.food.delivery.dto.RegisterRequest;
import com.food.delivery.model.Role;
import com.food.delivery.model.User;
import com.food.delivery.repository.UserRepository;
import com.food.delivery.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);

        userRepository.save(user);

        String token = jwtUtils.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
        AuthResponse response = new AuthResponse(token, user.getName(), user.getEmail(), user.getRole(),
                user.getImageUrl());
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtils.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
        AuthResponse response = new AuthResponse(token, user.getName(), user.getEmail(), user.getRole(),
                user.getImageUrl());
        return response;
    }
}
