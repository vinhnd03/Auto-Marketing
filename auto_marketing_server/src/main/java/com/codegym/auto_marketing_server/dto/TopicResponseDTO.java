package com.codegym.auto_marketing_server.dto;

import com.codegym.auto_marketing_server.enums.TopicStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Boolean generatedByAI;
    private String aiPrompt;
    private TopicStatus status;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private Long campaignId;
}
