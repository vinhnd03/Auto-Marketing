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

                // Chuyển đổi mức độ sáng tạo sang temperature
                double temperature = switch (request.getCreativityLevel()) {
                    case "conservative" -> 0.2;
                    case "balanced" -> 0.7;
                    case "creative" -> 1.0;
                    default -> 0.7;
                };

                // Chuyển đổi phong cách nội dung sang tone
                String tone = switch (request.getContentStyle()) {
                    case "friendly" -> "thân thiện, gần gũi, dễ hiểu";
                    case "professional" -> "chuyên nghiệp, trang trọng, uy tín";
                    case "creative" -> "sáng tạo, độc đáo, thu hút";
                    default -> "chuyên nghiệp, thân thiện";
                };

                // Tạo prompt để lưu lại và truyền cho AI
                String promptSentToAI = gptService.buildVietnameseTopicGenerationPrompt(
                        campaign,
                        request.getNumberOfTopics(),
                        request.getAdditionalInstructions(),
                        tone
                );

                // Gọi GPTService (truyền thêm temperature/tone nếu cần)
                String gptResponse = gptService.generateTopicsFromCampaign(
                        campaign,
                        request.getNumberOfTopics(),
                        request.getAdditionalInstructions(),
                        temperature,
                        tone
                ).get();

                List<Topic> topics = parseGPTResponseToTopics(gptResponse, campaign, promptSentToAI);
                List<Topic> savedTopics = topicRepository.saveAll(topics);

                log.info("✅ Successfully generated {} AI topics for campaign: {}", savedTopics.size(), campaign.getName());

                return savedTopics.stream()
                        .map(topic -> {
                            TopicResponseDTO dto = modelMapper.map(topic, TopicResponseDTO.class);
                            // Fix campaignId mapping
                            if (topic.getCampaign() != null) {
                                dto.setCampaignId(topic.getCampaign().getId());
                            }
                            return dto;
                        })
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
                .map(topic -> {
                    TopicResponseDTO dto = modelMapper.map(topic, TopicResponseDTO.class);
                    if (topic.getCampaign() != null) {
                        dto.setCampaignId(topic.getCampaign().getId());
                    }
                    return dto;
                })
                .toList();
    }

    @Override
    public List<TopicResponseDTO> getTopicsByCampaignAndStatus(Long campaignId, TopicStatus status) {
        return topicRepository.findByCampaignIdAndStatus(campaignId, status).stream()
                .map(topic -> {
                    TopicResponseDTO dto = modelMapper.map(topic, TopicResponseDTO.class);
                    if (topic.getCampaign() != null) {
                        dto.setCampaignId(topic.getCampaign().getId());
                    }
                    return dto;
                })
                .toList();
    }

    @Override
    public TopicResponseDTO approveTopic(Long topicId) {
        Topic topic = findById(topicId);
        topic.setStatus(TopicStatus.APPROVED);
        topic.setUpdatedAt(LocalDate.now());

        Topic savedTopic = topicRepository.save(topic);
        log.info("✅ Topic approved: {}", savedTopic.getName());

        TopicResponseDTO dto = modelMapper.map(savedTopic, TopicResponseDTO.class);
        if (savedTopic.getCampaign() != null) {
            dto.setCampaignId(savedTopic.getCampaign().getId());
        }
        return dto;
    }

    @Override
    public TopicResponseDTO rejectTopic(Long topicId) {
        Topic topic = findById(topicId);
        topic.setStatus(TopicStatus.REJECTED);
        topic.setUpdatedAt(LocalDate.now());

        Topic savedTopic = topicRepository.save(topic);
        log.info("❌ Topic rejected: {}", savedTopic.getName());

        TopicResponseDTO dto = modelMapper.map(savedTopic, TopicResponseDTO.class);
        if (savedTopic.getCampaign() != null) {
            dto.setCampaignId(savedTopic.getCampaign().getId());
        }
        return dto;
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

    @Override
    public void deleteById(Long topicId) {
        topicRepository.deleteById(topicId);
    }

    @Override
    public void deleteAll() {
        topicRepository.deleteAll();
    }

    // Hàm này truyền thêm promptSentToAI để set aiPrompt cho từng topic
    private List<Topic> parseGPTResponseToTopics(String gptResponse, Campaign campaign, String promptSentToAI) {
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
                    topic.setAiPrompt(promptSentToAI); // fix: set prompt
                    topic.setCreatedAt(LocalDate.now());
                    topic.setUpdatedAt(LocalDate.now());
                    topic.setCampaign(campaign);

                    topics.add(topic);
                }
            }

        } catch (JsonProcessingException e) {
            log.warn("Failed to parse JSON, trying manual parsing: {}", e.getMessage());
            topics = parseGPTResponseManually(gptResponse, campaign, promptSentToAI);
        }

        return topics;
    }

    // Sửa luôn hàm thủ công để set aiPrompt/campaign
    private List<Topic> parseGPTResponseManually(String response, Campaign campaign, String promptSentToAI) {
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
                currentTopic.setAiPrompt(promptSentToAI); // fix: set prompt
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