package com.codegym.auto_marketing_server.service.impl.facebook;

import com.codegym.auto_marketing_server.entity.Fanpage;
import com.codegym.auto_marketing_server.entity.PostMedia;
import com.codegym.auto_marketing_server.entity.PostTarget;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.enums.PostStatus;
import com.codegym.auto_marketing_server.enums.ScheduledPostStatus;
import com.codegym.auto_marketing_server.repository.IPostTargetRepository;
import com.codegym.auto_marketing_server.repository.IScheduledPostRepository;
import com.codegym.auto_marketing_server.security.email.EmailService;
import com.codegym.auto_marketing_server.service.impl.PostService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
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
    private final EmailService emailService;
    private final PostService postService;

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

                    String postId;
                    if (imageUrls.isEmpty()) {
                        postId = facebookClient.publishText(pageId, pageToken, message);
                    } else if (imageUrls.size() == 1) {
                        postId = facebookClient.publishPhoto(pageId, pageToken, message, imageUrls.get(0));
                    } else {
                        postId = facebookClient.publishPhotos(pageId, pageToken, message, imageUrls);
                    }

                    if (postId != null) {
                        String[] parts = postId.split("_");
                        String page = parts[0];
                        String post = parts[1];

                        String postUrl = "https://www.facebook.com/" + page +  "/posts/" + post;
                        postTarget.setPostUrl(postUrl);
                        postTargetRepository.save(postTarget);
                        logger.info("Publish to page {} success, postId = {}", pageId, postId);

                        // 📧 Gửi mail thành công cho page này
                        List<Object[]> results = scheduledPostRepository.findUserEmailsAndNamesByScheduledPostId(scheduledPost.getId());
                        for (Object[] row : results) {
                            String email = (String) row[0];
                            String name = (String) row[1];
                            String pageIdDb = (String) row[2];
                            String pageName = (String) row[3];

                            if (pageId.equals(pageIdDb)) { // chỉ gửi đúng page thành công
                                emailService.sendPostPublishedEmail(
                                        email,
                                        name,
                                        pageId,
                                        pageName,
                                        scheduledPost.getPost().getTitle(),
                                        LocalDateTime.now()
                                );
                                logger.info("Sent post-published email to {} ({}) for page {}", name, email, pageName);
                            }
                        }

                    } else {
                        logger.error("Publish to page {} failed", pageId);
                        allOk = false;

                        // 📧 Gửi mail thất bại chỉ cho page này
                        List<Object[]> results = scheduledPostRepository.findUserEmailsAndNamesByScheduledPostId(scheduledPost.getId());
                        for (Object[] row : results) {
                            String email = (String) row[0];
                            String name = (String) row[1];
                            String pageIdDb = (String) row[2];
                            String pageName = (String) row[3];

                            if (pageId.equals(pageIdDb)) { // chỉ gửi đúng page fail
                                emailService.sendPostFailedEmail(
                                        email,
                                        name,
                                        pageName,
                                        scheduledPost.getPost().getTitle(),
                                        LocalDateTime.now()
                                );
                                logger.info("Sent post-failed email to {} ({}) for page {}", name, email, pageName);
                            }
                        }
                    }

                }

                scheduledPost.setStatus(allOk ? ScheduledPostStatus.POSTED : ScheduledPostStatus.FAILED);
                scheduledPost.setPostedAt(LocalDateTime.now());
                scheduledPostRepository.save(scheduledPost);

//                if(allOk) {
                    // 🔍 Kiểm tra post còn được lên lịch nữa không
                    Long postId = scheduledPost.getPost().getId();
                    boolean stillScheduled = scheduledPostRepository
                            .existsByPostIdAndStatus(postId, ScheduledPostStatus.SCHEDULED);

                    if (!stillScheduled) {
                        // Xóa content và set DELETED
                        var post = scheduledPost.getPost();
                        post.setContent(null);
                        post.setStatus(PostStatus.DELETED); // giả sử bạn có enum PostStatus
                        // Có thể xóa luôn hashtag/title... nếu muốn
                        // post.setTitle(null);
                        // post.setHashtag(null);

                        // Lưu lại post
                        scheduledPostRepository.save(scheduledPost); // lưu lại scheduled trước
                        // cần inject thêm IPostRepository để lưu post
                        postService.save(post);

                        logger.info("Post {} đã không còn được lên lịch, set DELETED", postId);
                    }
//                }

            } catch (Exception e) {
                logger.error("Schedule {} failed: {}", scheduledPost.getId(), e.getMessage(), e);
                scheduledPost.setStatus(ScheduledPostStatus.FAILED);
                scheduledPost.setPostedAt(LocalDateTime.now());
                scheduledPostRepository.save(scheduledPost);
            }
        }
    }


}
