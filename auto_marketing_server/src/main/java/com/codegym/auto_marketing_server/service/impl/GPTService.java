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
            requestDTO.setMessages(Arrays.asList(new GPTMessage(SYSTEM_ROLE, buildLongFormSystemPrompt(request)), new GPTMessage(USER_ROLE, prompt)));

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

    private String buildLongFormSystemPrompt(ContentGenerationRequestDTO request) {
        StringBuilder systemPrompt = new StringBuilder();

        systemPrompt.append("Bạn là một chuyên gia viết nội dung marketing người Việt Nam với 15 năm kinh nghiệm. ");
        systemPrompt.append("Bạn chuyên viết các bài viết dài, chi tiết và có chiều sâu cho thị trường Việt Nam. ");
        systemPrompt.append("Phong cách viết của bạn tự nhiên, chuyên nghiệp và phù hợp với văn hóa Việt. ");

        if (request.getContentType() != null) {
            switch (request.getContentType()) {
                case "long_article" ->
                        systemPrompt.append("Hãy viết như một nhà báo chuyên nghiệp về kinh doanh và công nghệ. ");
                case "blog_post" -> systemPrompt.append("Hãy viết như một blogger có ảnh hưởng trong ngành. ");
                case "detailed_guide" ->
                        systemPrompt.append("Hãy viết như một chuyên gia tư vấn với kinh nghiệm thực tế. ");
                case "white_paper" ->
                        systemPrompt.append("Hãy viết như một nghiên cứu viên với phong cách học thuật nhưng dễ hiểu. ");
                case "case_study" ->
                        systemPrompt.append("Hãy viết như một nhà phân tích kinh doanh với dữ liệu cụ thể. ");
                default -> systemPrompt.append("Hãy viết với phong cách phù hợp với loại nội dung được yêu cầu. ");
            }
        }

        systemPrompt.append("QUAN TRỌNG: Chỉ viết bằng tiếng Việt thuần túy, tự nhiên như người Việt. ");

        return systemPrompt.toString();
    }

    private String buildLongFormContentPrompt(Topic topic, ContentGenerationRequestDTO request) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("NHIỆM VỤ: Viết bài ").append(mapContentTypeToVietnamese(request.getContentType()));
        prompt.append(" dài và chi tiết bằng TIẾNG VIỆT\n\n");

        prompt.append("THÔNG TIN CHỦ ĐỀ:\n");
        prompt.append("• Chủ đề: ").append(topic.getName()).append("\n");
        prompt.append("• Mô tả: ").append(topic.getDescription()).append("\n\n");

        if (request.getTargetWordCount() != null) {
            prompt.append("YÊU CẦU ĐỘ DÀI:\n");
            prompt.append("• Độ dài mục tiêu: ").append(request.getTargetWordCount()).append(" từ (±10%)\n");
            prompt.append("• Đây là bài viết dài, cần nội dung chuyên sâu và chi tiết\n\n");
        }

        prompt.append("YÊU CẦU NỘI DUNG:\n");
        prompt.append("• Tone: ").append(mapToneToVietnamese(request.getTone())).append("\n");
        prompt.append("• Loại nội dung: ").append(mapContentTypeToVietnamese(request.getContentType())).append("\n");

        if (Boolean.TRUE.equals(request.getIncludeSections())) {
            prompt.append("• Chia thành các phần rõ ràng với tiêu đề phụ\n");
        }
        if (Boolean.TRUE.equals(request.getIncludeIntroConclusion())) {
            prompt.append("• Bao gồm phần mở đầu và kết luận chi tiết\n");
        }
        if (Boolean.TRUE.equals(request.getIncludeBulletPoints())) {
            prompt.append("• Sử dụng bullet points và danh sách có cấu trúc\n");
        }
        if (Boolean.TRUE.equals(request.getIncludeStatistics())) {
            prompt.append("• Bao gồm số liệu và thống kê thuyết phục\n");
        }
        if (Boolean.TRUE.equals(request.getIncludeCaseStudies())) {
            prompt.append("• Bao gồm ví dụ thực tế hoặc case study cụ thể\n");
        }
        if (Boolean.TRUE.equals(request.getIncludeCallToAction())) {
            prompt.append("• Kết thúc với call-to-action mạnh mẽ\n");
        }

        prompt.append("\nCẤU TRÚC BÁI VIẾT DÀI:\n");
        prompt.append("1. Tiêu đề hấp dẫn với emoji\n");
        prompt.append("2. Mở đầu thu hút (150-200 từ)\n");
        prompt.append("3. Nội dung chính chia thành 4-6 phần:\n");
        prompt.append("   - Phần 1: Bối cảnh và vấn đề\n");
        prompt.append("   - Phần 2: Phân tích chi tiết\n");
        prompt.append("   - Phần 3: Giải pháp/Phương pháp\n");
        prompt.append("   - Phần 4: Lợi ích và kết quả\n");
        prompt.append("   - Phần 5: Hướng dẫn thực hiện (nếu có)\n");
        prompt.append("   - Phần 6: Xu hướng tương lai\n");
        prompt.append("4. Kết luận tổng kết và call-to-action\n");
        prompt.append("5. Hashtags phù hợp\n\n");

        if (request.getAdditionalInstructions() != null && !request.getAdditionalInstructions().trim().isEmpty()) {
            prompt.append("YÊU CẦU ĐẶC BIỆT:\n");
            prompt.append("• ").append(request.getAdditionalInstructions()).append("\n\n");
        }

        prompt.append("LƯU Ý QUAN TRỌNG:\n");
        prompt.append("• Viết hoàn toàn bằng tiếng Việt tự nhiên\n");
        prompt.append("• Cung cấp giá trị thực tế cho người đọc\n");
        prompt.append("• Sử dụng từ ngữ phù hợp với đối tượng mục tiêu\n");
        prompt.append("• Tạo ra nội dung hấp dẫn và dễ đọc\n");
        prompt.append("• Sử dụng emoji phù hợp để tăng tính thu hút\n");
        prompt.append("• Đảm bảo tính chuyên nghiệp và uy tín\n");

        return prompt.toString();
    }

    private Integer calculateTokensForWordCount(Integer wordCount) {
        if (wordCount == null) return 1500;
        int estimatedTokens = (int) (wordCount * 1.5);
        int totalTokens = estimatedTokens + 500;
        return Math.min(4000, totalTokens);
    }

    private String buildVietnameseTopicGenerationPrompt(Campaign campaign, Integer numberOfTopics, String additionalInstruction) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("NHIỆM VỤ: Tạo ").append(numberOfTopics).append(" chủ đề marketing bằng TIẾNG VIỆT cho chiến dịch sau:\n\n");

        prompt.append("THÔNG TIN CHIẾN DỊCH:\n");
        prompt.append("• Tên chiến dịch: ").append(campaign.getName()).append("\n");
        prompt.append("• Mô tả: ").append(campaign.getDescription()).append("\n\n");

        if (additionalInstruction != null && !additionalInstruction.trim().isEmpty()) {
            prompt.append("YÊU CẦU ĐẶC BIỆT:\n");
            prompt.append("• ").append(additionalInstruction).append("\n\n");
        }

        prompt.append("🇻🇳 YÊU CẦU CHO CHỦ ĐỀ:\n");
        prompt.append("• Viết hoàn toàn bằng tiếng Việt\n");
        prompt.append("• Phù hợp với văn hóa và thị trường Việt Nam\n");
        prompt.append("• Dễ hiểu, gần gũi với người Việt\n");
        prompt.append("• Có tính ứng dụng thực tế cao\n");
        prompt.append("• Trending và thu hút\n");
        prompt.append("• Phù hợp với mạng xã hội Việt Nam\n\n");

        prompt.append("ĐỊNH DẠNG TRẢ VỀ (CHÍNH XÁC):\n");
        prompt.append("{\n");
        prompt.append("  \"topics\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"name\": \"Tên chủ đề tiếng Việt ngắn gọn và hấp dẫn\",\n");
        prompt.append("      \"description\": \"Mô tả chi tiết bằng tiếng Việt về cách triển khai chủ đề, bao gồm key message và phương pháp tiếp cận\"\n");
        prompt.append("    }\n");
        prompt.append("  ]\n");
        prompt.append("}\n\n");

        prompt.append("LƯU Ý QUAN TRỌNG:\n");
        prompt.append("- CHỈ sử dụng tiếng Việt cho name và description\n");
        prompt.append("- Không dịch máy, hãy viết tự nhiên như người Việt\n");
        prompt.append("- Tên chủ đề không quá 60 ký tự\n");
        prompt.append("- Mô tả chi tiết 100-200 ký tự\n");
        prompt.append("- Đảm bảo JSON format chính xác\n");

        return prompt.toString();
    }

    private String buildVietnameseContentGenerationPrompt(Topic topic, String tone, String contentType, String additionalInstructions) {
        StringBuilder prompt = new StringBuilder();

        String vietnameseTone = mapToneToVietnamese(tone);
        String vietnameseContentType = mapContentTypeToVietnamese(contentType);

        prompt.append("NHIỆM VỤ: Tạo nội dung ").append(vietnameseContentType).append(" bằng TIẾNG VIỆT\n\n");

        prompt.append("THÔNG TIN CHỦ ĐỀ:\n");
        prompt.append("• Chủ đề: ").append(topic.getName()).append("\n");
        prompt.append("• Mô tả: ").append(topic.getDescription()).append("\n");
        prompt.append("• Tone: ").append(vietnameseTone).append("\n");
        prompt.append("• Loại nội dung: ").append(vietnameseContentType).append("\n\n");

        if (additionalInstructions != null && !additionalInstructions.trim().isEmpty()) {
            prompt.append("YÊU CẦU ĐẶC BIỆT:\n");
            prompt.append("• ").append(additionalInstructions).append("\n\n");
        }

        prompt.append("🇻🇳 YÊU CẦU NỘI DUNG:\n");
        prompt.append("• Viết hoàn toàn bằng tiếng Việt tự nhiên\n");
        prompt.append("• Hook mạnh mẽ để thu hút người đọc\n");
        prompt.append("• Thông điệp rõ ràng và có giá trị\n");
        prompt.append("• Call-to-action cụ thể bằng tiếng Việt\n");
        prompt.append("• Sử dụng emoji phù hợp\n");
        prompt.append("• Hashtags tiếng Việt và tiếng Anh phù hợp\n");
        prompt.append("• Phong cách giao tiếp thân thiện với người Việt\n");
        prompt.append("• Độ dài: 200-400 từ cho nội dung chất lượng\n\n");

        prompt.append("GỢI Ý CẤU TRÚC:\n");
        prompt.append("1. Hook thu hút (emoji + câu mở đầu ấn tượng)\n");
        prompt.append("2. Nội dung chính (giá trị + lợi ích)\n");
        prompt.append("3. Call-to-action rõ ràng\n");
        prompt.append("4. Hashtags phù hợp\n\n");

        prompt.append("QUAN TRỌNG: Viết như một người Việt đang nói chuyện, không dịch máy!");

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
}

