package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.TopicGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.TopicResponseDTO;
import com.codegym.auto_marketing_server.entity.Topic;
import com.codegym.auto_marketing_server.enums.TopicStatus;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface ITopicService {
    CompletableFuture<List<TopicResponseDTO>> generateTopicsWithAI(TopicGenerationRequestDTO request);

    List<TopicResponseDTO> getTopicsByCampaign(Long campaignId);

    List<TopicResponseDTO> getTopicsByCampaignAndStatus(Long campaignId, TopicStatus status);

    TopicResponseDTO approveTopic(Long topicId);

    TopicResponseDTO rejectTopic(Long topicId);

    Topic findById(Long topicId);

    Topic save(Topic topic);

    void deleteById(Long topicId);

    void deleteAll();

    void deleteByCampaignAndStatus(Long campaignId, TopicStatus status);
}
