package com.codegym.auto_marketing_server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class PostFilterDTO {
    private Long id;
    private String content;
    private String aiModel;
    private String contentType;
    private String tone;
    private String hashtag;
    private LocalDate createdAt;
    private String title;

    private Long topicId;
    private String topicName;

    private Long campaignId;
    private String campaignName;

    private Long workspaceId;
    private String workspaceName;
    public PostFilterDTO(Long id, String content, String aiModel, String contentType, String tone,
                         String hashtag, LocalDate createdAt,
                         String title,
                         Long topicId, String topicName,
                         Long campaignId, String campaignName,
                         Long workspaceId, String workspaceName) {
        this.id = id;
        this.content = content;
        this.aiModel = aiModel;
        this.contentType = contentType;
        this.tone = tone;
        this.hashtag = hashtag;
        this.createdAt = createdAt;
        this.title = title;
        this.topicId = topicId;
        this.topicName = topicName;
        this.campaignId = campaignId;
        this.campaignName = campaignName;
        this.workspaceId = workspaceId;
        this.workspaceName = workspaceName;
    }
}
