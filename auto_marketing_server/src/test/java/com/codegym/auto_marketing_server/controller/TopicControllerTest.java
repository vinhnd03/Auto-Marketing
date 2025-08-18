package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.TopicGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.TopicResponseDTO;
import com.codegym.auto_marketing_server.enums.TopicStatus;
import com.codegym.auto_marketing_server.service.ITopicService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TopicController.class)
@AutoConfigureMockMvc
public class TopicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ITopicService topicService;

    @Test
    public void testGenerateTopics_success() throws Exception {
        TopicResponseDTO topic = new TopicResponseDTO();
        topic.setId(10L);
        topic.setName("AI Topic");
        topic.setDescription("Desc");
        topic.setGeneratedByAI(true);
        topic.setAiPrompt("Prompt");
        topic.setStatus(TopicStatus.PENDING);
        topic.setCreatedAt(LocalDate.now());
        topic.setUpdatedAt(LocalDate.now());
        topic.setCampaignId(1L);

        when(topicService.generateTopicsWithAI(any(TopicGenerationRequestDTO.class)))
                .thenReturn(CompletableFuture.completedFuture(List.of(topic)));

        TopicGenerationRequestDTO requestDTO = new TopicGenerationRequestDTO();
        requestDTO.setNumberOfTopics(1);
        requestDTO.setCampaignId(1L);

        String jsonRequest = objectMapper.writeValueAsString(requestDTO);

        var mvcResult = mockMvc.perform(post("/api/v1/topics/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(request().asyncStarted())
                .andReturn();

        mockMvc.perform(asyncDispatch(mvcResult))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10L))
                .andExpect(jsonPath("$[0].name").value("AI Topic"))
                .andExpect(jsonPath("$[0].campaignId").value(1L));
    }
}