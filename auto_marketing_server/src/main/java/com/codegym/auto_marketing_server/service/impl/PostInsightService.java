package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.InsightDTO;
import com.codegym.auto_marketing_server.entity.PostInsight;
import com.codegym.auto_marketing_server.entity.PostTarget;
import com.codegym.auto_marketing_server.repository.IPostInsightRepository;
import com.codegym.auto_marketing_server.service.IPostInsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostInsightService implements IPostInsightService {
    private final IPostInsightRepository postInsightRepository;

    @Override
    public Map<String, Integer> fetchInsightsFromFacebook(String postId, String pageToken) {
        String url = String.format(
                "https://graph.facebook.com/v21.0/%s?fields=shares.summary(true),reactions.summary(true),comments.summary(true)&access_token=%s",
                postId, pageToken
        );

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        Map<String, Integer> result = new HashMap<>();

        // Shares
        if (response.containsKey("shares")) {
            Map shares = (Map) response.get("shares");
            result.put("shares", ((Number) shares.getOrDefault("count", 0)).intValue());
        } else {
            result.put("shares", 0);
        }

        // Reactions (likes)
        if (response.containsKey("reactions")) {
            Map reactions = (Map) ((Map) response.get("reactions")).get("summary");
            result.put("likes", ((Number) reactions.getOrDefault("total_count", 0)).intValue());
        } else {
            result.put("likes", 0);
        }

        // Comments
        if (response.containsKey("comments")) {
            Map comments = (Map) ((Map) response.get("comments")).get("summary");
            result.put("comments", ((Number) comments.getOrDefault("total_count", 0)).intValue());
        } else {
            result.put("comments", 0);
        }

        return result;
    }

    @Override
    public InsightDTO updateInsights(PostTarget target) {
        System.out.println("updateInsights called for target id=" + target.getId() + ", postUrl=" + target.getPostUrl());

        Map<String, Integer> insights = new HashMap<>();

        // Nếu có URL thì gọi API FB
        if (target.getPostUrl() != null && !target.getPostUrl().isBlank()) {
            String postId = extractPostIdFromUrl(target.getPostUrl());
            System.out.println("Extracted postId: " + postId);

            if (postId != null) {
                String pageToken = target.getFanpage().getPageAccessNameToken(); // sửa tên getter đúng field
                insights = fetchInsightsFromFacebook(postId, pageToken);
            }
        }

        // lưu insight (nếu không có URL thì mặc định 0)
        PostInsight insight = postInsightRepository.findByPostTarget(target)
                .orElse(new PostInsight());
        insight.setPostTarget(target);
        insight.setLikeCount(insights.getOrDefault("likes", 0));
        insight.setCommentCount(insights.getOrDefault("comments", 0));
        insight.setShareCount(insights.getOrDefault("shares", 0));
        insight.setLastCheckedAt(LocalDateTime.now());
        postInsightRepository.save(insight);

        return new InsightDTO(
                target.getId(),
                target.getPostUrl(),
                target.getFanpage().getPageName(),
                insight.getShareCount(),
                insight.getLikeCount(),
                insight.getCommentCount(),
                insight.getLastCheckedAt()
        );
    }


    private PostInsight saveEmptyInsight(PostTarget target) {
        PostInsight insight = postInsightRepository.findByPostTarget(target)
                .orElse(new PostInsight());
        insight.setPostTarget(target);
        insight.setLikeCount(0);
        insight.setCommentCount(0);
        insight.setShareCount(0);
        insight.setLastCheckedAt(LocalDateTime.now());

        return postInsightRepository.save(insight);
    }

    /**
     * Extract postId từ URL Facebook.
     * Hỗ trợ nhiều loại link: /posts/, story.php, permalink.php
     */
    private String extractPostIdFromUrl(String url) {
        try {
            if (url.contains("/posts/")) {
                // https://www.facebook.com/{pageId}/posts/{postId}
                String[] parts = url.split("/");
                if (parts.length >= 6) {
                    String pageId = parts[3];
                    String postId = parts[5];
                    return pageId + "_" + postId;
                }
            } else if (url.contains("story_fbid")) {
                // https://www.facebook.com/story.php?story_fbid={postId}&id={pageId}
                String postId = url.replaceAll(".*story_fbid=(\\d+).*", "$1");
                String pageId = url.replaceAll(".*id=(\\d+).*", "$1");
                return pageId + "_" + postId;
            } else if (url.contains("permalink.php")) {
                // https://www.facebook.com/permalink.php?story_fbid={postId}&id={pageId}
                String postId = url.replaceAll(".*story_fbid=(\\d+).*", "$1");
                String pageId = url.replaceAll(".*id=(\\d+).*", "$1");
                return pageId + "_" + postId;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }}
