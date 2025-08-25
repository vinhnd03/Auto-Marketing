package com.codegym.auto_marketing_server.service.impl.facebook;

import com.codegym.auto_marketing_server.entity.Fanpage;
import com.codegym.auto_marketing_server.entity.PostMedia;
import com.codegym.auto_marketing_server.entity.PostTarget;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.enums.ScheduledPostStatus;
import com.codegym.auto_marketing_server.repository.IPostTargetRepository;
import com.codegym.auto_marketing_server.repository.IScheduledPostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PostingJob {
    private static final Logger logger = LoggerFactory.getLogger(PostingJob.class);
    private final IScheduledPostRepository scheduledPostRepository;
    private final IPostTargetRepository postTargetRepository;
    private final FacebookClient facebookClient;

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void run() {
        List<ScheduledPost> scheduledPostList = scheduledPostRepository
                .findByStatusAndScheduledTimeLessThanEqual(ScheduledPostStatus.SCHEDULED, LocalDateTime.now());

        for (ScheduledPost scheduledPost : scheduledPostList) {
            boolean allOk = true;
            try {
                List<PostTarget> postTargetList = postTargetRepository.findByScheduledPost(scheduledPost);
                for (PostTarget postTarget : postTargetList) {
                    Fanpage fanpage = postTarget.getFanpage();
                    String pageId = fanpage.getPageId();
                    String pageToken = fanpage.getPageAccessNameToken();
                    String content = scheduledPost.getPost().getContent();
                    String hashtags = scheduledPost.getPost().getHashtag();
                    String message = (hashtags != null && !hashtags.isBlank())
                            ? content + "\n\n" + hashtags
                            : content;
//                    String message = scheduledPost.getPost().getContent();

                    // Lấy danh sách URL ảnh từ Post.medias
                    List<String> imageUrls = scheduledPost.getPost().getMedias()
                            .stream()
                            .map(PostMedia::getUrl)
                            //.limit(1) // nếu cho up 1 ảnh
                            .collect(Collectors.toList());

                    boolean ok;
                    if (imageUrls.isEmpty()) {
                        ok = facebookClient.publishText(pageId, pageToken, message);
                    } else if (imageUrls.size() == 1) {
                        ok = facebookClient.publishPhoto(pageId, pageToken, message, imageUrls.get(0));
                    } else {
                        ok = facebookClient.publishPhotos(pageId, pageToken,message,imageUrls);
                    }

                    allOk = allOk && ok;
                    logger.info("Publish to page {} -> {}", pageId, ok ? "OK" : "FAIL");
                }

                scheduledPost.setStatus(allOk ? ScheduledPostStatus.POSTED : ScheduledPostStatus.FAILED);
                scheduledPost.setPostedAt(LocalDateTime.now());
                scheduledPostRepository.save(scheduledPost);
            } catch (Exception e) {
                logger.error("Schedule {} failed: {}", scheduledPost.getId(), e.getMessage(), e);
                scheduledPost.setStatus(ScheduledPostStatus.FAILED);
                scheduledPost.setPostedAt(LocalDateTime.now());
                scheduledPostRepository.save(scheduledPost);
            }
        }
    }
}
