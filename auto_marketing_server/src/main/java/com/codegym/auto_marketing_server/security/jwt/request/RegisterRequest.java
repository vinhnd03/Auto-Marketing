package com.codegym.auto_marketing_server.security.jwt.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String phone;
}
