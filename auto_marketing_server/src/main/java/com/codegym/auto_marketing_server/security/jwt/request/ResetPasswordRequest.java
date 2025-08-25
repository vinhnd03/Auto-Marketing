package com.codegym.auto_marketing_server.security.jwt.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String token;
    private String newPassword;
}
