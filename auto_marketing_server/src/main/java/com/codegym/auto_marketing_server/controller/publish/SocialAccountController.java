package com.codegym.auto_marketing_server.controller.publish;

import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.repository.IUserRepository;
import com.codegym.auto_marketing_server.service.impl.SocialAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("api/social")
@RequiredArgsConstructor
public class SocialAccountController {
    private final SocialAccountService socialAccountService;
    private final IUserRepository userRepository;
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
}
