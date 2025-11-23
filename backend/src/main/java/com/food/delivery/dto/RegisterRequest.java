package com.food.delivery.dto;

import com.food.delivery.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role; // Optional, defaults to USER if null
}
