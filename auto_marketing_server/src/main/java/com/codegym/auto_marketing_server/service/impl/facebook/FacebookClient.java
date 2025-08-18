package com.codegym.auto_marketing_server.service.impl.facebook;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class FacebookClient {
    @Value("${app.facebook.graphBaseUrl}")
    private String graphBaseUrl;

    private final RestTemplate restTemplate;
    public record FacebookTokenResponse(String access_token, String token_type, long expires_in) {}

    // Lấy danh sách page của user (dùng user access token)
    public ResponseEntity<String> getUserPages(String userAccessToken) {
        String url = graphBaseUrl + "/me/accounts?access_token=" + userAccessToken;
        return restTemplate.getForEntity(url, String.class);
    }

    // Đăng bài text lên fanpage (dùng page access token)
    public boolean publishText(String pageId, String pageAccessToken, String message) {
        String url = graphBaseUrl + "/" + pageId + "/feed";
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("message", message);
        form.add("access_token", pageAccessToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ResponseEntity<String> resp = restTemplate.postForEntity(url, new HttpEntity<>(form, headers), String.class);
        return resp.getStatusCode().is2xxSuccessful();
    }

    // Đổi short-lived token → long-lived token
    public FacebookTokenResponse refreshUserToken(String appId, String appSecret, String shortLivedToken) {
        String url = String.format(
                "%s/oauth/access_token?grant_type=fb_exchange_token&client_id=%s&client_secret=%s&fb_exchange_token=%s",
                graphBaseUrl, appId, appSecret, shortLivedToken
        );
        return restTemplate.getForObject(url, FacebookTokenResponse.class);
    }
}
