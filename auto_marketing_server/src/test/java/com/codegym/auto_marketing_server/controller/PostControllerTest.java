package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.PostResponseDTO;
import com.codegym.auto_marketing_server.enums.PostStatus;
import com.codegym.auto_marketing_server.service.IPostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PostControllerTest {

    @Mock
    private IPostService postService;

    @InjectMocks
    private PostController postController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void generateContent_shouldReturnOk() {
        ContentGenerationRequestDTO request = new ContentGenerationRequestDTO();
        List<PostResponseDTO> mockPosts = Arrays.asList(new PostResponseDTO(), new PostResponseDTO());

        when(postService.generateContentWithAI(request)).thenReturn(CompletableFuture.completedFuture(mockPosts));

        ResponseEntity<List<PostResponseDTO>> response = postController.generateContent(request).join();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(postService).generateContentWithAI(request);
    }

    @Test
    void getPostsByTopic_shouldReturnOk() {
        List<PostResponseDTO> mockPosts = Arrays.asList(new PostResponseDTO(), new PostResponseDTO());
        when(postService.getPostsByTopic(123L)).thenReturn(mockPosts);

        ResponseEntity<List<PostResponseDTO>> response = postController.getPostsByTopic(123L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(postService).getPostsByTopic(123L);
    }

    @Test
    void getPostsByTopicAndStatus_shouldReturnOk() {
        List<PostResponseDTO> mockPosts = Arrays.asList(new PostResponseDTO());
        when(postService.getPostsByTopicAndStatus(123L, PostStatus.DRAFT)).thenReturn(mockPosts);

        ResponseEntity<List<PostResponseDTO>> response = postController.getPostsByTopicAndStatus(123L, PostStatus.DRAFT);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        verify(postService).getPostsByTopicAndStatus(123L, PostStatus.DRAFT);
    }

    @Test
    void updatePostStatus_shouldReturnOk() {
        PostResponseDTO post = new PostResponseDTO();
        when(postService.updatePostStatus(99L, PostStatus.PUBLISHED)).thenReturn(post);

        ResponseEntity<PostResponseDTO> response = postController.updatePostStatus(99L, PostStatus.PUBLISHED);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(post, response.getBody());
        verify(postService).updatePostStatus(99L, PostStatus.PUBLISHED);
    }
}