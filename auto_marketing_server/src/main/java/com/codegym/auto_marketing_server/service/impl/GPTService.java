package com.codegym.auto_marketing_server.service.impl;


import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTMessage;
import com.codegym.auto_marketing_server.dto.GPTRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTResponseDTO;
import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.entity.Topic;
import com.codegym.auto_marketing_server.exception.GPTServiceException;
import com.codegym.auto_marketing_server.service.IGPTService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.concurrent.CompletableFuture;


@Service
@Slf4j
@ConditionalOnProperty(name = "app.gpt.mock.enabled", havingValue = "false")
public class GPTService implements IGPTService {

    private static final String GPT_MODEL = "gpt-3.5-turbo";
    private static final String SYSTEM_ROLE = "system";
    private static final String USER_ROLE = "user";
    private static final String DEFAULT_SOCIAL_POST = "bài đăng mạng xã hội";
    private static final String DESCRIPTION_PREFIX = "• Mô tả: ";

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.api.url}")
    private String openaiApiUrl;

    private final RestTemplate restTemplate;

    public GPTService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public CompletableFuture<String> generateTopicsFromCampaign(Campaign campaign, Integer numberOfTopics, String additionalInstructions) {
        try {
            log.info("🇻🇳 Generating {} Vietnamese topics for campaign '{}'", numberOfTopics, campaign.getName());

            String prompt = buildVietnameseTopicGenerationPrompt(campaign, numberOfTopics, additionalInstructions);

            GPTRequestDTO requestDTO = new GPTRequestDTO();
            requestDTO.setModel(GPT_MODEL);
            requestDTO.setMax_tokens(1500);
            requestDTO.setTemperature(0.7);
            requestDTO.setMessages(Arrays.asList(new GPTMessage(SYSTEM_ROLE, "Bạn là một chuyên gia marketing người Việt Nam với 10 năm kinh nghiệm. " + "Bạn hiểu rõ thị trường Việt Nam, văn hóa, ngôn ngữ và hành vi tiêu dùng. " + "Hãy tạo các chủ đề marketing bằng tiếng Việt thuần túy, phù hợp với người Việt. " + "QUAN TRỌNG: Chỉ trả lời bằng tiếng Việt, không dùng tiếng Anh."), new GPTMessage(USER_ROLE, prompt)));

            GPTResponseDTO responseDTO = callGPTAPI(requestDTO).get();
            String content = responseDTO.getChoices().get(0).getMessage().getContent();

            log.info("Successfully generated Vietnamese topics");
            log.debug("Generated content: {}", content);

            return CompletableFuture.completedFuture(content);

        } catch (Exception e) {
            log.error("Error generating Vietnamese topics: {}", e.getMessage(), e);
            throw new GPTServiceException("Không thể tạo ra các chủ đề tiếng Việt", e);
        }
    }

    @Override
    public CompletableFuture<String> generateContentFromTopic(Topic topic, String tone, String contentType, String additionalInstructions) {
        try {
            log.info("🇻🇳 Generating Vietnamese {} content for topic '{}'", contentType, topic.getName());

            String prompt = buildVietnameseContentGenerationPrompt(topic, tone, contentType, additionalInstructions);

            GPTRequestDTO requestDTO = new GPTRequestDTO();
            requestDTO.setModel(GPT_MODEL);
            requestDTO.setMax_tokens(1200);
            requestDTO.setTemperature(0.8);
            requestDTO.setMessages(Arrays.asList(new GPTMessage(SYSTEM_ROLE, "Bạn là một copywriter chuyên nghiệp người Việt Nam, chuyên tạo nội dung marketing tiếng Việt. " + "Bạn viết theo phong cách người Việt, sử dụng từ ngữ thân thiện, dễ hiểu. " + "QUAN TRỌNG: Chỉ viết bằng tiếng Việt, không dùng tiếng Anh trừ khi cần thiết cho hashtag."), new GPTMessage(USER_ROLE, prompt)));

            GPTResponseDTO responseDTO = callGPTAPI(requestDTO).get();
            String content = responseDTO.getChoices().get(0).getMessage().getContent();

            log.info("Successfully generated Vietnamese content");
            return CompletableFuture.completedFuture(content);

        } catch (Exception e) {
            log.error("Error generating Vietnamese content: {}", e.getMessage(), e);
            throw new GPTServiceException("Không thể tạo nội dung tiếng Việt", e);
        }
    }

    @Override
    public CompletableFuture<String> generateLongFormContent(Topic topic, ContentGenerationRequestDTO request) {
        try {
            log.info("🇻🇳 Generating long-form {} content ({} words) for topic '{}'", request.getContentType(), request.getTargetWordCount(), topic.getName());

            String prompt = buildLongFormContentPrompt(topic, request);

            GPTRequestDTO requestDTO = new GPTRequestDTO();
            requestDTO.setModel(GPT_MODEL);
            requestDTO.setMax_tokens(calculateTokensForWordCount(request.getTargetWordCount()));
            requestDTO.setTemperature(0.7);
            requestDTO.setMessages(Arrays.asList(new GPTMessage(SYSTEM_ROLE, buildLongFormSystemPrompt()), new GPTMessage(USER_ROLE, prompt)));

            GPTResponseDTO responseDTO = callGPTAPI(requestDTO).get();
            String content = responseDTO.getChoices().get(0).getMessage().getContent();

            log.info("Successfully generated long-form Vietnamese content ({} words estimated)", request.getTargetWordCount());

            return CompletableFuture.completedFuture(content);

        } catch (Exception e) {
            log.error("Error generating long-form Vietnamese content: {}", e.getMessage(), e);
            throw new GPTServiceException("Không thể tạo nội dung dài tiếng Việt", e);
        }
    }

    @Override
    public CompletableFuture<String> generateImagePromptFromContent(String content) {
        try {
            log.info("🇻🇳 Generating image prompt for Vietnamese content");

            String prompt = String.format("Tạo một prompt chi tiết bằng TIẾNG ANH để generate hình ảnh minh họa cho nội dung marketing tiếng Việt sau:\\n\\n" + "NỘI DUNG: %s\\n\\n" + "YÊU CẦU CHO PROMPT:\\n" + "- Mô tả hình ảnh bằng tiếng Anh chuyên nghiệp\\n" + "- Phong cách hiện đại, phù hợp với thị trường Việt Nam\\n" + "- Màu sắc: xanh dương (#1976d2), trắng, xám nhẹ\\n" + "- Composition cho social media (16:9 hoặc 1:1)\\n" + "- Professional, clean, modern style\\n" + "- Avoid text in image\\n\\n" + "CHỈ TRẢ VỀ PROMPT TIẾNG ANH, KHÔNG GIẢI THÍCH THÊM:", content);

            GPTRequestDTO requestDTO = new GPTRequestDTO();
            requestDTO.setModel(GPT_MODEL);
            requestDTO.setMax_tokens(300);
            requestDTO.setTemperature(0.6);
            requestDTO.setMessages(Arrays.asList(new GPTMessage(SYSTEM_ROLE, "Bạn là chuyên gia tạo prompt cho AI image generation. " + "Hãy tạo prompt tiếng Anh ngắn gọn, chính xác cho DALL-E hoặc Midjourney."), new GPTMessage(USER_ROLE, prompt)));

            GPTResponseDTO responseDTO = callGPTAPI(requestDTO).get();
            String imagePrompt = responseDTO.getChoices().get(0).getMessage().getContent();

            log.info("Successfully generated image prompt");
            return CompletableFuture.completedFuture(imagePrompt);

        } catch (Exception e) {
            log.error("Error generating image prompt: {}", e.getMessage(), e);
            throw new GPTServiceException("Không thể tạo image prompt", e);
        }
    }

    @Override
    public CompletableFuture<GPTResponseDTO> callGPTAPI(GPTRequestDTO request) {
        try {
            log.debug("Calling OpenAI API with model: {}", request.getModel());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            HttpEntity<GPTRequestDTO> entity = new HttpEntity<>(request, headers);
            ResponseEntity<GPTResponseDTO> response = restTemplate.postForEntity(openaiApiUrl, entity, GPTResponseDTO.class);

            GPTResponseDTO responseBody = response.getBody();
            if (responseBody != null && responseBody.getUsage() != null) {
                log.info("Token usage: {} total tokens", responseBody.getUsage().getTotalTokens());
            }

            return CompletableFuture.completedFuture(responseBody);

        } catch (Exception e) {
            log.error("OpenAI API call failed: {}", e.getMessage(), e);
            throw new GPTServiceException("Không thể gọi OpenAI API", e);
        }
    }

    private String buildLongFormSystemPrompt() {
        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append("Bạn là một chuyên gia viết nội dung marketing người Việt Nam với 15 năm kinh nghiệm. ");
        systemPrompt.append("Bạn chuyên viết các bài viết dài, chi tiết và có chiều sâu cho thị trường Việt Nam. ");
        systemPrompt.append("QUAN TRỌNG: Chỉ viết bằng tiếng Việt thuần túy, tự nhiên như người Việt. Phong cách viết của bạn tự nhiên, chuyên nghiệp và phù hợp với văn hóa Việt.");
        return systemPrompt.toString();
    }

    private String buildLongFormContentPrompt(Topic topic, ContentGenerationRequestDTO request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("NHIỆM VỤ: Viết bài ").append(mapContentTypeToVietnamese(request.getContentType()));
        prompt.append(" dài và chi tiết bằng TIẾNG VIỆT\n\n");
        prompt.append("THÔNG TIN CHỦ ĐỀ:\n");
        prompt.append("• Chủ đề: ").append(topic.getName()).append("\n");
        prompt.append(DESCRIPTION_PREFIX).append(topic.getDescription()).append("\n\n");

        if (request.getTargetWordCount() != null) {
            prompt.append("• Độ dài mục tiêu: ").append(request.getTargetWordCount()).append(" từ\n");
        }

        return prompt.toString();
    }

    private Integer calculateTokensForWordCount(Integer wordCount) {
        if (wordCount == null) return 1500;
        return Math.min(4000, (int) (wordCount * 1.5) + 500);
    }

    private String buildVietnameseTopicGenerationPrompt(Campaign campaign, Integer numberOfTopics, String additionalInstruction) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("NHIỆM VỤ: Tạo ").append(numberOfTopics).append(" chủ đề marketing bằng TIẾNG VIỆT\n\n");
        prompt.append("THÔNG TIN CHIẾN DỊCH:\n");
        prompt.append("• Tên chiến dịch: ").append(campaign.getName()).append("\n");
        prompt.append(DESCRIPTION_PREFIX).append(campaign.getDescription()).append("\n\n");

        if (additionalInstruction != null && !additionalInstruction.trim().isEmpty()) {
            prompt.append("YÊU CẦU ĐẶC BIỆT: ").append(additionalInstruction).append("\n\n");
        }

        prompt.append("ĐỊNH DẠNG TRẢ VỀ JSON:\n");
        prompt.append("{\n");
        prompt.append("  \"topics\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"name\": \"Tên chủ đề tiếng Việt\",\n");
        prompt.append("      \"description\": \"Mô tả chi tiết bằng tiếng Việt\"\n");
        prompt.append("    }\n");
        prompt.append("  ]\n");
        prompt.append("}\n");

        return prompt.toString();
    }

    private String buildVietnameseContentGenerationPrompt(Topic topic, String tone, String contentType, String additionalInstructions) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("NHIỆM VỤ: Tạo nội dung ").append(mapContentTypeToVietnamese(contentType)).append(" bằng TIẾNG VIỆT\n\n");
        prompt.append("THÔNG TIN CHỦ ĐỀ:\n");
        prompt.append("• Chủ đề: ").append(topic.getName()).append("\n");
        prompt.append(DESCRIPTION_PREFIX).append(topic.getDescription()).append("\n");
        prompt.append("• Tone: ").append(mapToneToVietnamese(tone)).append("\n\n");

        if (additionalInstructions != null && !additionalInstructions.trim().isEmpty()) {
            prompt.append("YÊU CẦU ĐẶC BIỆT: ").append(additionalInstructions).append("\n\n");
        }
        prompt.append("• BẮT BUỘC: Kết thúc bài viết bằng ít nhất 3 hashtag, mỗi hashtag một dòng, bắt đầu bằng ký tự #. Không bỏ qua phần hashtag.\n");
        prompt.append("YÊU CẦU: Viết hoàn toàn bằng tiếng Việt, tự nhiên và hấp dẫn\n");
        return prompt.toString();
    }

    private String mapToneToVietnamese(String tone) {
        if (tone == null) return "chuyên nghiệp và thân thiện";
        return switch (tone.toLowerCase()) {
            case "professional" -> "chuyên nghiệp và uy tín";
            case "casual" -> "thân thiện và gần gũi";
            case "enthusiastic" -> "hào hứng và năng động";
            case "informative" -> "hữu ích và giáo dục";
            case "promotional" -> "khuyến mãi và hấp dẫn";
            case "inspirational" -> "truyền cảm hứng và tích cực";
            default -> "chuyên nghiệp và thân thiện";
        };
    }

    private String mapContentTypeToVietnamese(String contentType) {
        if (contentType == null) return DEFAULT_SOCIAL_POST;
        return switch (contentType.toLowerCase()) {
            case "social_post" -> DEFAULT_SOCIAL_POST;
            case "article" -> "bài viết chi tiết";
            case "long_article" -> "bài viết dài chuyên sâu";
            case "blog_post" -> "blog post chi tiết";
            case "detailed_guide" -> "hướng dẫn chi tiết";
            case "white_paper" -> "báo cáo chuyên môn";
            case "case_study" -> "nghiên cứu tình huống";
            case "promotion" -> "nội dung khuyến mãi";
            case "story" -> "story/reel ngắn";
            case "email" -> "email marketing";
            default -> DEFAULT_SOCIAL_POST;
        };
    }

    /**
     * Tách các hashtag từ nội dung AI trả về. Chỉ lấy các dòng cuối bắt đầu bằng '#'.
     */
    private String extractHashtags(String content) {
        if (content == null || content.isEmpty()) return "";
        String[] lines = content.split("\n");
        StringBuilder hashtags = new StringBuilder();
        for (int i = lines.length - 1; i >= 0; i--) {
            String line = lines[i].trim();
            if (line.startsWith("#")) {
                hashtags.insert(0, line + "\n");
            } else if (!line.isEmpty()) {
                // Nếu gặp dòng không phải hashtag, dừng lại (chỉ lấy các hashtag cuối cùng)
                break;
            }
        }
        return hashtags.toString().trim();
    }
}

