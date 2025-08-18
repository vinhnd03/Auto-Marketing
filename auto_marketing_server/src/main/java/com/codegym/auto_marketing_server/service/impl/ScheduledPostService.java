package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.ScheduleRequestDTO;
import com.codegym.auto_marketing_server.entity.Fanpage;
import com.codegym.auto_marketing_server.entity.Post;
import com.codegym.auto_marketing_server.entity.PostTarget;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.enums.ScheduledPostStatus;
import com.codegym.auto_marketing_server.repository.IFanpageRepository;
import com.codegym.auto_marketing_server.repository.IPostRepository;
import com.codegym.auto_marketing_server.repository.IPostTargetRepository;
import com.codegym.auto_marketing_server.repository.IScheduledPostRepository;
import com.codegym.auto_marketing_server.service.IScheduledPostService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduledPostService implements IScheduledPostService {
    private final IScheduledPostRepository scheduledPostRepository;
    private final IPostRepository postRepository;
    private final IFanpageRepository fanpageRepository;
    private final IPostTargetRepository postTargetRepository;

    @Transactional
    @Override
    public ScheduledPost createSchedule(ScheduleRequestDTO req) {
        Post post = postRepository.findById(req.postId())
                .orElseThrow(() -> new RuntimeException("Post không tồn tại"));

        ScheduledPost scheduledPost = new ScheduledPost();
        scheduledPost.setPost(post);
        scheduledPost.setScheduledTime(req.scheduledTime());
        scheduledPost.setStatus(ScheduledPostStatus.SCHEDULED);
        scheduledPost = scheduledPostRepository.save(scheduledPost);

        //tọa targets
        List<PostTarget> postTargetList = new ArrayList<>();
        for (Long fpId: req.fanpageIds()){
            Fanpage fanpage = fanpageRepository.findById(fpId)
                    .orElseThrow(() -> new RuntimeException("Fanpage không tồn tại: " + fpId));
            PostTarget postTarget = new PostTarget();
            postTarget.setScheduledPost(scheduledPost);
            postTarget.setFanpage(fanpage);
            postTargetList.add(postTarget);
        }
        postTargetRepository.saveAll(postTargetList);
        return scheduledPost;
    }

    @Override
    public List<ScheduledPost> getPublishedPosts() {
        return scheduledPostRepository.findByStatusOrderByScheduledTimeAsc(ScheduledPostStatus.SCHEDULED);
    }

    @Override
    public Optional<ScheduledPost> getById(Long id) {
        return scheduledPostRepository.findById(id);
    }

    @Override
    public ScheduledPost save(ScheduledPost scheduledPost) {
        return scheduledPostRepository.save(scheduledPost);
    }

    @Override
    public void delete(Long id) {
        scheduledPostRepository.deleteById(id);
    }

    @Override
    public ScheduledPost updateScheduledPost(Long id, ScheduledPost updated) {
        return scheduledPostRepository.findById(id).map(existing -> {
            // Cập nhật thời gian và trạng thái
            existing.setScheduledTime(updated.getScheduledTime());
            existing.setStatus(updated.getStatus());

            // Nếu có thông tin Post để update
            if (updated.getPost() != null) {
                Post postToUpdate = existing.getPost();

                if (postToUpdate == null) {
                    // Nếu chưa có Post thì gán luôn
                    existing.setPost(updated.getPost());
                } else {
                    postToUpdate.setTitle(updated.getPost().getTitle());
                    postToUpdate.setContent(updated.getPost().getContent());
                    postToUpdate.setHashtag(updated.getPost().getHashtag());
                    postToUpdate.setTone(updated.getPost().getTone());
                    postToUpdate.setContentType(updated.getPost().getContentType());
                    postToUpdate.setTargetAudience(updated.getPost().getTargetAudience());
                    postToUpdate.setUpdatedAt(LocalDate.now());
                    postRepository.save(postToUpdate);
                }
            }

            return scheduledPostRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("ScheduledPost not found"));
    }
}
