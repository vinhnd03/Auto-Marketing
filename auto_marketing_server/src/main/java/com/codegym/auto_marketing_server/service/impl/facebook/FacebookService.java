package com.codegym.auto_marketing_server.service.impl.facebook;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class FacebookService {

    @Value("${app.facebook.appId}")
    private String appId;

    @Value("${app.facebook.appSecret}")
    private String appSecret;

    @Value("${app.facebook.redirectUri}")
    private String redirectUri; // callback URL

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Exchange code -> access token
     */
    public String getAccessTokenFromCode(String code) {
        String url = "https://graph.facebook.com/v17.0/oauth/access_token" +
                "?client_id=" + appId +
                "&redirect_uri=" + redirectUri +
                "&client_secret=" + appSecret +
                "&code=" + code;
        System.out.println("=== Requesting Facebook token with URL: " + url);

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            System.out.println("=== Facebook token response: " + response);

            if (response != null && response.containsKey("access_token")) {
                return response.get("access_token").toString();
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to get access token from code: " + e.getMessage(), e);
        }

        throw new RuntimeException("Could not retrieve access token from code");
    }

    /**
     * Lấy thông tin user từ access token
     */
    public Map<String, Object> getUserInfo(String accessToken) {
        String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;
        return restTemplate.getForObject(url, Map.class);
    }
}
