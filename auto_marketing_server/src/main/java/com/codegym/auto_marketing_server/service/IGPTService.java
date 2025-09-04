package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTResponseDTO;
import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.entity.Topic;

import java.util.concurrent.CompletableFuture;

public interface IGPTService {
    CompletableFuture<String> generateTopicsFromCampaign(Campaign campaign,
                                                         Integer numberOfTopics,
                                                         String additionalInstructions,
                                                         double temperature,
                                                         String tone);

    CompletableFuture<String> generateContentFromTopic(Topic topic,
                                                       String tone,
                                                       String contentType,
                                                       String additionalInstructions,
                                                       Boolean includeHashtag,
                                                       Boolean includeCallToAction);

    CompletableFuture<String> generateLongFormContent(Topic topic, ContentGenerationRequestDTO request, String aiModel);

    CompletableFuture<String> generateImagePromptFromContent(String content);

    CompletableFuture<GPTResponseDTO> callGPTAPI(GPTRequestDTO request);
}
