package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.SchedulePostRequestDTO;
import com.codegym.auto_marketing_server.entity.Fanpage;
import com.codegym.auto_marketing_server.entity.Post;
import com.codegym.auto_marketing_server.entity.PostTarget;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.enums.ScheduledPostStatus;
import com.codegym.auto_marketing_server.repository.IFanpageRepository;
import com.codegym.auto_marketing_server.repository.IPostTargetRepository;
import com.codegym.auto_marketing_server.repository.IScheduledPostRepository;
import com.codegym.auto_marketing_server.service.IScheduledPostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ScheduledPostService implements IScheduledPostService {

    private final IScheduledPostRepository scheduledPostRepository;
    private final IFanpageRepository fanpageRepository;
    private final IPostTargetRepository postTargetRepository;
    private final PostService postService;

    @Override
    public ScheduledPost schedulePost(SchedulePostRequestDTO request) {
        try {
            log.info("📅 Scheduling post ID: {} for time: {}", request.getPostId(), request.getScheduledTime());

            // Validate post exists
            Post post = postService.findById(request.getPostId());

            // Update content if provided
            if (request.getFinalContent() != null && !request.getFinalContent().trim().isEmpty()) {
                post.setContent(request.getFinalContent());
                postService.save(post);
                log.info("📝 Updated post content before scheduling");
            }

            // Create scheduled post
            ScheduledPost scheduledPost = new ScheduledPost();
            scheduledPost.setPost(post);
            scheduledPost.setScheduledTime(request.getScheduledTime());
            scheduledPost.setStatus(ScheduledPostStatus.SCHEDULED);

            ScheduledPost savedScheduledPost = scheduledPostRepository.save(scheduledPost);

            // Create post targets for each fanpage
            List<PostTarget> postTargets = new ArrayList<>();
            for (Long fanpageId : request.getFanpageIds()) {
                Fanpage fanpage = fanpageRepository.findById(fanpageId).orElseThrow(() -> new RuntimeException("Fanpage not found: " + fanpageId));

                PostTarget postTarget = new PostTarget();
                postTarget.setScheduledPost(savedScheduledPost);
                postTarget.setFanpage(fanpage);
                postTargets.add(postTarget);
            }

            log.info("✅ Successfully scheduled post for {} fanpages at {}", request.getFanpageIds().size(), request.getScheduledTime());

            return savedScheduledPost;

        } catch (Exception e) {
            log.error("❌ Error scheduling post: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to schedule post: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ScheduledPost> getScheduledPostsByStatus(ScheduledPostStatus status) {
        return scheduledPostRepository.findByStatus(status);
    }

    @Override
    public List<ScheduledPost> getScheduledPostsByTimeRange(LocalDateTime start, LocalDateTime end) {
        return scheduledPostRepository.findByScheduledTimeBetween(start, end);
    }

    @Override
    @Scheduled(fixedRate = 60000) // Check every minute
    public void executeScheduledPosts() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fiveMinutesAgo = now.minusMinutes(5);

        List<ScheduledPost> duePosts = scheduledPostRepository.findByScheduledTimeBetween(fiveMinutesAgo, now);
        List<ScheduledPost> scheduledPosts = duePosts.stream().filter(post -> post.getStatus() == ScheduledPostStatus.SCHEDULED).toList();

        if (!scheduledPosts.isEmpty()) {
            log.info("🕐 Found {} posts ready for publishing", scheduledPosts.size());

            for (ScheduledPost scheduledPost : scheduledPosts) {
                try {
                    publishPost(scheduledPost);
                } catch (Exception e) {
                    log.error("❌ Failed to publish scheduled post ID: {}, Error: {}", scheduledPost.getId(), e.getMessage());

                    // Mark as failed but don't stop processing other posts
                    scheduledPost.setStatus(ScheduledPostStatus.CANCELLED);
                    scheduledPostRepository.save(scheduledPost);
                }
            }
        }
    }

    @Override
    public ScheduledPost cancelScheduledPost(Long scheduledPostId) {
        ScheduledPost scheduledPost = scheduledPostRepository.findById(scheduledPostId).orElseThrow(() -> new RuntimeException("Scheduled post not found: " + scheduledPostId));

        if (scheduledPost.getStatus() == ScheduledPostStatus.PUBLISHED) {
            throw new RuntimeException("Cannot cancel a post that has already been published");
        }

        scheduledPost.setStatus(ScheduledPostStatus.CANCELLED);
        ScheduledPost saved = scheduledPostRepository.save(scheduledPost);

        log.info("❌ Cancelled scheduled post ID: {}", scheduledPostId);
        return saved;
    }

    @Override
    public ScheduledPost reschedulePost(Long scheduledPostId, LocalDateTime newTime) {
        ScheduledPost scheduledPost = scheduledPostRepository.findById(scheduledPostId).orElseThrow(() -> new RuntimeException("Scheduled post not found: " + scheduledPostId));

        if (scheduledPost.getStatus() == ScheduledPostStatus.PUBLISHED) {
            throw new RuntimeException("Cannot reschedule a post that has already been published");
        }

        if (newTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot reschedule to a time in the past");
        }

        scheduledPost.setScheduledTime(newTime);
        scheduledPost.setStatus(ScheduledPostStatus.SCHEDULED); // Reset status if it was cancelled

        ScheduledPost saved = scheduledPostRepository.save(scheduledPost);

        log.info("🔄 Rescheduled post ID: {} to new time: {}", scheduledPostId, newTime);
        return saved;
    }

    private void publishPost(ScheduledPost scheduledPost) {
        try {
            log.info("🚀 Publishing scheduled post ID: {} - '{}'", scheduledPost.getId(), scheduledPost.getPost().getTitle());

            // In a real implementation, this would:
            // 1. Get all PostTargets for this ScheduledPost
            // 2. For each target fanpage, call Facebook/social media APIs
            // 3. Handle success/failure for each platform
            // 4. Update post status accordingly

            // For now, we'll simulate successful publishing
            simulatePublishToSocialMedia(scheduledPost);

            // Update status
            scheduledPost.setStatus(ScheduledPostStatus.PUBLISHED);
            scheduledPost.setPostedAt(LocalDateTime.now());
            scheduledPostRepository.save(scheduledPost);

            log.info("✅ Successfully published post: {}", scheduledPost.getPost().getTitle());

        } catch (Exception e) {
            log.error("❌ Failed to publish post: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void simulatePublishToSocialMedia(ScheduledPost scheduledPost) {
        // Simulate API calls to social media platforms
        // In real implementation, this would use Facebook Graph API, etc.

        log.info("📤 Simulating social media publishing...");
        log.info("📝 Post Content: {}", scheduledPost.getPost().getContent().substring(0, Math.min(100, scheduledPost.getPost().getContent().length())) + "...");

        try {
            // Simulate network delay
            Thread.sleep(1000);

            // Simulate successful API response
            log.info("✅ Simulated successful publishing to social media platforms");

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Publishing interrupted", e);
        }
    }
}
