package com.codegym.auto_marketing_server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsightDTO {
    private Long targetId;
    private String postUrl;
    private String pageName;

    private int shares;
    private int likes;
    private int comments;

    private LocalDateTime lastCheckedAt;
}
