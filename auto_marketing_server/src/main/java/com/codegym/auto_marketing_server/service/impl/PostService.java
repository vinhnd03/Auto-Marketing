package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.ContentGenerationRequestDTO;
import com.codegym.auto_marketing_server.dto.PostResponseDTO;
import com.codegym.auto_marketing_server.entity.Post;
import com.codegym.auto_marketing_server.entity.Topic;
import com.codegym.auto_marketing_server.enums.PostStatus;
import com.codegym.auto_marketing_server.enums.TopicStatus;
import com.codegym.auto_marketing_server.repository.IPostRepository;
import com.codegym.auto_marketing_server.service.IPostService;
import com.codegym.auto_marketing_server.service.ITopicService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

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

    @Override
    public CompletableFuture<List<PostResponseDTO>> generateContentWithAI(ContentGenerationRequestDTO request) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("🤖 Starting AI content generation for topic ID: {}", request.getTopicId());

                // Validate topic exists and is approved
                Topic topic = topicService.findById(request.getTopicId());
                if (topic.getStatus() != TopicStatus.APPROVED) {
                    throw new RuntimeException("Topic must be approved before generating content. Current status: " + topic.getStatus());
                }

                List<Post> generatedPosts = new ArrayList<>();

                // Generate multiple posts if requested
                for (int i = 0; i < request.getNumberOfPosts(); i++) {
                    log.info("Generating post {} of {} for topic: {}",
                            i + 1, request.getNumberOfPosts(), topic.getName());

                    String gptResponse = gptService.generateLongFormContent(topic, request).get();

                    Post post = createPostFromGPTResponse(gptResponse, topic, request);
                    generatedPosts.add(post);
                }

                // Save all generated posts
                List<Post> savedPosts = postRepository.saveAll(generatedPosts);

                log.info("Successfully generated {} AI posts for topic: {}",
                        savedPosts.size(), topic.getName());

                return savedPosts.stream()
                        .map(this::mapToResponseDTO)
                        .toList();

            } catch (Exception e) {
                log.error("Error generating AI content: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to generate AI content: " + e.getMessage(), e);
            }
        });
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
}
