package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.TopicGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.TopicResponseDTO;
import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.entity.Topic;
import com.codegym.auto_marketing_server.enums.TopicStatus;
import com.codegym.auto_marketing_server.repository.ICampaignRepository;
import com.codegym.auto_marketing_server.repository.ITopicRepository;
import com.codegym.auto_marketing_server.service.ITopicService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
@RequiredArgsConstructor
public class TopicService implements ITopicService {

    private final ITopicRepository topicRepository;
    private final ICampaignRepository campaignRepository;
    private final GPTService gptService;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    @Override
    public CompletableFuture<List<TopicResponseDTO>> generateTopicsWithAI(TopicGenerationRequestDTO request) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("🎯 Starting AI topic generation for campaign ID: {}", request.getCampaignId());

                Campaign campaign = campaignRepository.findById(request.getCampaignId())
                        .orElseThrow(() -> new RuntimeException("Campaign not found: " + request.getCampaignId()));

                String gptResponse = gptService.generateTopicsFromCampaign(
                        campaign,
                        request.getNumberOfTopics(),
                        request.getAdditionalInstructions()
                ).get();

                List<Topic> topics = parseGPTResponseToTopics(gptResponse, campaign);
                List<Topic> savedTopics = topicRepository.saveAll(topics);

                log.info("✅ Successfully generated {} AI topics for campaign: {}",
                        savedTopics.size(), campaign.getName());

                return savedTopics.stream()
                        .map(topic -> modelMapper.map(topic, TopicResponseDTO.class))
                        .toList();

            } catch (Exception e) {
                log.error("❌ Error generating AI topics: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to generate AI topics: " + e.getMessage(), e);
            }
        });
    }

    @Override
    public List<TopicResponseDTO> getTopicsByCampaign(Long campaignId) {
        return topicRepository.findByCampaignId(campaignId).stream()
                .map(topic -> modelMapper.map(topic, TopicResponseDTO.class))
                .toList();
    }

    @Override
    public List<TopicResponseDTO> getTopicsByCampaignAndStatus(Long campaignId, TopicStatus status) {
        return topicRepository.findByCampaignIdAndStatus(campaignId, status).stream()
                .map(topic -> modelMapper.map(topic, TopicResponseDTO.class))
                .toList();
    }

    @Override
    public TopicResponseDTO approveTopic(Long topicId) {
        Topic topic = findById(topicId);
        topic.setStatus(TopicStatus.APPROVED);
        topic.setUpdatedAt(LocalDate.now());

        Topic savedTopic = topicRepository.save(topic);
        log.info("✅ Topic approved: {}", savedTopic.getName());

        return modelMapper.map(savedTopic, TopicResponseDTO.class);
    }

    @Override
    public TopicResponseDTO rejectTopic(Long topicId) {
        Topic topic = findById(topicId);
        topic.setStatus(TopicStatus.REJECTED);
        topic.setUpdatedAt(LocalDate.now());

        Topic savedTopic = topicRepository.save(topic);
        log.info("❌ Topic rejected: {}", savedTopic.getName());

        return modelMapper.map(savedTopic, TopicResponseDTO.class);
    }

    @Override
    public Topic findById(Long topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicId));
    }

    @Override
    public Topic save(Topic topic) {
        return topicRepository.save(topic);
    }

    private List<Topic> parseGPTResponseToTopics(String gptResponse, Campaign campaign) {
        List<Topic> topics = new ArrayList<>();

        try {
            JsonNode jsonNode = objectMapper.readTree(gptResponse);
            JsonNode topicsArray = jsonNode.get("topics");

            if (topicsArray != null && topicsArray.isArray()) {
                for (JsonNode topicNode : topicsArray) {
                    Topic topic = new Topic();
                    topic.setName(topicNode.get("name").asText());
                    topic.setDescription(topicNode.get("description").asText());
                    topic.setStatus(TopicStatus.PENDING);
                    topic.setGeneratedByAI(true);
                    topic.setCreatedAt(LocalDate.now());
                    topic.setUpdatedAt(LocalDate.now());
                    topic.setCampaign(campaign);

                    topics.add(topic);
                }
            }

        } catch (JsonProcessingException e) {
            log.warn("Failed to parse JSON, trying manual parsing: {}", e.getMessage());
            topics = parseGPTResponseManually(gptResponse, campaign);
        }

        return topics;
    }

    private List<Topic> parseGPTResponseManually(String response, Campaign campaign) {
        List<Topic> topics = new ArrayList<>();

        String[] lines = response.split("\n");
        Topic currentTopic = null;

        for (String line : lines) {
            line = line.trim();

            if (line.startsWith("**") && line.endsWith("**")) {
                if (currentTopic != null) {
                    topics.add(currentTopic);
                }

                currentTopic = new Topic();
                currentTopic.setName(line.replaceAll("\\*", "").trim());
                currentTopic.setStatus(TopicStatus.PENDING);
                currentTopic.setGeneratedByAI(true);
                currentTopic.setCreatedAt(LocalDate.now());
                currentTopic.setUpdatedAt(LocalDate.now());
                currentTopic.setCampaign(campaign);

            } else if (currentTopic != null && !line.isEmpty() && !line.startsWith("---")) {
                currentTopic.setDescription(line);
            }
        }

        if (currentTopic != null) {
            topics.add(currentTopic);
        }

        return topics;
    }
}
