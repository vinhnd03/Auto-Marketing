package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.*;
import com.codegym.auto_marketing_server.entity.*;
import com.codegym.auto_marketing_server.enums.PostMediaType;
import com.codegym.auto_marketing_server.enums.ScheduledPostStatus;
import com.codegym.auto_marketing_server.repository.*;
import com.codegym.auto_marketing_server.service.IScheduledPostService;
import com.codegym.auto_marketing_server.util.CloudinaryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
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
    private final IPostMediaRepository postMediaRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    @Override
    public ScheduledPost createSchedule(ScheduleRequestDTO req) {
        Post post;

        if (req.postId() != null) {
            // dùng post có sẵn
            post = postRepository.findById(req.postId())
                    .orElseThrow(() -> new RuntimeException("Post không tồn tại"));
        } else {
            // tạo mới Post
            post = new Post();
            post.setTitle(req.title());
            post.setContent(req.content());
            post.setHashtag(req.hashtag());
            post.setTone(req.tone());
            post.setContentType(req.contentType());
            post.setTargetAudience(req.targetAudience());
            post.setCreatedAt(LocalDate.now());
            post = postRepository.save(post);
        }

        // Lấy collection hiện tại của PostMedia
        List<PostMedia> medias = post.getMedias();
        if (medias == null) {
            medias = new ArrayList<>();
            post.setMedias(medias);
        }

        // Thêm PostMedia từ post.imageUrl nếu chưa có
        String imageUrl = post.getImageUrl();
        if (imageUrl != null && medias.stream().noneMatch(m -> imageUrl.equals(m.getUrl()))) {
            PostMedia mainMedia = new PostMedia();
            mainMedia.setPost(post);
            mainMedia.setType(PostMediaType.PIC);
            mainMedia.setUrl(imageUrl);
            medias.add(mainMedia);
            postMediaRepository.save(mainMedia);
        }

        // Thêm PostMedia từ request nếu có
        if (req.medias() != null && !req.medias().isEmpty()) {
            for (PostMediaDTO m : req.medias()) {
                // tránh trùng với imageUrl
                if (imageUrl != null && imageUrl.equals(m.url())) continue;

                PostMedia media = new PostMedia();
                media.setPost(post);
                media.setType(m.type());
                try {
                    String url = m.url();
                    if (url != null && !url.startsWith("http")) {
                        url = cloudinaryService.uploadImage(new File(url));
                    }
                    media.setUrl(url);
                } catch (Exception e) {
                    throw new RuntimeException("Upload media thất bại: " + e.getMessage());
                }
                medias.add(media);
                postMediaRepository.save(media);
            }
        }

        // Cập nhật lại medias cho post (Hibernate quản lý)
        post.setMedias(medias);
        post = postRepository.save(post);

        // tạo ScheduledPost
        ScheduledPost scheduledPost = new ScheduledPost();
        scheduledPost.setPost(post);
        scheduledPost.setScheduledTime(req.scheduledTime());
        scheduledPost.setStatus(ScheduledPostStatus.SCHEDULED);
        scheduledPost = scheduledPostRepository.save(scheduledPost);

        // tạo PostTarget (fanpages)
        if (req.fanpageIds() != null && !req.fanpageIds().isEmpty()) {
            List<PostTarget> postTargetList = new ArrayList<>();
            for (Long fpId : req.fanpageIds()) {
                Fanpage fanpage = fanpageRepository.findById(fpId)
                        .orElseThrow(() -> new RuntimeException("Fanpage không tồn tại: " + fpId));
                PostTarget postTarget = new PostTarget();
                postTarget.setScheduledPost(scheduledPost);
                postTarget.setFanpage(fanpage);
                postTargetList.add(postTarget);
            }
            postTargetRepository.saveAll(postTargetList);
        }

        return scheduledPost;
    }


    @Override
    public List<ScheduledPostDTO> getPublishedPosts() {
        return scheduledPostRepository
                .findByStatusOrderByScheduledTimeAsc(ScheduledPostStatus.SCHEDULED)
                .stream()
                .map(sp -> {
                    List<FanpageDTO> fanpages = postTargetRepository.findByScheduledPost(sp)
                            .stream()
                            .map(pt -> {
                                Fanpage f = pt.getFanpage();
                                return new FanpageDTO(f.getId(), f.getPageId(), f.getPageName(), f.getAvatarUrl());
                            }).toList();

                    Post post = sp.getPost();
                    PostDTO postDTO = new PostDTO(
                            post.getId(),
                            post.getTitle(),
                            post.getContent(),
                            post.getHashtag(),
                            post.getMedias().stream()
                                    .map(m -> new PostMediaDTO(m.getId(), m.getUrl(), m.getType()))
                                    .toList()
                    );

                    return new ScheduledPostDTO(
                            sp.getId(),
                            postDTO,
                            sp.getScheduledTime(),
                            sp.getStatus().name(),
                            fanpages
                    );
                })
                .toList();
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
        scheduledPostRepository.findById(id).ifPresent(scheduledPost -> {
            scheduledPost.setStatus(ScheduledPostStatus.CANCELLED);
            scheduledPostRepository.save(scheduledPost);
        });
    }
    @Transactional
    @Override
    public ScheduledPost updateScheduledPost(Long id, ScheduleRequestDTO req) {
        return scheduledPostRepository.findById(id).map(existing -> {

            if (existing.getStatus() == ScheduledPostStatus.POSTED) {
                throw new RuntimeException("ScheduledPost đã được đăng, không thể chỉnh sửa");
            }

            existing.setScheduledTime(req.scheduledTime());

            Post postToUpdate = existing.getPost();
            if (postToUpdate == null) {
                throw new RuntimeException("ScheduledPost chưa có Post, FE phải gửi postId");
            }

            // --- Update Post thông tin cơ bản ---
            if (req.title() != null) postToUpdate.setTitle(req.title());
            if (req.content() != null) postToUpdate.setContent(req.content());
            if (req.hashtag() != null) postToUpdate.setHashtag(req.hashtag());
            if (req.tone() != null) postToUpdate.setTone(req.tone());
            if (req.contentType() != null) postToUpdate.setContentType(req.contentType());
            if (req.targetAudience() != null) postToUpdate.setTargetAudience(req.targetAudience());
            postToUpdate.setUpdatedAt(LocalDate.now());

            // --- Update Medias ---
            List<PostMedia> currentMedias = postToUpdate.getMedias() != null ? postToUpdate.getMedias() : new ArrayList<>();
            // Xóa các media không còn trong request
            currentMedias.removeIf(m -> req.medias().stream()
                    .noneMatch(dto -> dto.id() != null && dto.id().equals(m.getId())));

            for (PostMediaDTO dto : req.medias()) {
                if (dto.id() != null) {
                    currentMedias.stream()
                            .filter(m -> m.getId().equals(dto.id()))
                            .findFirst()
                            .ifPresent(m -> {
                                try {
                                    String url = dto.url();
                                    if (url != null && !url.startsWith("http")) {
                                        url = cloudinaryService.uploadImage(new File(url));
                                    }
                                    m.setUrl(url);
                                    m.setType(dto.type());
                                } catch (Exception e) {
                                    throw new RuntimeException("Upload media thất bại: " + e.getMessage());
                                }
                            });
                } else {
                    PostMedia newMedia = new PostMedia();
                    newMedia.setPost(postToUpdate);
                    try {
                        String url = dto.url();
                        if (url != null && !url.startsWith("http")) {
                            url = cloudinaryService.uploadImage(new File(url));
                        }
                        newMedia.setUrl(url);
                    } catch (Exception e) {
                        throw new RuntimeException("Upload media thất bại: " + e.getMessage());
                    }
                    newMedia.setType(dto.type());
                    currentMedias.add(newMedia);
                }
            }
            postToUpdate.setMedias(currentMedias);
            postRepository.save(postToUpdate);

            // --- Update Fanpage targets ---
            List<PostTarget> currentTargets = postTargetRepository.findByScheduledPost(existing);

            // Xóa các target không còn trong request
            currentTargets.stream()
                    .filter(t -> !req.fanpageIds().contains(t.getFanpage().getId()))
                    .forEach(postTargetRepository::delete);

            // Thêm các target mới
            for (Long fpId : req.fanpageIds()) {
                boolean exists = currentTargets.stream()
                        .anyMatch(t -> t.getFanpage().getId().equals(fpId));
                if (!exists) {
                    Fanpage fanpage = fanpageRepository.findById(fpId)
                            .orElseThrow(() -> new RuntimeException("Fanpage không tồn tại: " + fpId));
                    PostTarget newTarget = new PostTarget();
                    newTarget.setScheduledPost(existing);
                    newTarget.setFanpage(fanpage);
                    postTargetRepository.save(newTarget);
                }
            }

            return scheduledPostRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("ScheduledPost not found"));
    }



}
