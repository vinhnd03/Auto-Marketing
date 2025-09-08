package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.*;
import com.codegym.auto_marketing_server.enums.PostStatus;
import com.codegym.auto_marketing_server.service.IPostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Posts", description = "AI Content Generation and Post Management")
public class PostController {

    private final IPostService postService;
    private final ObjectMapper objectMapper;

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

    @PostMapping("/{postId}/generate-images")
    public ResponseEntity<List<String>> generateImagesForPost(@PathVariable Long postId, @RequestBody ImageGenerationRequestDTO request) {
        // Validate quyền sở hữu post nếu cần
        List<String> imageUrls = postService.generateImagesForPost(postId, request.getPrompt(), request.getStyle(), request.getNumImages());
        return ResponseEntity.ok(imageUrls);
    }

    @PostMapping("/{postId}/save-images")
    public ResponseEntity<Void> saveImagesForPost(@PathVariable Long postId, @RequestBody List<String> selectedImageUrls) {
        postService.saveImagesForPost(postId, selectedImageUrls);
        return ResponseEntity.ok().build();
    }

    // Update JSON (chỉ nội dung, hashtag, topic, không upload file)
    @PutMapping(value = "/{postId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostResponseDTO> updatePostJsonV2(@PathVariable Long postId, @RequestBody PostUpdateDTO requestDto) throws Exception {
        return ResponseEntity.ok(postService.updatePostV2(postId, requestDto, null));
    }

    // Update Multipart (có upload file)
    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDTO> updatePostMultipartV2(@PathVariable Long postId, @RequestPart("data") PostUpdateDTO requestDto, @RequestPart(value = "files", required = false) MultipartFile[] files) throws Exception {
        return ResponseEntity.ok(postService.updatePostV2(postId, requestDto, files));
    }

    @GetMapping("/campaign/{campaignId}/approved")
    @Operation(summary = "Get all APPROVED posts by campaign", description = "Retrieve all posts with status APPROVED for a specific campaign")
    public ResponseEntity<List<PostResponseDTO>> getApprovedPostsByCampaign(@Parameter(description = "Campaign ID") @PathVariable Long campaignId) {
        List<PostResponseDTO> posts = postService.getApprovedPostsByCampaign(campaignId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/workspace/{workspaceId}/approved")
    @Operation(summary = "Get all APPROVED posts by workspace", description = "Retrieve all posts with status APPROVED for a specific workspace")
    public ResponseEntity<List<PostResponseDTO>> getApprovedPostsByWorkspace(@Parameter(description = "Workspace ID") @PathVariable Long workspaceId) {
        List<PostResponseDTO> posts = postService.getApprovedPostsByWorkspace(workspaceId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/workspace/{workspaceId}/count/approved")
    @Operation(
            summary = "Count APPROVED posts by workspace",
            description = "Get total number of posts with status APPROVED for a specific workspace"
    )
    public ResponseEntity<Long> countApprovedPostsByWorkspace(@PathVariable Long workspaceId) {
        long count = postService.countPostsByWorkspaceAndStatus(workspaceId, PostStatus.APPROVED);
        return ResponseEntity.ok(count);
    }
}
