package com.codegym.auto_marketing_server.dto;

import lombok.Data;

import java.util.List;

@Data
public class ApprovePostsRequestDTO {
    private Long topicId;
    private List<Long> selectedPostIds;
}