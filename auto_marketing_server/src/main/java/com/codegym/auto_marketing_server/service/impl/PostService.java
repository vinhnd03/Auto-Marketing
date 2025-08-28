package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.PostFilterDTO;
import com.codegym.auto_marketing_server.dto.PostResponseDTO;
import com.codegym.auto_marketing_server.entity.Post;
import com.codegym.auto_marketing_server.entity.Topic;
import com.codegym.auto_marketing_server.enums.PostStatus;
import com.codegym.auto_marketing_server.enums.TopicStatus;
import com.codegym.auto_marketing_server.repository.IPostRepository;
import com.codegym.auto_marketing_server.service.IPostService;
import com.codegym.auto_marketing_server.service.ITopicService;
import com.codegym.auto_marketing_server.util.CloudinaryService;
import com.codegym.auto_marketing_server.util.OpenAIImageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.net.URL;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostService implements IPostService {

    private final IPostRepository postRepository;
    private final ITopicService topicService;
    private final GPTService gptService;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;
    private final CloudinaryService cloudinaryService;
    private final OpenAIImageService openAIImageService; // Thêm service này!

    @Override
    public CompletableFuture<List<PostResponseDTO>> generateContentWithAI(ContentGenerationRequestDTO request) {
        return CompletableFuture.supplyAsync(() -> {
            long start = System.currentTimeMillis();

            try {
                Topic topic = topicService.findById(request.getTopicId());
                if (topic.getStatus() != TopicStatus.APPROVED) {
                    throw new RuntimeException("Topic must be approved before generating content.");
                }
                List<Post> generatedPosts = new ArrayList<>();

                for (int i = 0; i < request.getNumberOfPosts(); i++) {
                    long postStart = System.currentTimeMillis();
                    log.info("⏳ [AI GEN] Bắt đầu gen bài số {} cho topic {}", i + 1, topic.getId());

                    // 1. Gen content
                    String gptResponse = gptService.generateLongFormContent(topic, request).get();

                    Post post = createPostFromGPTResponse(gptResponse, topic, request);

                    // 2. Nếu chọn kiểu "image" hoặc "mixed" thì mới gen image
                    if ("image".equalsIgnoreCase(request.getContentType()) || "mixed".equalsIgnoreCase(request.getContentType())) {
                        // Gen image prompt từ content
                        String imagePrompt = gptService.generateImagePromptFromContent(gptResponse).get();

                        // Gọi OpenAI API để lấy url ảnh thật
                        String aiImageUrl = openAIImageService.generateImageUrlFromPrompt(imagePrompt);

                        // Download ảnh về file tạm
                        File imageFile = downloadImageToFile(aiImageUrl);

                        // Upload lên Cloudinary
                        String imageUrl = cloudinaryService.uploadImage(imageFile);

                        // Xoá file tạm
                        imageFile.delete();

                        // Lưu imageUrl vào post
                        post.setImageUrl(imageUrl);
                    } else {
                        // Nếu chỉ văn bản thì imageUrl để null hoặc rỗng
                        post.setImageUrl(null);
                    }

                    generatedPosts.add(post);

                    long postTime = System.currentTimeMillis() - postStart;
                    log.info("✅ [AI GEN] Hoàn thành bài số {} trong {} ms ({} giây)", i + 1, postTime, postTime / 1000.0);
                }

                List<Post> savedPosts = postRepository.saveAll(generatedPosts);

                long duration = System.currentTimeMillis() - start;
                log.info("🎉 [AI GEN] Tổng thời gian gen {} bài: {} ms ({} giây)", request.getNumberOfPosts(), duration, duration / 1000.0);

                return savedPosts.stream()
                        .map(this::mapToResponseDTO)
                        .toList();

            } catch (Exception e) {
                log.error("Error generating AI content: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to generate AI content: " + e.getMessage(), e);
            }
        });
    }

    // Download ảnh từ url về file tạm
    private File downloadImageToFile(String imageUrl) throws Exception {
        URL url = new URL(imageUrl);
        File tempFile = File.createTempFile("ai-image", ".jpg");
        try (var in = url.openStream()) {
            Files.copy(in, tempFile.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        }
        return tempFile;
    }

    @Override
    public List<PostResponseDTO> getPostsByTopic(Long topicId) {
        return postRepository.findByTopicId(topicId).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public List<PostResponseDTO> getPostsByTopicAndStatus(Long topicId, PostStatus status) {
        return postRepository.findByTopicIdAndStatus(topicId, status).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public PostResponseDTO updatePostStatus(Long postId, PostStatus status) {
        Post post = findById(postId);
        post.setStatus(status);
        post.setUpdatedAt(LocalDate.now());

        Post savedPost = postRepository.save(post);
        log.info("📝 Post status updated to {} for post: {}", status, savedPost.getTitle());

        return mapToResponseDTO(savedPost);
    }

    @Override
    public Post findById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found: " + postId));
    }

    @Override
    public Post save(Post post) {
        return postRepository.save(post);
    }

    @Override
    @Transactional // <-- Thêm annotation này để đảm bảo transaction
    public List<PostResponseDTO> approveAndCleanPosts(Long topicId, List<Long> selectedPostIds) {
        // Approve selected posts
        List<Post> selectedPosts = postRepository.findAllById(selectedPostIds);
        for (Post post : selectedPosts) {
            post.setStatus(PostStatus.APPROVED);
            post.setUpdatedAt(LocalDate.now());
        }
        postRepository.saveAll(selectedPosts); // <-- Đảm bảo gọi saveAll sau khi setStatus

        // Delete unselected DRAFT posts for this topic
        List<Post> draftPosts = postRepository.findByTopicIdAndStatus(topicId, PostStatus.DRAFT);
        List<Post> toDelete = draftPosts.stream()
                .filter(post -> !selectedPostIds.contains(post.getId()))
                .toList();
        postRepository.deleteAll(toDelete);

        // Return approved posts as DTO
        return selectedPosts.stream().map(this::mapToResponseDTO).toList();
    }

    private Post createPostFromGPTResponse(String gptResponse, Topic topic, ContentGenerationRequestDTO request) {
        Post post = new Post();

        // Parse GPT response to extract title and content
        String[] parsedContent = parseGPTResponse(gptResponse);
        String title = parsedContent[0];
        String content = parsedContent[1];
        String hashtags = extractHashtags(content);

        // Set basic post information
        post.setTitle(title);
        post.setContent(content);
        post.setHashtag(hashtags);

        // Set AI generation metadata
        post.setGeneratedByAI(true);
        post.setAiPrompt(buildPromptSummary(request));
        post.setAiModel(GPTService.GPT_MODEL);
        post.setGenerateTime(LocalDateTime.now());

        // Set request parameters
        post.setContentType(request.getContentType());
        post.setTone(request.getTone());
        post.setTargetAudience(mapTargetAudienceToInteger(request.getTargetAudience()));

        // Set token usage (simplified)
        post.setTokenUsage(String.format("Generated with %s words, estimated %d tokens",
                countWords(content), estimateTokens(content)));

        // Set status and dates
        post.setStatus(PostStatus.DRAFT);
        post.setCreatedAt(LocalDate.now());
        post.setUpdatedAt(LocalDate.now());

        // Link to topic
        post.setTopic(topic);

        return post;
    }

    private String[] parseGPTResponse(String gptResponse) {
        String[] lines = gptResponse.split("\n");
        String title = "";
        StringBuilder contentBuilder = new StringBuilder();

        boolean foundTitle = false;

        for (String line : lines) {
            line = line.trim();

            // Look for title (usually the first significant line or starts with emoji)
            if (!foundTitle && !line.isEmpty() && (line.contains("🎯") || line.contains("🚀") || line.contains("💡") || line.length() > 20)) {
                title = line.replaceAll("^[#*]+\\s*", "").trim(); // Remove markdown formatting
                foundTitle = true;
            } else if (foundTitle && !line.isEmpty()) {
                contentBuilder.append(line).append("\n");
            }
        }

        // If no clear title found, generate one from content
        if (title.isEmpty() && contentBuilder.length() > 0) {
            String content = contentBuilder.toString();
            title = generateTitleFromContent(content);
        }

        return new String[]{title, contentBuilder.toString().trim()};
    }

    private String generateTitleFromContent(String content) {
        // Extract first meaningful sentence as title
        String[] sentences = content.split("[.!?]");
        for (String sentence : sentences) {
            sentence = sentence.trim();
            if (sentence.length() > 20 && sentence.length() < 100) {
                return "🎯 " + sentence;
            }
        }
        return "🎯 Nội dung Marketing Mới";
    }

    private String extractHashtags(String content) {
        if (content == null) return "";

        // Preserve Vietnamese characters in hashtags
        return content.lines()
                .filter(line -> line.contains("#"))
                .map(line -> line.replaceAll("[^#\\p{L}\\p{N} ]", ""))
                .collect(Collectors.joining(" "))
                .trim();
    }

    private String buildPromptSummary(ContentGenerationRequestDTO request) {
        return String.format("Generate %s content with %s tone for %s platform, targeting %s audience",
                request.getContentType(), request.getTone(), request.getTargetPlatform(), request.getTargetAudience());
    }

    private Integer mapTargetAudienceToInteger(String targetAudience) {
        if (targetAudience == null) return 1;

        return switch (targetAudience.toLowerCase()) {
            case "general" -> 1;
            case "business_owners" -> 2;
            case "young_professionals" -> 3;
            case "students" -> 4;
            case "tech_enthusiasts" -> 5;
            default -> 1;
        };
    }

    private int countWords(String content) {
        if (content == null || content.trim().isEmpty()) return 0;
        return content.trim().split("\\s+").length;
    }

    private int estimateTokens(String content) {
        return (int) (countWords(content) * 1.3); // Rough estimation for Vietnamese
    }

    private PostResponseDTO mapToResponseDTO(Post post) {
        PostResponseDTO dto = modelMapper.map(post, PostResponseDTO.class);

        // Map topic information if available
        if (post.getTopic() != null) {
            dto.setTopicId(post.getTopic().getId());
        }

        return dto;
    }


    @Override
    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public List<PostFilterDTO> getPostsByFilters(Long workspaceId, Long campaignId, Long topicId) {
        return postRepository.findPostFilterDTOs(workspaceId, campaignId, topicId);
    }


}