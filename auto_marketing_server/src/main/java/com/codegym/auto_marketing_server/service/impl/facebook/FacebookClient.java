package com.codegym.auto_marketing_server.service.impl.facebook;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class FacebookClient {
    @Value("${app.facebook.graphBaseUrl}")
    private String graphBaseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public record FacebookTokenResponse(String access_token, String token_type, long expires_in) {}

    // Lấy danh sách page của user
    public ResponseEntity<String> getUserPages(String userAccessToken) {
        String url = graphBaseUrl + "/me/accounts?access_token=" + userAccessToken;
        return restTemplate.getForEntity(url, String.class);
    }

    // Đăng bài text
    public boolean publishText(String pageId, String pageAccessToken, String message) {
        String url = graphBaseUrl + "/" + pageId + "/feed";
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("message", message);
        form.add("access_token", pageAccessToken);
        form.add("published", "true");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ResponseEntity<String> resp =
                restTemplate.postForEntity(url, new HttpEntity<>(form, headers), String.class);
        return resp.getStatusCode().is2xxSuccessful();
    }

    // Đăng 1 ảnh kèm caption
    public boolean publishPhoto(String pageId, String pageAccessToken, String message, String imageUrl) {
        String url = graphBaseUrl + "/" + pageId + "/photos";
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("url", imageUrl);
        form.add("caption", message);
        form.add("access_token", pageAccessToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ResponseEntity<String> resp =
                restTemplate.postForEntity(url, new HttpEntity<>(form, headers), String.class);
        return resp.getStatusCode().is2xxSuccessful();
    }

    // Đăng nhiều ảnh trong cùng 1 post
    public boolean publishPhotos(String pageId, String pageAccessToken, String message, List<String> imageUrls) {
        try {
            List<String> attachedMedia = new ArrayList<>();

            // Upload ảnh mà không publish
            for (String url : imageUrls) {
                MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
                form.add("url", url);
                form.add("published", "false");
                form.add("access_token", pageAccessToken);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

                ResponseEntity<String> resp = restTemplate.postForEntity(
                        graphBaseUrl + "/" + pageId + "/photos",
                        new HttpEntity<>(form, headers),
                        String.class
                );

                if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                    String id = objectMapper.readTree(resp.getBody()).get("id").asText();
                    attachedMedia.add("{\"media_fbid\":\"" + id + "\"}");
                }
            }

            // Tạo album post với tất cả ảnh
            MultiValueMap<String, String> feedForm = new LinkedMultiValueMap<>();
            feedForm.add("message", message);
            for (int i = 0; i < attachedMedia.size(); i++) {
                feedForm.add("attached_media[" + i + "]", attachedMedia.get(i));
            }
            feedForm.add("access_token", pageAccessToken);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            ResponseEntity<String> feedResp = restTemplate.postForEntity(
                    graphBaseUrl + "/" + pageId + "/feed",
                    new HttpEntity<>(feedForm, headers),
                    String.class
            );

            return feedResp.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("Publish album failed: {}", e.getMessage(), e);
            return false;
        }
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
