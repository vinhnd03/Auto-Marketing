package com.codegym.auto_marketing_server.dto;

import com.codegym.auto_marketing_server.entity.Role;
import com.codegym.auto_marketing_server.entity.User;

import java.time.LocalDate;

public record UserSummaryDTO(Long id, String email, String name, Role role, String avatar, Boolean status, LocalDate createdAt ) {
    public static UserSummaryDTO from(User user) {
        return new UserSummaryDTO(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getAvatar(),
                user.getStatus(),
                user.getCreatedAt());
    }
}
