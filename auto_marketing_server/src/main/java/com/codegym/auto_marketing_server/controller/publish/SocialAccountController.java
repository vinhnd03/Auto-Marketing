package com.codegym.auto_marketing_server.controller.publish;

import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.repository.IUserRepository;
import com.codegym.auto_marketing_server.service.ISocialAccountService;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.service.impl.SocialAccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("api/social")
@RequiredArgsConstructor
public class SocialAccountController {
    private final ISocialAccountService socialAccountService;
    private final IUserRepository userRepository;
    private final OAuth2AuthorizedClientService authorizedClientService;
    private final IUserService userService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @GetMapping("/check")
    public ResponseEntity<?> checkLinked(@RequestParam Long userId) {
        boolean linked = socialAccountService.isLinked(userId);
        return ResponseEntity.ok(
                linked
                        ? "User " + userId + " đã liên kết mạng xã hội"
                        : "User " + userId + " chưa liên kết mạng xã hội"
        );
    }

    @PostMapping("/link")
    public ResponseEntity<?> linkAccount(@RequestParam Long userId, @RequestBody SocialAccount account) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
// Đổi short-lived token sang long-lived
        String longLivedToken = exchangeForLongLivedToken(account.getAccessToken());
        account.setAccessToken(longLivedToken);
        account.setUser(user);
        SocialAccount saved = socialAccountService.save(account);
        return ResponseEntity.ok(saved);
    }
    /**
     * Gọi API Facebook để đổi sang Long-Lived Token
     */
    private String exchangeForLongLivedToken(String shortLivedToken) {
        String appId = "784932350736349";
        String appSecret = "732fed631b493a4a56ce183cf3f2cf3e";

        String url = "https://graph.facebook.com/v21.0/oauth/access_token" +
                "?grant_type=fb_exchange_token" +
                "&client_id=" + appId +
                "&client_secret=" + appSecret +
                "&fb_exchange_token=" + shortLivedToken;

        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("access_token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to exchange token: " + e.getMessage(), e);
        }
        throw new RuntimeException("Could not get long-lived token");
    }

    @GetMapping("/connect/facebook")
    public void connectFacebook(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Lấy OAuth2 token từ SecurityContext
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication();

        if (oauthToken == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No OAuth2 token found");
            return;
        }

        OAuth2User oAuth2User = oauthToken.getPrincipal();

        String accessToken = authorizedClientService
                .loadAuthorizedClient(oauthToken.getAuthorizedClientRegistrationId(), oauthToken.getName())
                .getAccessToken()
                .getTokenValue();

        String providerId = oAuth2User.getAttribute("id");
        String name = oAuth2User.getAttribute("name");

        User currentUser = userService.getCurrentUser(); // user đang đăng nhập vào app
        if (currentUser == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in to app");
            return;
        }

        socialAccountService.saveFacebookAccount(currentUser, accessToken, name, providerId);

        response.sendRedirect(frontendUrl + "/facebook-connected");
    }
}
