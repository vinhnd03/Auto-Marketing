package com.codegym.auto_marketing_server.controller.auth;

import com.codegym.auto_marketing_server.entity.User;
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
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthController_resetPasswordTest {
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
    public void resetPassword_withNonExistedToken() throws Exception {
        String json = """
                    {
                        "token":"non-existed-token",
                        "newPassword":"123456"
                    }
                """;

        when(userTokenService.findByToken("non-existed-token")).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Token không tồn tại"));
    }

    @Test
    public void resetPassword_tokenExpiredOrInactive() throws Exception {
        String json = """
                    {
                        "token":"expired-token",
                        "newPassword":"123456"
                    }
                """;

        UserToken userToken = new UserToken();
        userToken.setStatus(false);
        userToken.setExpiresAt(LocalDateTime.now().minusHours(1));

        when(userTokenService.findByToken("expired-token")).thenReturn(Optional.of(userToken));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Token đã hết hạn hoặc không hợp lệ"));
    }

    @Test
    public void resetPassword_withValidToken () throws Exception {
        String json = """
                    {
                        "token":"valid-token",
                        "newPassword":"123456"
                    }
                """;
        User user = new User();
        user.setId(1L);

        UserToken userToken = new UserToken();
        userToken.setStatus(true);
        userToken.setExpiresAt(LocalDateTime.now().plusHours(1));
        userToken.setUser(user);

        when(userTokenService.findByToken("valid-token")).thenReturn(Optional.of(userToken));

        doNothing().when(userService).changePassword(anyLong(), anyString());
        when(userTokenService.save(any(UserToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Đặt lại mật khẩu thành công"));
    }
}
