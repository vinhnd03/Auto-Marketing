package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.PostFilterDTO;
import com.codegym.auto_marketing_server.dto.PostResponseDTO;
import com.codegym.auto_marketing_server.enums.PostStatus;
import com.codegym.auto_marketing_server.service.IPostService;
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
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Posts", description = "AI Content Generation and Post Management")
public class PostController {

    private final IPostService postService;

//    @PostMapping("/generate")
//    @Operation(
//            summary = "Generate post content using AI",
//            description = "Generate marketing post content from an approved topic using AI. " +
//                    "Supports various content types and customization options.",
//            responses = {
//                    @ApiResponse(responseCode = "200", description = "Content generated successfully",
//                            content = @Content(schema = @Schema(implementation = PostResponseDTO.class))),
//                    @ApiResponse(responseCode = "400", description = "Invalid request data"),
//                    @ApiResponse(responseCode = "404", description = "Topic not found or not approved"),
//                    @ApiResponse(responseCode = "500", description = "AI generation failed")
//            }
//    )
//    public CompletableFuture<ResponseEntity<List<PostResponseDTO>>> generateContent(
//            @Valid @RequestBody ContentGenerationRequestDTO request) {
//
//        log.info("🤖 Generating {} posts for topic ID: {}",
//                request.getNumberOfPosts(), request.getTopicId());
//
//        return postService.generateContentWithAI(request)
//                .thenApply(posts -> {
//                    log.info("Successfully generated {} posts", posts.size());
//                    return ResponseEntity.ok(posts);
//                })
//                .exceptionally(throwable -> {
//                    log.error("Failed to generate content: {}", throwable.getMessage());
//                    return ResponseEntity.internalServerError().build();
//                });
//    }

    @PostMapping("/generate")
    public ResponseEntity<List<PostResponseDTO>> generateContent(
            @Valid @RequestBody ContentGenerationRequestDTO request) {

        List<PostResponseDTO> posts = postService.generateContentWithAI(request).join();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/topic/{topicId}")
    @Operation(
            summary = "Get all posts by topic",
            description = "Retrieve all posts associated with a specific topic"
    )
    public ResponseEntity<List<PostResponseDTO>> getPostsByTopic(
            @Parameter(description = "Topic ID") @PathVariable Long topicId) {

        List<PostResponseDTO> posts = postService.getPostsByTopic(topicId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/topic/{topicId}/status/{status}")
    @Operation(
            summary = "Get posts by topic and status",
            description = "Retrieve posts for a specific topic filtered by status"
    )
    public ResponseEntity<List<PostResponseDTO>> getPostsByTopicAndStatus(
            @Parameter(description = "Topic ID") @PathVariable Long topicId,
            @Parameter(description = "Post status") @PathVariable PostStatus status) {

        List<PostResponseDTO> posts = postService.getPostsByTopicAndStatus(topicId, status);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{postId}/status/{status}")
    @Operation(
            summary = "Update post status",
            description = "Update the status of a post (e.g., approve for scheduling, publish, etc.)"
    )
    public ResponseEntity<PostResponseDTO> updatePostStatus(
            @Parameter(description = "Post ID") @PathVariable Long postId,
            @Parameter(description = "New status") @PathVariable PostStatus status) {

        PostResponseDTO post = postService.updatePostStatus(postId, status);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/approve-and-clean")
    @Operation(
            summary = "Approve selected posts and delete unselected DRAFT posts",
            description = "Approve selected posts (status = APPROVED), and delete all DRAFT posts from the topic that are not selected"
    )
    public ResponseEntity<List<PostResponseDTO>> approveAndCleanPosts(
            @RequestParam Long topicId,
            @RequestBody List<Long> selectedPostIds
    ) {
        List<PostResponseDTO> result = postService.approveAndCleanPosts(topicId, selectedPostIds);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    @Operation(
            summary = "Get all posts",
            description = "Retrieve all posts stored in the database"
    )
    public ResponseEntity<List<PostResponseDTO>> getAllPosts() {
        List<PostResponseDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/filter")
    @Operation(
            summary = "Get posts by workspace/campaign/topic",
            description = "Retrieve posts filtered by workspace, campaign, and topic"
    )
    public ResponseEntity<List<PostFilterDTO>> getPostsByFilters(
            @RequestParam(required = false) Long workspaceId,
            @RequestParam(required = false) Long campaignId,
            @RequestParam(required = false) Long topicId
    ) {
        List<PostFilterDTO> posts = postService.getPostsByFilters(workspaceId, campaignId, topicId);
        return ResponseEntity.ok(posts);
    }

}
