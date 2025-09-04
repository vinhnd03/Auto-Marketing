package com.codegym.auto_marketing_server.dto;

import lombok.Getter;

import java.time.LocalDate;


@Getter
public class NotificationDTO {
    private String message;
    private LocalDate createdAt;
    private boolean unread;

    public NotificationDTO(String message, LocalDate createdAt, boolean unread) {
        this.message = message;
        this.createdAt = createdAt;
        this.unread = unread;
    }

}
