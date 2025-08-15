package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.TopicGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.TopicResponseDTO;
import com.codegym.auto_marketing_server.enums.TopicStatus;
import com.codegym.auto_marketing_server.service.ITopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/topics")
@RequiredArgsConstructor
@CrossOrigin("*")
@Slf4j
@Tag(name = "Topics", description = "AI Topic Generation and Management")
public class TopicController {

    private final ITopicService topicService;

    @PostMapping("/generate")
    @Operation(
            summary = "Generate marketing topics using AI",
            description = "Generate multiple marketing topics for a campaign using AI. " +
                    "The AI will create relevant, engaging topics based on the campaign information.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Topics generated successfully",
                            content = @Content(schema = @Schema(implementation = TopicResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid request data"),
                    @ApiResponse(responseCode = "404", description = "Campaign not found"),
                    @ApiResponse(responseCode = "500", description = "AI generation failed")
            }
    )
    public CompletableFuture<ResponseEntity<List<TopicResponseDTO>>> generateTopics(
            @Valid @RequestBody TopicGenerationRequestDTO request) {

        log.info("🎯 Generating {} topics for campaign ID: {}",
                request.getNumberOfTopics(), request.getCampaignId());

        return topicService.generateTopicsWithAI(request)
                .thenApply(topics -> {
                    log.info("✅ Successfully generated {} topics", topics.size());
                    return ResponseEntity.ok(topics);
                })
                .exceptionally(throwable -> {
                    log.error("❌ Failed to generate topics: {}", throwable.getMessage());
                    return ResponseEntity.internalServerError().build();
                });
    }

    @GetMapping("/campaign/{campaignId}")
    @Operation(
            summary = "Get all topics by campaign",
            description = "Retrieve all topics associated with a specific campaign"
    )
    public ResponseEntity<List<TopicResponseDTO>> getTopicsByCampaign(
            @Parameter(description = "Campaign ID") @PathVariable Long campaignId) {

        List<TopicResponseDTO> topics = topicService.getTopicsByCampaign(campaignId);
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/campaign/{campaignId}/status/{status}")
    @Operation(
            summary = "Get topics by campaign and status",
            description = "Retrieve topics for a specific campaign filtered by status"
    )
    public ResponseEntity<List<TopicResponseDTO>> getTopicsByCampaignAndStatus(
            @Parameter(description = "Campaign ID") @PathVariable Long campaignId,
            @Parameter(description = "Topic status") @PathVariable TopicStatus status) {

        List<TopicResponseDTO> topics = topicService.getTopicsByCampaignAndStatus(campaignId, status);
        return ResponseEntity.ok(topics);
    }

    @PutMapping("/{topicId}/approve")
    @Operation(
            summary = "Approve a topic",
            description = "Approve a topic for content generation"
    )
    public ResponseEntity<TopicResponseDTO> approveTopic(
            @Parameter(description = "Topic ID") @PathVariable Long topicId) {

        TopicResponseDTO topic = topicService.approveTopic(topicId);
        return ResponseEntity.ok(topic);
    }

    @PutMapping("/{topicId}/reject")
    @Operation(
            summary = "Reject a topic",
            description = "Reject a topic - it won't be used for content generation"
    )
    public ResponseEntity<TopicResponseDTO> rejectTopic(
            @Parameter(description = "Topic ID") @PathVariable Long topicId) {

        TopicResponseDTO topic = topicService.rejectTopic(topicId);
        return ResponseEntity.ok(topic);
    }

    // --- Thêm API xóa một topic ---
    @DeleteMapping("/{topicId}")
    @Operation(
            summary = "Delete a topic",
            description = "Delete a topic by its ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Topic deleted successfully"),
                    @ApiResponse(responseCode = "404", description = "Topic not found")
            }
    )
    public ResponseEntity<Void> deleteTopic(@Parameter(description = "Topic ID") @PathVariable Long topicId) {
        topicService.deleteById(topicId);
        log.info("🗑️ Deleted topic ID: {}", topicId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    @Operation(
            summary = "Delete all topics",
            description = "Delete all topics in the system",
            responses = {
                    @ApiResponse(responseCode = "200", description = "All topics deleted successfully")
            }
    )
    public ResponseEntity<Void> deleteAllTopics() {
        topicService.deleteAll();
        log.info("🗑️ Deleted all topics");
        return ResponseEntity.ok().build();
    }
}
