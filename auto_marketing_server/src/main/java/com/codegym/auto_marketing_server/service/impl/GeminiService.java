package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTResponseDTO;
import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.entity.Topic;
import com.codegym.auto_marketing_server.service.IGeminiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class GeminiService implements IGeminiService {

    @Override
    public CompletableFuture<String> generateTopicsFromCampaign(Campaign campaign, Integer numberOfTopics, String additionalInstructions, double temperature, String tone) {
        log.warn("[GeminiService] Model Gemini đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Gemini model đang phát triển.");
    }

    @Override
    public CompletableFuture<String> generateContentFromTopic(Topic topic, String tone, String contentType, String additionalInstructions, Boolean includeHashtag, Boolean includeCallToAction) {
        log.warn("[GeminiService] Model Gemini đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Gemini model đang phát triển.");
    }

    @Override
    public CompletableFuture<String> generateLongFormContent(Topic topic, ContentGenerationRequestDTO request, String aiModel) {
        log.warn("[GeminiService] Model Gemini đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Gemini model đang phát triển.");
    }

    @Override
    public CompletableFuture<String> generateImagePromptFromContent(String content) {
        log.warn("[GeminiService] Model Gemini đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Gemini model đang phát triển.");
    }

    @Override
    public CompletableFuture<GPTResponseDTO> callGeminiAPI(GPTRequestDTO request) {
        log.warn("[GeminiService] Model Gemini đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture(null);
    }
}