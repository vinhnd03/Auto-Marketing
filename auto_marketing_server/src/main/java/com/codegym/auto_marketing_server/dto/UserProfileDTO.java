package com.codegym.auto_marketing_server.dto;

import com.codegym.auto_marketing_server.entity.User;

import java.time.LocalDate;

public record UserProfileDTO(Long id, String name, String email, String job, String description,
                             LocalDate createdAt, String avatar) {
    public static UserProfileDTO from(User user) {
        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getJob(),
                user.getDescription(),
                user.getCreatedAt(),
                user.getAvatar()
        );
    }
}
