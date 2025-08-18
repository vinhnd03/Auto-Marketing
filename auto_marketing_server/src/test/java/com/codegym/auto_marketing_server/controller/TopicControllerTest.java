package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.TopicGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.TopicResponseDTO;
import com.codegym.auto_marketing_server.enums.TopicStatus;
import com.codegym.auto_marketing_server.service.ITopicService;
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
import static org.mockito.Mockito.*;

class TopicControllerTest {

    @Mock
    private ITopicService topicService;

    @InjectMocks
    private TopicController topicController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void generateTopics_shouldReturnOk() {
        TopicGenerationRequestDTO request = new TopicGenerationRequestDTO();
        List<TopicResponseDTO> mockTopics = Arrays.asList(new TopicResponseDTO(), new TopicResponseDTO());

        when(topicService.generateTopicsWithAI(request)).thenReturn(CompletableFuture.completedFuture(mockTopics));

        ResponseEntity<List<TopicResponseDTO>> response = topicController.generateTopics(request).join();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(topicService).generateTopicsWithAI(request);
    }

    @Test
    void getTopicsByCampaign_shouldReturnOk() {
        List<TopicResponseDTO> mockTopics = Arrays.asList(new TopicResponseDTO());
        when(topicService.getTopicsByCampaign(88L)).thenReturn(mockTopics);

        ResponseEntity<List<TopicResponseDTO>> response = topicController.getTopicsByCampaign(88L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        verify(topicService).getTopicsByCampaign(88L);
    }

    @Test
    void getTopicsByCampaignAndStatus_shouldReturnOk() {
        List<TopicResponseDTO> mockTopics = Arrays.asList(new TopicResponseDTO());
        when(topicService.getTopicsByCampaignAndStatus(88L, TopicStatus.PENDING)).thenReturn(mockTopics);

        ResponseEntity<List<TopicResponseDTO>> response = topicController.getTopicsByCampaignAndStatus(88L, TopicStatus.PENDING);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        verify(topicService).getTopicsByCampaignAndStatus(88L, TopicStatus.PENDING);
    }

    @Test
    void approveTopic_shouldReturnOk() {
        TopicResponseDTO topic = new TopicResponseDTO();
        when(topicService.approveTopic(77L)).thenReturn(topic);

        ResponseEntity<TopicResponseDTO> response = topicController.approveTopic(77L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(topic, response.getBody());
        verify(topicService).approveTopic(77L);
    }

    @Test
    void rejectTopic_shouldReturnOk() {
        TopicResponseDTO topic = new TopicResponseDTO();
        when(topicService.rejectTopic(77L)).thenReturn(topic);

        ResponseEntity<TopicResponseDTO> response = topicController.rejectTopic(77L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(topic, response.getBody());
        verify(topicService).rejectTopic(77L);
    }

    @Test
    void deleteTopic_shouldReturnOk() {
        doNothing().when(topicService).deleteById(77L);

        ResponseEntity<Void> response = topicController.deleteTopic(77L);

        assertEquals(200, response.getStatusCodeValue());
        verify(topicService).deleteById(77L);
    }

    @Test
    void deleteAllTopics_shouldReturnOk() {
        doNothing().when(topicService).deleteAll();

        ResponseEntity<Void> response = topicController.deleteAllTopics();

        assertEquals(200, response.getStatusCodeValue());
        verify(topicService).deleteAll();
    }

    @Test
    void deleteTopicsByCampaignAndStatus_shouldReturnOk() {
        doNothing().when(topicService).deleteByCampaignAndStatus(88L, TopicStatus.PENDING);

        ResponseEntity<Void> response = topicController.deleteTopicsByCampaignAndStatus(88L, TopicStatus.PENDING);

        assertEquals(200, response.getStatusCodeValue());
        verify(topicService).deleteByCampaignAndStatus(88L, TopicStatus.PENDING);
    }
}