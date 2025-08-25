package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.PostFilterDTO;
import com.codegym.auto_marketing_server.dto.PostResponseDTO;
import com.codegym.auto_marketing_server.entity.Post;
import com.codegym.auto_marketing_server.enums.PostStatus;

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

    List<PostFilterDTO> getPostsByFilters(Long workspaceId, Long campaignId, Long topicId);
}
