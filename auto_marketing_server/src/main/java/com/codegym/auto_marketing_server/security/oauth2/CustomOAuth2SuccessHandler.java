package com.codegym.auto_marketing_server.security.oauth2;

import com.codegym.auto_marketing_server.entity.Role;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.security.jwt.service.JwtService;
import com.codegym.auto_marketing_server.service.IRoleService;
import com.codegym.auto_marketing_server.service.IUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final IUserService userService;
    private final JwtService jwtService;
    private final IRoleService roleService;
    private final OAuth2AuthorizedClientService authorizedClientService;

    @Value("${FACEBOOK_CLIENT_ID}")
    private String facebookClientId;

    @Value("${FACEBOOK_CLIENT_SECRET}")
    private String facebookClientSecret;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        //provider
        String providerId = oAuth2User.getAttribute("sub"); // Google
        if (providerId == null) {
            providerId = oAuth2User.getAttribute("id"); // Facebook
        }

        // Lấy access_token và refresh_token
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                oauthToken.getAuthorizedClientRegistrationId(),
                oauthToken.getName()
        );

        String accessToken = client.getAccessToken().getTokenValue();
        Instant accessTokenExpiry = client.getAccessToken().getExpiresAt();
        String refreshToken = client.getRefreshToken() != null
                ? client.getRefreshToken().getTokenValue()
                : null;

        String provider = client.getClientRegistration().getRegistrationId();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        //avatar
        String avatarUrl;

        if ("google".equals(provider)) {
            // Google trả về trực tiếp trường picture
            avatarUrl = oAuth2User.getAttribute("picture");
        } else if ("facebook".equals(provider)) {
            // Facebook trả về picture -> data -> url
            Map<String, Object> pictureObj = oAuth2User.getAttribute("picture");
            if (pictureObj != null) {
                Map<String, Object> dataObj = (Map<String, Object>) pictureObj.get("data");
                avatarUrl = dataObj != null ? (String) dataObj.get("url") : null;
            } else {
                avatarUrl = null;
            }
        }else{
            avatarUrl = null;
        }

        // Remember me
        // Lấy rememberMe từ query param
        String rememberParam = request.getParameter("rememberMe");
        boolean rememberMe = "true".equalsIgnoreCase(rememberParam);

        long maxAge = rememberMe ? 30 * 24 * 60 * 60 : 3600;

        // Nếu provider là Facebook → đổi token sang long-lived
        if ("facebook".equalsIgnoreCase(provider)) {
            FacebookTokenData dataToken = exchangeFacebookToken(accessToken);
            accessToken = dataToken.token();
            accessTokenExpiry = dataToken.expiry();
        }

        // Kiểm tra email bắt buộc
        if (email == null || email.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Email not provided by OAuth2 provider");
            return;
        }

        // Tìm hoặc tạo user
        User user = userService.findByEmail(email).orElse(null);
        if (user == null) {
            Role userRole = roleService.findByName("USER")
                    .orElseGet(() -> roleService.save(new Role(null, "USER")));
            user = new User();
            user.setName(name != null ? name : email.split("@")[0]);
            user.setCreatedAt(LocalDate.now());
            user.setEmail(email);
            user.setRole(userRole);
            user.setPassword("OAUTH2"); // tránh null
            user.setStatus(true);
        }

        // Cập nhật thông tin OAuth2
        user.setProvider(provider);
        user.setProviderId(providerId);
        user.setAccessToken(accessToken);
        user.setRefreshToken(refreshToken);
        user.setAccessTokenExpiry(accessTokenExpiry);
        if(avatarUrl != null && user.getAvatar() == null ) {
            user.setAvatar(avatarUrl);
        }

        userService.save(user);

        // Tạo JWT lưu trong cookie
        String jwtToken = jwtService.generateToken(user);
        System.out.println(maxAge);
        // Tạo httpOnly cookie
        ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
//                .secure(true) // Chỉ dùng true nếu deploy trên HTTPS
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAge) // 1 giờ
                .build();

        // Gửi cookie
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        response.sendRedirect(frontendUrl + "/oauth2/success");
    }

    private FacebookTokenData exchangeFacebookToken(String shortLivedToken) {
        String url = "https://graph.facebook.com/v23.0/oauth/access_token"
                + "?grant_type=fb_exchange_token"
                + "&client_id=" + facebookClientId
                + "&client_secret=" + facebookClientSecret
                + "&fb_exchange_token=" + shortLivedToken;

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> result = restTemplate.getForObject(url, Map.class);

        if (result != null && result.get("access_token") != null) {
            String longLivedToken = (String) result.get("access_token");

            // nếu có expires_in → tính ra Instant
            Instant expiry = null;
            if (result.get("expires_in") != null) {
                long expiresInSec = ((Number) result.get("expires_in")).longValue();
                expiry = Instant.now().plusSeconds(expiresInSec);
                // lưu expiry vào user sau khi gọi hàm này
                System.out.println("expiry: " + expiry);
            }

            return new FacebookTokenData(longLivedToken, expiry);
        }
        return new FacebookTokenData(shortLivedToken, null);
    }

}

/*
* GET https://graph.facebook.com/v23.0/oauth/access_token
?grant_type=fb_exchange_token
&client_id={app-id}
&client_secret={app-secret}
&fb_exchange_token={short-lived-access-token}
* */
