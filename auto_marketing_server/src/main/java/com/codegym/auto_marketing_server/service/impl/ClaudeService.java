package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTResponseDTO;
import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.entity.Topic;
import com.codegym.auto_marketing_server.service.IClaudeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class ClaudeService implements IClaudeService {

    @Override
    public CompletableFuture<String> generateTopicsFromCampaign(Campaign campaign, Integer numberOfTopics, String additionalInstructions, double temperature, String tone) {
        log.warn("[ClaudeService] Model Claude đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Claude model đang phát triển.");
    }

    @Override
    public CompletableFuture<String> generateContentFromTopic(Topic topic, String tone, String contentType, String additionalInstructions, Boolean includeHashtag, Boolean includeCallToAction) {
        log.warn("[ClaudeService] Model Claude đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Claude model đang phát triển.");
    }

    @Override
    public CompletableFuture<String> generateLongFormContent(Topic topic, ContentGenerationRequestDTO request, String aiModel) {
        log.warn("[ClaudeService] Model Claude đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Claude model đang phát triển.");
    }

    @Override
    public CompletableFuture<String> generateImagePromptFromContent(String content) {
        log.warn("[ClaudeService] Model Claude đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture("Claude model đang phát triển.");
    }

    @Override
    public CompletableFuture<GPTResponseDTO> callClaudeAPI(GPTRequestDTO request) {
        log.warn("[ClaudeService] Model Claude đang phát triển. Chưa hỗ trợ.");
        return CompletableFuture.completedFuture(null);
    }
}