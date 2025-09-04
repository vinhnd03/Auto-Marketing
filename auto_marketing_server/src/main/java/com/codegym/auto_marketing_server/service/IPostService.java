package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.PostFilterDTO;
import com.codegym.auto_marketing_server.dto.PostResponseDTO;
import com.codegym.auto_marketing_server.dto.PostUpdateDTO;
import com.codegym.auto_marketing_server.entity.Post;
import com.codegym.auto_marketing_server.enums.PostStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IPostService {
    CompletableFuture<List<PostResponseDTO>> generateContentWithAI(ContentGenerationRequestDTO request);

    List<PostResponseDTO> getPostsByTopic(Long topicId);

    List<PostResponseDTO> getPostsByTopicAndStatus(Long topicId, PostStatus status);

    PostResponseDTO updatePostStatus(Long postId, PostStatus status);

    Post findById(Long postId);

    Post save(Post post);

    List<PostResponseDTO> getAllPosts();

    List<PostResponseDTO> approveAndCleanPosts(Long topicId, List<Long> selectedPostIds);

    List<PostFilterDTO> getPostsByFilters(Long workspaceId, Long campaignId, Long topicId);

    long countPostsByTopic(Long topicId);

    long countPostsByTopicAndStatus(Long topicId, PostStatus status);

    String generateImagePromptForPost(Long postId, String userInstructions);

    String generateImageForPost(Long postId, String userInstructions);

    List<String> generateImagesForPost(Long postId, String prompt, String style, int numImages);

    void saveImagesForPost(Long postId, List<String> selectedImageUrls);

    List<PostResponseDTO> getApprovedPostsByCampaign(Long campaignId);

    List<PostResponseDTO> getApprovedPostsByWorkspace(Long workspaceId);

    long countPostsByWorkspaceAndStatus(Long workspaceId, PostStatus status);

    PostResponseDTO updatePostV2(Long postId, PostUpdateDTO requestDto, MultipartFile[] files) throws Exception;
}
