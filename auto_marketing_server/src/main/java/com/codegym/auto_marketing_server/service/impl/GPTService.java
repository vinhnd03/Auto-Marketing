package com.codegym.auto_marketing_server.service.impl;


import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.GPTMessageDTO;
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

    public static final String GPT_MODEL = "gpt-4.1";
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
    public CompletableFuture<String> generateTopicsFromCampaign(Campaign campaign, Integer numberOfTopics, String additionalInstructions, double temperature, String tone) {
        try {
            log.info("🇻🇳 Generating {} Vietnamese topics for campaign '{}', creativity temperature {}, tone '{}', additionalInstructions '{}", numberOfTopics, campaign.getName(), temperature, tone, additionalInstructions);

            String prompt = buildVietnameseTopicGenerationPrompt(campaign, numberOfTopics, additionalInstructions, tone);

            GPTRequestDTO requestDTO = new GPTRequestDTO();
            requestDTO.setModel(GPT_MODEL);
            requestDTO.setMax_tokens(32768); // Tăng lên tối đa cho GPT-4.1
            requestDTO.setTemperature(temperature);
            requestDTO.setMessages(Arrays.asList(new GPTMessageDTO(SYSTEM_ROLE, "Bạn là một chuyên gia marketing người Việt Nam với 10 năm kinh nghiệm. Bạn hiểu rõ thị trường Việt Nam, văn hóa, ngôn ngữ và hành vi tiêu dùng. Hãy tạo các chủ đề marketing bằng tiếng Việt thuần túy, phù hợp với người Việt. QUAN TRỌNG: Chỉ trả lời bằng tiếng Việt, không dùng tiếng Anh."), new GPTMessageDTO(USER_ROLE, prompt)));

            GPTResponseDTO responseDTO = callGPTAPI(requestDTO).get();
            String content = responseDTO.getChoices().get(0).getMessage().getContent();

            // Xử lý loại bỏ code block nếu AI trả về có ```json ... ```
            if (content != null) {
                content = content.trim();
                if (content.startsWith("```json")) {
                    content = content.substring(7).trim();
                }
                if (content.startsWith("```")) {
                    content = content.substring(3).trim();
                }
                if (content.endsWith("```")) {
                    content = content.substring(0, content.length() - 3).trim();
                }
            }

            log.info("Successfully generated Vietnamese topics");
            log.debug("Generated content: {}", content);

            return CompletableFuture.completedFuture(content);

        } catch (Exception e) {
            log.error("Error generating Vietnamese topics: {}", e.getMessage(), e);
            throw new GPTServiceException("Không thể tạo ra các chủ đề tiếng Việt", e);
        }
    }

    @Override
    public CompletableFuture<String> generateContentFromTopic(Topic topic, String tone, String contentType, String additionalInstructions, Boolean includeHashtag, Boolean includeCallToAction) {
        try {
            log.info("🇻🇳 Generating Vietnamese {} content for topic '{}', tone '{}', hashtag {}, callToAction {}", contentType, topic.getName(), tone, includeHashtag, includeCallToAction);

            String prompt = buildVietnameseContentGenerationPrompt(topic, tone, contentType, includeHashtag, includeCallToAction, additionalInstructions);

            GPTRequestDTO requestDTO = new GPTRequestDTO();
            requestDTO.setModel(GPT_MODEL);
            requestDTO.setMax_tokens(32768); // Tăng lên tối đa cho GPT-4.1
            requestDTO.setTemperature(0.8);
            requestDTO.setMessages(Arrays.asList(new GPTMessageDTO(SYSTEM_ROLE, "Bạn là một copywriter chuyên nghiệp người Việt Nam, chuyên tạo nội dung marketing tiếng Việt. Bạn viết theo phong cách người Việt, sử dụng từ ngữ thân thiện, dễ hiểu. QUAN TRỌNG: Chỉ viết bằng tiếng Việt, không dùng tiếng Anh trừ khi cần thiết cho hashtag."), new GPTMessageDTO(USER_ROLE, prompt)));

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
    public CompletableFuture<String> generateLongFormContent(Topic topic, ContentGenerationRequestDTO request, String aiModel) {
        try {
            log.info("🇻🇳 Generating long-form {} content ({} words) for topic '{}' with model '{}', includeHashtag={}, includeCallToAction={}",
                    request.getContentType(), request.getTargetWordCount(), topic.getName(), aiModel, request.getIncludeHashtag(), request.getIncludeCallToAction());

            String prompt = buildLongFormContentPrompt(topic, request.getTone(), request.getContentType(),
                    request.getTargetWordCount(), request.getIncludeBulletPoints(), request.getIncludeStatistics(),
                    request.getIncludeCaseStudies(), request.getIncludeCallToAction(), request.getIncludeHashtag(), request.getAdditionalInstructions());

            GPTRequestDTO requestDTO = new GPTRequestDTO();
            requestDTO.setModel(aiModel); // model truyền từ FE
            requestDTO.setMax_tokens(32768);
            requestDTO.setTemperature(0.7);
            requestDTO.setMessages(Arrays.asList(
                    new GPTMessageDTO(SYSTEM_ROLE, buildLongFormSystemPrompt(request)),
                    new GPTMessageDTO(USER_ROLE, prompt)
            ));

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
            requestDTO.setMax_tokens(2048); // Image prompt chỉ cần tối đa 2048 token (hoặc tùy bạn)
            requestDTO.setTemperature(0.6);
            requestDTO.setMessages(Arrays.asList(new GPTMessageDTO(SYSTEM_ROLE, "Bạn là chuyên gia tạo prompt cho AI image generation. " + "Hãy tạo prompt tiếng Anh ngắn gọn, chính xác cho DALL-E hoặc Midjourney."), new GPTMessageDTO(USER_ROLE, prompt)));

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

    String buildLongFormContentPrompt(Topic topic, String tone, String contentType, Integer targetWordCount, Boolean includeBulletPoints, Boolean includeStatistics, Boolean includeCaseStudies, Boolean includeCallToAction, Boolean includeHashtag, String additionalInstructions) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("NHIỆM VỤ: Viết bài ").append(mapContentTypeToVietnamese(contentType));
        prompt.append(" dài và chi tiết bằng TIẾNG VIỆT, trình bày liền mạch như một câu chuyện hoặc chia sẻ thực tế, không chia phần, không đặt bất kỳ tiêu đề phụ hoặc nhãn nào.\n\n");

        prompt.append("THÔNG TIN CHỦ ĐỀ:\n");
        prompt.append("• Chủ đề: ").append(topic.getName()).append("\n");
        prompt.append("• Mô tả: ").append(topic.getDescription()).append("\n\n");

        // THÊM YÊU CẦU VỀ TIÊU ĐỀ
        prompt.append("YÊU CẦU TIÊU ĐỀ:\n");
        prompt.append("• Tiêu đề bài viết PHẢI NỔI BẬT, SÚC TÍCH, TỐI ĐA 70 KÝ TỰ.\n");
        prompt.append("• Nếu tiêu đề vượt quá ,P TỨC rút ngắn lại còn tối đa 70 ký tự, KHÔNG giải thích, KHÔNG giữ lại emoji nếu bị cắt.\n");
        prompt.append("• KHÔNG được bắt đầu title bằng các cụm từ dài dòng, lan man, hoặc quá chung chung như \"Trong thời đại công nghệ phát triển...\", \"🌟 Trong thời đại công nghệ số hiện nay...\".\n");
        prompt.append("• Ưu tiên tiêu đề là một câu hoặc một cụm từ mạnh mẽ, truyền cảm hứng, KHÔNG lặp lại nội dung của phần mô tả.\n");
        prompt.append("• KHÔNG sử dụng emoji ở đầu tiêu đề. Nếu sử dụng emoji, chỉ được đặt ở cuối tiêu đề và chỉ khi không bị cắt mất khi rút ngắn.\n\n");

        if (targetWordCount != null) {
            prompt.append("YÊU CẦU ĐỘ DÀI:\n");
            prompt.append("• Độ dài mục tiêu: ").append(targetWordCount).append(" từ (±10%)\n");
            prompt.append("• Đây là bài viết dài, cần nội dung chuyên sâu và chi tiết\n\n");
        }

        prompt.append("YÊU CẦU NỘI DUNG:\n");
        prompt.append("• Tone: ").append(mapToneToVietnamese(tone)).append("\n");
        prompt.append("• Loại nội dung: ").append(mapContentTypeToVietnamese(contentType)).append("\n");

        if (Boolean.TRUE.equals(includeBulletPoints)) {
            prompt.append("• Sử dụng bullet points và danh sách có cấu trúc nếu phù hợp, nhưng KHÔNG được dùng tiêu đề phụ hoặc nhãn.\n");
        }
        if (Boolean.TRUE.equals(includeStatistics)) {
            prompt.append("• Bao gồm số liệu và thống kê thuyết phục nếu có thể, đặt tự nhiên trong dòng chảy bài viết.\n");
        }
        if (Boolean.TRUE.equals(includeCaseStudies)) {
            prompt.append("• Đưa ra ví dụ thực tế hoặc case study cụ thể, lồng ghép tự nhiên vào nội dung, KHÔNG chia phần.\n");
        }
        if (Boolean.TRUE.equals(includeCallToAction)) {
            prompt.append("• Kết thúc với call-to-action mạnh mẽ, KHÔNG dùng nhãn 'Kết luận'.\n");
        }
        if (Boolean.TRUE.equals(includeHashtag)) {
            prompt.append("• Cuối bài viết tạo 3-5 hashtag liên quan, mỗi hashtag một dòng, bắt đầu bằng ký tự #.\n");
        }

        if (additionalInstructions != null && !additionalInstructions.trim().isEmpty()) {
            prompt.append("YÊU CẦU ĐẶC BIỆT:\n");
            prompt.append("• ").append(additionalInstructions).append("\n\n");
        }

        prompt.append("LƯU Ý QUAN TRỌNG:\n");
        prompt.append("• Viết hoàn toàn bằng tiếng Việt tự nhiên, không dịch máy.\n");
        prompt.append("• TUYỆT ĐỐI KHÔNG chia phần, không đặt bất kỳ tiêu đề phụ, nhãn, hoặc dùng từ như 'Phần', 'Mở đầu', 'Kết luận', 'Giải pháp', 'Xu hướng',... trong bài viết.\n");
        prompt.append("• Nếu xuất hiện bất kỳ tiêu đề phụ hoặc từ khoá nào như trên, hãy coi đó là lỗi và tự động viết lại, chỉ trình bày liền mạch như một câu chuyện hoặc chia sẻ.\n");
        prompt.append("• Đưa ra luận điểm, dẫn chứng thực tế, số liệu hoặc ví dụ lồng ghép tự nhiên trong bài.\n");
        prompt.append("• Tạo ra nội dung hấp dẫn, truyền cảm hứng, dễ đọc.\n");
        prompt.append("• Có thể dùng emoji hợp lý xen kẽ, KHÔNG dùng emoji để chia đoạn hoặc làm tiêu đề.\n");

        return prompt.toString();
    }

    private Integer calculateTokensForWordCount(Integer wordCount) {
        if (wordCount == null) return 32768; // Tăng lên tối đa cho GPT-4.1
        int estimatedTokens = (int) (wordCount * 1.5);
        int totalTokens = estimatedTokens + 500;
        return Math.min(32768, totalTokens); // Tối đa cho GPT-4.1
    }

    public String buildVietnameseTopicGenerationPrompt(Campaign campaign, Integer numberOfTopics, String additionalInstruction, String tone) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("NHIỆM VỤ: Sáng tạo ").append(numberOfTopics).append(" chủ đề marketing thật độc đáo, mới mẻ và ấn tượng bằng TIẾNG VIỆT cho chiến dịch sau:\n\n");

        prompt.append("THÔNG TIN CHIẾN DỊCH:\n");
        prompt.append("• Tên chiến dịch: ").append(campaign.getName()).append("\n");
        prompt.append("• Mô tả: ").append(campaign.getDescription()).append("\n\n");

        if (additionalInstruction != null && !additionalInstruction.trim().isEmpty()) {
            prompt.append("YÊU CẦU ĐẶC BIỆT:\n");
            prompt.append("• ").append(additionalInstruction).append("\n\n");
        }

        prompt.append("PHONG CÁCH NỘI DUNG (tone): ").append(mapContentStyleToVietnamese(tone)).append("\n\n");

        prompt.append("YÊU CẦU CHO CHỦ ĐỀ:\n");
        prompt.append("• Chủ đề phải thật thu hút, tạo cảm xúc, khơi gợi sự tò mò hoặc truyền cảm hứng mạnh mẽ.\n");
        prompt.append("• Đưa ra góc nhìn mới lạ, sáng tạo, khác biệt so với thông thường.\n");
        prompt.append("• Nội dung phù hợp với xu hướng hiện tại, ứng dụng cao trên mạng xã hội Việt Nam.\n");
        prompt.append("• Tên chủ đề PHẢI NGẮN GỌN, súc tích, dễ nhớ, nổi bật, tối đa 45 ký tự. Có thể dùng phép ẩn dụ, chơi chữ, câu hỏi mở.\n");
        prompt.append("• Mô tả chủ đề thật súc tích, truyền động lực, kích thích hành động hoặc tương tác.\n");
        prompt.append("• Viết tự nhiên như người Việt, không dịch máy, không rập khuôn.\n\n");

        prompt.append("ĐỊNH DẠNG TRẢ VỀ (CHÍNH XÁC):\n");
        prompt.append("{\n");
        prompt.append("  \"topics\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"name\": \"Tên chủ đề tiếng Việt ngắn gọn, nổi bật, tối đa 45 ký tự\",\n");
        prompt.append("      \"description\": \"Mô tả chi tiết, truyền cảm hứng, súc tích, 100-200 ký tự, giúp người đọc muốn tìm hiểu hoặc tương tác\"\n");
        prompt.append("    }\n");
        prompt.append("  ]\n");
        prompt.append("}\n\n");

        prompt.append("LƯU Ý QUAN TRỌNG:\n");
        prompt.append("- CHỈ sử dụng tiếng Việt cho name và description\n");
        prompt.append("- Đảm bảo chủ đề nổi bật, khác biệt, gây ấn tượng, thu hút tương tác\n");
        prompt.append("- Tên chủ đề phải NGẮN GỌN, tối đa 45 ký tự. Nếu vượt quá, hãy tự động rút gọn lại.\n");
        prompt.append("- Đảm bảo JSON format chính xác\n");

        return prompt.toString();
    }

    private String mapContentStyleToVietnamese(String style) {
        if (style == null) return "chuyên nghiệp, thân thiện";
        return switch (style.toLowerCase()) {
            case "friendly" -> "gần gũi, dễ hiểu";
            case "professional" -> "trang trọng, uy tín";
            case "creative" -> "độc đáo, thu hút";
            default -> "chuyên nghiệp, thân thiện";
        };
    }

    public String buildVietnameseContentGenerationPrompt(Topic topic, String tone, String contentType, Boolean includeHashtag, Boolean includeCallToAction, String additionalInstructions) {
        StringBuilder prompt = new StringBuilder();

        String vietnameseTone = mapToneToVietnamese(tone);
        String vietnameseContentType = mapContentTypeToVietnamese(contentType);

        prompt.append("NHIỆM VỤ: Viết một bài đăng ").append(vietnameseContentType).append(" bằng TIẾNG VIỆT về chủ đề dưới đây, liền mạch như một câu chuyện hoặc chia sẻ, truyền cảm hứng, chuyên nghiệp, không chia phần, không đặt tiêu đề phụ, không lạm dụng emoji.\n\n");

        prompt.append("THÔNG TIN CHỦ ĐỀ:\n");
        prompt.append("• Chủ đề: ").append(topic.getName()).append("\n");
        prompt.append("• Mô tả: ").append(topic.getDescription()).append("\n");
        prompt.append("• Tone: ").append(vietnameseTone).append("\n");
        prompt.append("• Loại nội dung: ").append(vietnameseContentType).append("\n\n");

        // THÊM YÊU CẦU VỀ TIÊU ĐỀ
        prompt.append("YÊU CẦU TIÊU ĐỀ:\n");
        prompt.append("• Tiêu đề bài viết PHẢI NỔI BẬT, SÚC TÍCH, TỐI ĐA 70 KÝ TỰ.\n");
        prompt.append("• Nếu tiêu đề vượt quá 70 ký tự, HÃY NGAY LẬP TỨC rút ngắn lại còn tối đa 70 ký tự, KHÔNG giải thích, KHÔNG giữ lại emoji nếu bị cắt.\n");
        prompt.append("• KHÔNG được bắt đầu title bằng các cụm từ dài dòng, lan man, hoặc quá chung chung như \"Trong thời đại công nghệ phát triển...\", \"🌟 Trong thời đại công nghệ số hiện nay...\".\n");
        prompt.append("• Ưu tiên tiêu đề là một câu hoặc một cụm từ mạnh mẽ, truyền cảm hứng, KHÔNG lặp lại nội dung của phần mô tả.\n");
        prompt.append("• KHÔNG sử dụng emoji ở đầu tiêu đề. Nếu sử dụng emoji, chỉ được đặt ở cuối tiêu đề và chỉ khi không bị cắt mất khi rút ngắn.\n\n");

        if (additionalInstructions != null && !additionalInstructions.trim().isEmpty()) {
            prompt.append("YÊU CẦU BỔ SUNG:\n");
            prompt.append("• ").append(additionalInstructions).append("\n\n");
        }

        prompt.append("YÊU CẦU:\n");
        prompt.append("• Viết hoàn toàn bằng tiếng Việt tự nhiên, không dịch máy.\n");
        prompt.append("• TUYỆT ĐỐI KHÔNG được chia nội dung thành các phần, KHÔNG đặt tiêu đề phụ, KHÔNG dùng bất kỳ từ nào như 'Phần', 'Mở đầu', 'Kết luận', 'Giải pháp',... hoặc bất kỳ tiêu đề nào trong bài viết.\n");
        prompt.append("• Không được bắt đầu dòng hoặc đoạn bằng emoji. Chỉ được sử dụng tối đa 2 emoji trong toàn bài, dùng xen kẽ tự nhiên, KHÔNG dùng icon để dẫn dắt hoặc chia đoạn.\n");
        prompt.append("• Trình bày liền mạch như một câu chuyện, chia sẻ thực tế, truyền cảm hứng cho người đọc.\n");
        prompt.append("• Đưa ra luận điểm, dẫn chứng thực tế, góc nhìn mới mẻ một cách tự nhiên, không tách rời khỏi dòng chảy bài viết.\n");

        if (Boolean.TRUE.equals(includeCallToAction)) {
            prompt.append("• Kết thúc bằng thông điệp truyền cảm hứng hoặc call-to-action mạnh mẽ, khuyến khích người đọc suy nghĩ/tương tác/hành động.\n");
        }

        if (Boolean.TRUE.equals(includeHashtag)) {
            prompt.append("• Cuối bài viết tạo 3-5 hashtag liên quan, mỗi hashtag một dòng, bắt đầu bằng ký tự #.\n");
        }

        prompt.append("• Độ dài: 200-400 từ.\n\n");

        prompt.append("Lưu ý: TUYỆT ĐỐI KHÔNG chia phần, không đặt bất kỳ tiêu đề phụ hoặc nhãn nào, không lạm dụng emoji/icon, không bắt đầu dòng với emoji. Viết liền mạch như một bài chia sẻ truyền cảm hứng trên Facebook.");

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

