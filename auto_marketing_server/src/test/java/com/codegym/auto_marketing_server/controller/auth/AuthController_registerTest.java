package com.codegym.auto_marketing_server.controller.auth;

import com.codegym.auto_marketing_server.entity.Role;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthController_registerTest {
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
    public void register_withExistedEmail() throws Exception{
        String json = """
                {
                    "email":"existing@gmail.com",
                    "password":"123456",
                    "name":"Test User"
                }
                """;

        when(userService.existedByEmail("existing@gmail.com")).thenReturn(true);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Email này đã được sử dụng"));
    }

    @Test
    public void register_withValidInfo() throws Exception {
        String json = """
                {
                    "email":"newuser@gmail.com",
                    "password":"123456",
                    "name":"New User"
                }
                """;

        when(userService.existedByEmail("newuser@gmail.com")).thenReturn(false);
        when(roleService.findByName("USER")).thenReturn(Optional.empty());
        when(roleService.save(any(Role.class))).thenAnswer(invocation -> invocation.getArgument(0));

        when(userService.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đăng ký thành công"));
    }
}
