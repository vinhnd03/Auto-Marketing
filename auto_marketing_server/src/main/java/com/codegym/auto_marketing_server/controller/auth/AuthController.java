package com.codegym.auto_marketing_server.controller.auth;

import com.codegym.auto_marketing_server.dto.UserSummaryDTO;
import com.codegym.auto_marketing_server.entity.Role;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.entity.UserToken;
import com.codegym.auto_marketing_server.security.email.EmailRequest;
import com.codegym.auto_marketing_server.security.email.EmailService;
import com.codegym.auto_marketing_server.security.jwt.request.LoginRequest;
import com.codegym.auto_marketing_server.security.jwt.request.RegisterRequest;
import com.codegym.auto_marketing_server.security.jwt.request.ResetPasswordRequest;
import com.codegym.auto_marketing_server.security.jwt.service.JwtService;
import com.codegym.auto_marketing_server.service.IRoleService;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.service.IUserTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IUserService userService;
    private final IRoleService roleService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final IUserTokenService userTokenService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @PostMapping("/reset-password")
    public ResponseEntity resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<UserToken> userTokenOpt = userTokenService.findByToken(request.getToken());

        if (userTokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Token không tồn tại"));
        }
        UserToken userToken = userTokenOpt.get();

        if (!userToken.getStatus() || userToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Token đã hết hạn hoặc không hợp lệ"));
        }

        try {
            System.out.println(request.getNewPassword());
            userService.changePassword(userToken.getUser().getId(), request.getNewPassword());

            // Vô hiệu hoá token sau khi sử dụng
            userToken.setStatus(false);
            userTokenService.save(userToken);

            return ResponseEntity.ok(Map.of("success", true, "message", "Đặt lại mật khẩu thành công"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Có lỗi xảy ra khi đặt lại mật khẩu"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity forgotPassword(@RequestBody EmailRequest request) {
        try {
            Optional<User> user = userService.findByEmail(request.getEmail());
            if (user.isEmpty()) {
                return ResponseEntity.ok(Map.of("success", false));
            }

            String token = userTokenService.generateToken(user.get());
            String resetLink = frontendUrl + "/reset-password?token=" + token;

            emailService.sendResetPasswordEmail(
                    request.getEmail(),
                    user.get().getName(),
                    resetLink
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false));
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@RequestParam String token) {
        Optional<UserToken> userToken = userTokenService.findByToken(token);

        if (userToken.isEmpty() || !userToken.get().getStatus() || userToken.get().getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.ok(Map.of("valid", false));
        }

        return ResponseEntity.ok(Map.of("valid", true));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userService.existedByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email này đã được sử dụng"));
        }
        Role userRole = roleService.findByName("USER")
                .orElseGet(() -> roleService.save(new Role(null, "USER")));
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        user.setStatus(true);
        user.setRole(userRole);
        userService.save(user);
        return ResponseEntity.ok(Map.of("message", "Đăng ký thành công"));
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Optional<User> u = userService.findByEmail(loginRequest.getEmail());
        System.out.println(u.isPresent());
        if (u.isPresent()) System.out.println(u.get().getPassword());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            long maxAge = loginRequest.getRememberMe() ? 30 * 24 * 60 * 60 : 3600;

            String token = jwtService.generateToken((User) userDetails);
            System.out.println(maxAge);
            // Tạo httpOnly cookie
            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
//                .secure(true) // Chỉ dùng true nếu deploy trên HTTPS
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(maxAge)
                    .build();

            // Gửi cookie
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok(Map.of("success", true));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("success" , false, "error", "INVALID_CREDENTIALS"));
        } catch (DisabledException e) {
            return ResponseEntity.status(403).body(Map.of("success" , false, "error", "ACCOUNT_DISABLED"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success" , false, "error", "SERVER_ERROR"));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkAuthStatus(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/google")
    public void googleLogin(HttpServletResponse response) throws IOException {
        // Redirect đến trang xác thực của Google
        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/facebook")
    public void facebookLogin(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/facebook");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(UserSummaryDTO.from(user));
    }
}
