package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.PostFilterDTO;
import com.codegym.auto_marketing_server.dto.PostResponseDTO;
import com.codegym.auto_marketing_server.enums.PostStatus;
import com.codegym.auto_marketing_server.service.IPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Posts", description = "AI Content Generation and Post Management")
public class PostController {

    private final IPostService postService;

    @PostMapping("/generate")
    public ResponseEntity<List<PostResponseDTO>> generateContent(@Valid @RequestBody ContentGenerationRequestDTO request) {

        List<PostResponseDTO> posts = postService.generateContentWithAI(request).join();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/topic/{topicId}")
    @Operation(summary = "Get all posts by topic", description = "Retrieve all posts associated with a specific topic")
    public ResponseEntity<List<PostResponseDTO>> getPostsByTopic(@Parameter(description = "Topic ID") @PathVariable Long topicId) {

        List<PostResponseDTO> posts = postService.getPostsByTopic(topicId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/topic/{topicId}/status/{status}")
    @Operation(summary = "Get posts by topic and status", description = "Retrieve posts for a specific topic filtered by status")
    public ResponseEntity<List<PostResponseDTO>> getPostsByTopicAndStatus(@Parameter(description = "Topic ID") @PathVariable Long topicId, @Parameter(description = "Post status") @PathVariable PostStatus status) {

        List<PostResponseDTO> posts = postService.getPostsByTopicAndStatus(topicId, status);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{postId}/status/{status}")
    @Operation(summary = "Update post status", description = "Update the status of a post (e.g., approve for scheduling, publish, etc.)")
    public ResponseEntity<PostResponseDTO> updatePostStatus(@Parameter(description = "Post ID") @PathVariable Long postId, @Parameter(description = "New status") @PathVariable PostStatus status) {

        PostResponseDTO post = postService.updatePostStatus(postId, status);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/approve-and-clean")
    @Operation(summary = "Approve selected posts and delete unselected DRAFT posts", description = "Approve selected posts (status = APPROVED), and delete all DRAFT posts from the topic that are not selected")
    public ResponseEntity<List<PostResponseDTO>> approveAndCleanPosts(@RequestParam Long topicId, @RequestBody List<Long> selectedPostIds) {
        List<PostResponseDTO> result = postService.approveAndCleanPosts(topicId, selectedPostIds);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all posts", description = "Retrieve all posts stored in the database")
    public ResponseEntity<List<PostResponseDTO>> getAllPosts() {
        List<PostResponseDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/filter")
    @Operation(summary = "Get posts by workspace/campaign/topic", description = "Retrieve posts filtered by workspace, campaign, and topic")
    public ResponseEntity<List<PostFilterDTO>> getPostsByFilters(@RequestParam(required = false) Long workspaceId, @RequestParam(required = false) Long campaignId, @RequestParam(required = false) Long topicId) {
        List<PostFilterDTO> posts = postService.getPostsByFilters(workspaceId, campaignId, topicId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/topic/count/{topicId}")
    @Operation(summary = "Count posts by topic", description = "Get total number of posts for a specific topic")
    public ResponseEntity<Long> countPostsByTopic(@Parameter(description = "Topic ID") @PathVariable Long topicId) {
        long count = postService.countPostsByTopic(topicId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/topic/{topicId}/approved")
    @Operation(summary = "Get APPROVED posts by topic", description = "Retrieve all posts with status APPROVED for a specific topic")
    public ResponseEntity<List<PostResponseDTO>> getApprovedPostsByTopic(@Parameter(description = "Topic ID") @PathVariable Long topicId) {

        List<PostResponseDTO> posts = postService.getPostsByTopicAndStatus(topicId, PostStatus.APPROVED);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/topic/{topicId}/count/approved")
    @Operation(summary = "Count APPROVED posts by topic", description = "Get total number of posts with status APPROVED for a specific topic")
    public ResponseEntity<Long> countApprovedPostsByTopic(@PathVariable Long topicId) {
        long count = postService.countPostsByTopicAndStatus(topicId, PostStatus.APPROVED);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/{postId}/generate-image")
    @Operation(summary = "Generate image for a post", description = "Generate an AI image related to a post's content. Optionally, user can add their own instructions for the image prompt.")
    public ResponseEntity<String> generateImageForPost(@PathVariable Long postId, @RequestParam(required = false) String imageInstructions) {
        String aiImageUrl = postService.generateImageForPost(postId, imageInstructions);
        return ResponseEntity.ok(aiImageUrl);
    }

}
