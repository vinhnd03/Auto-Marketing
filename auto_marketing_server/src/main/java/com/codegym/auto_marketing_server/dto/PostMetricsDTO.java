package com.codegym.auto_marketing_server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Post generation and performance metrics")
public class PostMetricsDTO {

    @Schema(description = "Words per minute generation speed", example = "245")
    private Double wordsPerMinute;

    @Schema(description = "AI confidence score", example = "92.5")
    private Double aiConfidenceScore;

    @Schema(description = "Content quality score", example = "8.7")
    private Double qualityScore;

    @Schema(description = "Readability score", example = "7.2")
    private Double readabilityScore;

    @Schema(description = "SEO score", example = "85")
    private Integer seoScore;

    @Schema(description = "Estimated social media reach", example = "2500")
    private Integer estimatedReach;

    @Schema(description = "Generation time in milliseconds", example = "3250")
    private Long generationTimeMs;

    @Schema(description = "Token usage for AI generation", example = "1247")
    private Integer tokenUsage;
}
