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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class FacebookClient {
    @Value("${app.facebook.graphBaseUrl}")
    private String graphBaseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public record FacebookTokenResponse(String access_token, String token_type, long expires_in) {
    }

    // Lấy danh sách page của user
    public ResponseEntity<String> getUserPages(String userAccessToken) {
        String url = graphBaseUrl + "/me/accounts?access_token=" + userAccessToken;
        return restTemplate.getForEntity(url, String.class);
    }

    // Đăng bài text
    public String publishText(String pageId, String pageAccessToken, String message) {
        String url = graphBaseUrl + "/" + pageId + "/feed";
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("message", message);
        form.add("access_token", pageAccessToken);
        form.add("published", "true");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        try {
            ResponseEntity<String> resp =
                    restTemplate.postForEntity(url, new HttpEntity<>(form, headers), String.class);

            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                JsonNode node = objectMapper.readTree(resp.getBody());
                return node.get("id").asText(); // postId
            }
        } catch (HttpClientErrorException e) {
            try {
                JsonNode err = objectMapper.readTree(e.getResponseBodyAsString()).path("error");
                int code = err.path("code").asInt();
                int subCode = err.path("error_subcode").asInt();
                String msg = err.path("message").asText();

                log.warn("Publish text failed for page {}: {} (code={}, subCode={})",
                        pageId, msg, code, subCode);

                if (code == 190 && subCode == 492) {
                    // 👉 User mất quyền admin/editor/mod
                    log.error("User lost admin/editor rights on page {}", pageId);
                    // TODO: cập nhật DB set page inactive hoặc notify user reconnect
                } else if (code == 190) {
                    // 👉 Token hết hạn
                    log.error("Page token expired for page {}", pageId);
                }
            } catch (Exception ex) {
                log.error("Parse Facebook error response failed: {}", ex.getMessage(), ex);
            }
        } catch (Exception e) {
            log.error("Unexpected error when publishing text: {}", e.getMessage(), e);
        }

        return null;
    }


    // Đăng 1 ảnh kèm caption
    public String publishPhoto(String pageId, String pageAccessToken, String message, String imageUrl) {
        String url = graphBaseUrl + "/" + pageId + "/photos";
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("url", imageUrl);
        form.add("caption", message);
        form.add("access_token", pageAccessToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        try {
            ResponseEntity<String> resp =
                    restTemplate.postForEntity(url, new HttpEntity<>(form, headers), String.class);

            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                JsonNode node = objectMapper.readTree(resp.getBody());
                return node.has("post_id") ? node.get("post_id").asText() : node.get("id").asText();
            }
        } catch (HttpClientErrorException e) {
            try {
                JsonNode err = objectMapper.readTree(e.getResponseBodyAsString()).path("error");
                int code = err.path("code").asInt();
                int subCode = err.path("error_subcode").asInt();
                String messageErr = err.path("message").asText();

                log.warn("Publish photo failed for page {}: {} (code={}, subCode={})",
                        pageId, messageErr, code, subCode);

                // 👉 Nếu subCode = 492 hoặc code=190 => user mất quyền admin/editor/mod
                if (code == 190 && subCode == 492) {
                    // TODO: cập nhật DB: set page.isActive=false hoặc thông báo user reconnect
                    log.error("User lost admin/editor rights on page {}", pageId);
                }

            } catch (Exception ex) {
                log.error("Parse Facebook error failed: {}", ex.getMessage(), ex);
            }
        } catch (Exception e) {
            log.error("Unexpected error when publish photo: {}", e.getMessage(), e);
        }
        return null;
    }

    // Đăng nhiều ảnh trong cùng 1 post
    public String publishPhotos(String pageId, String pageAccessToken, String message, List<String> imageUrls) {
        try {
            List<String> attachedMedia = new ArrayList<>();

            // Upload từng ảnh (chưa publish)
            for (String url : imageUrls) {
                MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
                form.add("url", url);
                form.add("published", "false");
                form.add("access_token", pageAccessToken);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

                try {
                    ResponseEntity<String> resp = restTemplate.postForEntity(
                            graphBaseUrl + "/" + pageId + "/photos",
                            new HttpEntity<>(form, headers),
                            String.class
                    );

                    if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                        String id = objectMapper.readTree(resp.getBody()).get("id").asText();
                        attachedMedia.add("{\"media_fbid\":\"" + id + "\"}");
                    }
                } catch (HttpClientErrorException e) {
                    try {
                        JsonNode err = objectMapper.readTree(e.getResponseBodyAsString()).path("error");
                        int code = err.path("code").asInt();
                        int subCode = err.path("error_subcode").asInt();
                        String msg = err.path("message").asText();

                        log.warn("Upload photo failed for page {}: {} (code={}, subCode={})",
                                pageId, msg, code, subCode);

                        if (code == 190 && subCode == 492) {
                            log.error("User lost admin/editor rights on page {}", pageId);
                        } else if (code == 190) {
                            log.error("Page token expired for page {}", pageId);
                        }
                    } catch (Exception ex) {
                        log.error("Parse Facebook error response failed: {}", ex.getMessage(), ex);
                    }
                    return null; // dừng luôn nếu upload 1 ảnh fail
                }
            }

            // Tạo feed với attached_media
            MultiValueMap<String, String> feedForm = new LinkedMultiValueMap<>();
            feedForm.add("message", message);
            for (int i = 0; i < attachedMedia.size(); i++) {
                feedForm.add("attached_media[" + i + "]", attachedMedia.get(i));
            }
            feedForm.add("access_token", pageAccessToken);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            try {
                ResponseEntity<String> feedResp = restTemplate.postForEntity(
                        graphBaseUrl + "/" + pageId + "/feed",
                        new HttpEntity<>(feedForm, headers),
                        String.class
                );

                if (feedResp.getStatusCode().is2xxSuccessful() && feedResp.getBody() != null) {
                    JsonNode node = objectMapper.readTree(feedResp.getBody());
                    return node.get("id").asText(); // postId
                }
            } catch (HttpClientErrorException e) {
                try {
                    JsonNode err = objectMapper.readTree(e.getResponseBodyAsString()).path("error");
                    int code = err.path("code").asInt();
                    int subCode = err.path("error_subcode").asInt();
                    String msg = err.path("message").asText();

                    log.warn("Publish album failed for page {}: {} (code={}, subCode={})",
                            pageId, msg, code, subCode);

                    if (code == 190 && subCode == 492) {
                        log.error("User lost admin/editor rights on page {}", pageId);
                    } else if (code == 190) {
                        log.error("Page token expired for page {}", pageId);
                    }
                } catch (Exception ex) {
                    log.error("Parse Facebook error response failed: {}", ex.getMessage(), ex);
                }
            }
        } catch (Exception e) {
            log.error("Unexpected error when publishing album for page {}: {}", pageId, e.getMessage(), e);
        }
        return null;
    }


    // Đổi short-lived token → long-lived token
    public FacebookTokenResponse refreshUserToken(String appId, String appSecret, String shortLivedToken) {
        String url = String.format(
                "%s/oauth/access_token?grant_type=fb_exchange_token&client_id=%s&client_secret=%s&fb_exchange_token=%s",
                graphBaseUrl, appId, appSecret, shortLivedToken
        );
        return restTemplate.getForObject(url, FacebookTokenResponse.class);
    }

    //Lượt like, bình luận, share
    public Map<String, Integer> getPostInsights(String postId, String pageToken) {
        String url = String.format(
                "https://graph.facebook.com/.v210/%s?fields=shares.summary(true),likes.summary(true),comments.summary(true)&access_token=%s",
                postId, pageToken
        );

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        Map<String, Integer> result = new HashMap<>();
        if (response.containsKey("shares")) {
            Map shares = (Map) response.get("shares");
            result.put("shares", (Integer) shares.getOrDefault("count", 0));
        } else {
            result.put("shares", 0);
        }

        if (response.containsKey("likes")) {
            Map likes = (Map) ((Map) response.get("likes")).get("summary");
            result.put("likes", (Integer) likes.getOrDefault("total_count", 0));
        } else {
            result.put("likes", 0);
        }

        if (response.containsKey("comments")) {
            Map comments = (Map) ((Map) response.get("comments")).get("summary");
            result.put("comments", (Integer) comments.getOrDefault("total_count", 0));
        } else {
            result.put("comments", 0);
        }

        return result;
    }

}
