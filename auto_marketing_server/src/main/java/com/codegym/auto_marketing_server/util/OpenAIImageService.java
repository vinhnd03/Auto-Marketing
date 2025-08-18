package com.codegym.auto_marketing_server.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OpenAIImageService {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateImageUrlFromPrompt(String prompt) {
        String url = "https://api.openai.com/v1/images/generations";

        // Chuẩn bị request body
        String body = String.format("""
                {
                    "prompt": "%s",
                    "n": 1,
                    "size": "1024x1024"
                }
                """, prompt.replace("\"", "\\\""));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        // Parse JSON để lấy URL ảnh
        // {"created":..., "data":[{"url":"https://..."}]}
        String json = response.getBody();
        String imageUrl = "";
        if (json != null && json.contains("\"url\"")) {
            int idx = json.indexOf("\"url\"");
            int start = json.indexOf("\"", idx + 5) + 1;
            int end = json.indexOf("\"", start);
            imageUrl = json.substring(start, end);
        }
        return imageUrl;
    }
}