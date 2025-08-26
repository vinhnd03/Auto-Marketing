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
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthController_loginTest {
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
    public void login_withInvalidCredentials() throws Exception {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        String json = """
                    {
                        "email":"wrongEmail@gmail.com",
                        "password":"123456"
                    }
                """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isUnauthorized()) // 401
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    public void login_withValidCredentials() throws Exception {
        // Tạo user entity giả
        User userEntity = new User();
        userEntity.setId(1L);
        userEntity.setEmail("validEmail@gmail.com");
        userEntity.setPassword("123456");

        // Mock Authentication trả về user entity
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userEntity);

        // Khi authenticate được gọi, trả về authentication này
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        // Mock JWT token
        when(jwtService.generateToken(any(com.codegym.auto_marketing_server.entity.User.class)))
                .thenReturn("fake-jwt-token");

        String json = """
                {
                    "email":"validEmail@gmail.com",
                    "password":"123456",
                    "rememberMe":true
                }
            """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}