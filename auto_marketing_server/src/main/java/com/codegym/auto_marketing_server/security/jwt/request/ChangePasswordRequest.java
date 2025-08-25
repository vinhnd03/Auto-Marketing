package com.codegym.auto_marketing_server.security.jwt.request;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String currentPassword;
    private String newPassword;
}
