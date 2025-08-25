package com.codegym.auto_marketing_server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for generating marketing topics using AI")
public class TopicGenerationRequestDTO {

    @NotNull(message = "Campaign ID is required")
    @Schema(
            description = "ID of the campaign to generate topics for",
            example = "1",
            required = true
    )
    private Long campaignId;

    @Min(value = 1, message = "Number of topics must be at least 1")
    @Max(value = 20, message = "Number of topics must be at most 20")
    @Schema(
            description = "Number of topics to generate",
            example = "5",
            minimum = "1",
            maximum = "20",
            defaultValue = "5"
    )
    private Integer numberOfTopics = 5;

    @Schema(
            description = "Additional instructions for AI to customize topic generation",
            example = "Focus on technology and innovation themes for a software company",
            maxLength = 500
    )
    private String additionalInstructions;

    private String creativityLevel;  // "conservative", "balanced", "creative"
    private String contentStyle;     // "friendly", "professional", "creative"
}
