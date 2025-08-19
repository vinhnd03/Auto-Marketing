package com.codegym.auto_marketing_server.dto;

import com.codegym.auto_marketing_server.entity.Role;
import com.codegym.auto_marketing_server.entity.User;

import java.util.stream.Collectors;

public record UserDTO (String email, String name, Role role, String avatar, Boolean status) {
    public static UserDTO from(User user) {
        return new UserDTO(
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getAvatar(),
                user.getStatus());
    }
}
