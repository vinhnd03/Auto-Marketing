package com.codegym.auto_marketing_server.controller.publish;

import com.codegym.auto_marketing_server.dto.FanpageDTO;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.repository.IUserRepository;
import com.codegym.auto_marketing_server.service.IFanpageService;
import com.codegym.auto_marketing_server.service.ISocialAccountService;
import com.codegym.auto_marketing_server.service.IUserService;
import com.codegym.auto_marketing_server.service.impl.SocialAccountService;
import com.codegym.auto_marketing_server.service.impl.facebook.FacebookService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialAccountController {
    private final ISocialAccountService socialAccountService;
    private final IUserRepository userRepository;
    private final OAuth2AuthorizedClientService authorizedClientService;
    private final IUserService userService;
    private final FacebookService facebookService;
    private final IFanpageService fanpageService;
    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.facebook.appId}")
    private String appId;
    @Value("${app.facebook.appSecret}")
    private String appSecret;
    @Value("${app.facebook.redirectUri}")
    private String redirectUri;

    @GetMapping("/check")
    public ResponseEntity<?> checkLinked(@RequestParam Long userId) {
        Optional<SocialAccount> account = socialAccountService.getByUserId(userId);
        if (account.isEmpty()) {
            return ResponseEntity.ok(Map.of("linked", false));
        }

        List<FanpageDTO> pages = fanpageService.getByUserId(userId);

        return ResponseEntity.ok(Map.of(
                "linked", true,
                "account", Map.of(
                        "id", account.get().getId(),
                        "name", account.get().getAccountName(),
                        "platform", account.get().getPlatform()
                ),
                "pages", pages
        ));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getByUserId(@PathVariable Long userId) {
        Optional<SocialAccount> accounts = socialAccountService.getByUserId(userId);
        if (accounts.isEmpty()) {
            return new ResponseEntity<>("Không tìm thấy social account nào", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(accounts);
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
    public void connectFacebook(HttpServletResponse response) throws IOException {
        User currentUser = userService.getCurrentUser(); // user đã login
        if (currentUser == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in");
            return;
        }

        System.out.println("hello");

        String clientId = appId;
        String state = currentUser.getId().toString(); // lưu userId

        String url = "https://www.facebook.com/v17.0/dialog/oauth" +
                "?client_id=" + clientId +
                "&redirect_uri=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8) +
                "&state=" + state +
                "&scope=email,public_profile"
                ;

        response.sendRedirect(url);
    }

    @GetMapping("/connect/facebook/callback")
    public ResponseEntity<?> facebookCallback(
            @RequestParam String code,
            @RequestParam String state) {

        Long userId = Long.parseLong(state);
        User currentUser = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = facebookService.getAccessTokenFromCode(code); // bạn tự implement exchange code -> token

        Map<String, Object> fbUser = facebookService.getUserInfo(accessToken);
        String providerId = fbUser.get("id").toString();
        String name = fbUser.get("name").toString();

        socialAccountService.saveFacebookAccount(currentUser, accessToken, name, providerId);

        return ResponseEntity.ok("Facebook linked successfully");
    }

}
