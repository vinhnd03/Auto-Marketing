package com.codegym.auto_marketing_server.controller.auth;

import com.codegym.auto_marketing_server.entity.UserToken;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthController_verifyTokenTest {
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
    public void verifyToken_withInValidToken () throws Exception {
        String token = "non-existed-token";
        when(userTokenService.findByToken(token)).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/auth/verify-token")
                .param("token", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(false));
    }

    @Test
    public void verifyToken_withInactiveOrExpiredToken () throws Exception {
        String token = "expired-token";

        UserToken userToken = new UserToken();
        userToken.setStatus(false);
        userToken.setExpiresAt(LocalDateTime.now().minusHours(1));

        when(userTokenService.findByToken(token)).thenReturn(Optional.of(userToken));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/auth/verify-token")
                        .param("token", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(false));
    }

    @Test
    public void verifyToken_withValidToken() throws Exception {
        String token = "valid-token";
        UserToken userToken = new UserToken();
        userToken.setStatus(true);
        userToken.setExpiresAt(LocalDateTime.now().plusHours(1));

        when(userTokenService.findByToken(token)).thenReturn(Optional.of(userToken));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/auth/verify-token")
                        .param("token", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true));
    }
}
