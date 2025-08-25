package com.codegym.auto_marketing_server.controller.auth;

import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.filter.JwtAuthenticationFilter;
import com.codegym.auto_marketing_server.security.email.EmailService;
import com.codegym.auto_marketing_server.security.jwt.service.JwtService;
import com.codegym.auto_marketing_server.service.IRoleService;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.service.IUserTokenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthController_forgotPasswordTest {
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private AuthenticationManager authenticationManager;
    @MockitoBean
    private JwtService jwtService;
    @MockitoBean
    private EmailService emailService;
    @MockitoBean
    private IUserService userService;
    @MockitoBean
    private IUserTokenService userTokenService;
    @MockitoBean
    private IRoleService roleService;
    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    public void forgotPassword_withNonExistedEmail() throws Exception{
        String json = """
                    {
                        "email":"emailNotFound@gmail.com"
                    }
                """;

        when(userService.findByEmail("emailNotFound@gmail.com")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    public void forgotPassword_withExistedEmail() throws Exception{
        String json = """
                    {
                        "email":"existedEmail@gmail.com"
                    }
                """;
        User user = new User();
        user.setEmail("user@gmail.com");
        user.setName("Test User");

        when(userService.findByEmail("existedEmail@gmail.com")).thenReturn(Optional.of(user));

        // emailService.sendResetPasswordEmail không cần trả về gì, chỉ verify sau
        doNothing().when(emailService).sendResetPasswordEmail(
                anyString(), anyString(), anyString()
        );

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
