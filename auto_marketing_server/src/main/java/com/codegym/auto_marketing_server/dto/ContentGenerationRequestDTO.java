package com.codegym.auto_marketing_server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Enhanced content generation request - supports both short and long-form content")
public class ContentGenerationRequestDTO {

    @NotNull(message = "Topic ID is required")
    @Positive(message = "Topic ID must be positive")
    @Schema(description = "ID of the approved topic", example = "35")
    private Long topicId;

    @NotNull(message = "Number of posts is required")
    @Min(value = 1, message = "Must generate at least 1 post")
    @Max(value = 5, message = "Cannot generate more than 5 posts at once")
    @Schema(description = "Number of posts to generate", example = "1")
    private Integer numberOfPosts = 1;

    @Schema(description = "Tone of the content", example = "professional", allowableValues = {
            "professional", "casual", "enthusiastic", "informative", "promotional", "inspirational", "friendly", "urgent", "cheerful"})
    private String tone = "professional";

    @Schema(description = "Type and length of content to generate", example = "social_post", allowableValues = {
            "social_post", "article", "long_article", "blog_post", "detailed_guide", "white_paper", "case_study", "story", "email", "promotion", "text_only", "image_text", "mixed"})
    private String contentType = "social_post";

    @Min(value = 100, message = "Word count must be at least 100")
    @Max(value = 2000, message = "Word count cannot exceed 2000")
    @Schema(description = "Target word count for the content", example = "800")
    private Integer targetWordCount;

    @Schema(description = "Include structured sections", example = "true")
    private Boolean includeSections = false;

    @Schema(description = "Include introduction and conclusion", example = "true")
    private Boolean includeIntroConclusion = false;

    @Schema(description = "Include bullet points and lists", example = "true")
    private Boolean includeBulletPoints = false;

    @Schema(description = "Include call-to-action", example = "true")
    private Boolean includeCallToAction = true;

    @Schema(description = "Include statistics and data", example = "false")
    private Boolean includeStatistics = false;

    @Schema(description = "Include case studies or examples", example = "false")
    private Boolean includeCaseStudies = false;

    @Schema(description = "Whether to generate image prompts", example = "true")
    private Boolean includeImage = false;

    @Schema(description = "Tự động tạo hashtags", example = "true")
    private Boolean includeHashtag = true;

    @Size(max = 500, message = "Additional instructions cannot exceed 500 characters")
    @Schema(description = "Additional instructions for content generation in Vietnamese", example = "Viết bài chi tiết về AI trong doanh nghiệp Việt Nam. Bao gồm ví dụ thực tế và hướng dẫn cụ thể.")
    private String additionalInstructions;

    @Schema(description = "Target platform for the content", example = "facebook", allowableValues = {
            "facebook", "instagram", "linkedin", "twitter", "blog", "website", "email"})
    private String targetPlatform = "facebook";

    @Schema(description = "Target audience for the content", example = "general", allowableValues = {
            "general", "business_owners", "young_professionals", "students", "tech_enthusiasts"})
    private String targetAudience = "general";

    @Schema(description = "AI Model to use for content generation", example = "gpt-4.1", allowableValues = {
            "gpt-4.1", "gemini-pro", "claude-3-opus", "llama-3-70b"})
    private String aiModel = "gpt-4.1";
}