package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTResponseDTO;
import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.entity.Topic;
import com.codegym.auto_marketing_server.service.ILlamaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class LlamaService implements ILlamaService {

    @Override
    public CompletableFuture<String> generateTopicsFromCampaign(Campaign campaign, Integer numberOfTopics, String additionalInstructions, double temperature, String tone) {
        log.warn("[LlamaService] Model Llama đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Llama model đang phát triển.");
    }

    @Override
    public CompletableFuture<String> generateContentFromTopic(Topic topic, String tone, String contentType, String additionalInstructions, Boolean includeHashtag, Boolean includeCallToAction) {
        log.warn("[LlamaService] Model Llama đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Llama model đang phát triển.");
    }

    @Override
    public CompletableFuture<String> generateLongFormContent(Topic topic, ContentGenerationRequestDTO request, String aiModel) {
        log.warn("[LlamaService] Model Llama đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Llama model đang phát triển.");
    }

    @Override
    public CompletableFuture<String> generateImagePromptFromContent(String content) {
        log.warn("[LlamaService] Model Llama đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Llama model đang phát triển.");
    }

    @Override
    public CompletableFuture<GPTResponseDTO> callLlamaAPI(GPTRequestDTO request) {
        log.warn("[LlamaService] Model Llama đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture(null);
    }
}