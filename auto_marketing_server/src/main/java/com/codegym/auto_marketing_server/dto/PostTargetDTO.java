package com.codegym.auto_marketing_server.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostTargetDTO {
    private Long id;
    private Long postId;
    private String postUrl;
    private PostGoalDTO goals;
    private PostActualStatsDTO actualStats;
    private LocalDateTime goalsSetAt;
    private LocalDateTime statsUpdatedAt;
    private ProgressSummaryDTO progress;

    @Data
    public static class ProgressSummaryDTO {
        private Double likesProgress;
        private Double overallProgress; // Chỉ cần 2 field này
    }
}