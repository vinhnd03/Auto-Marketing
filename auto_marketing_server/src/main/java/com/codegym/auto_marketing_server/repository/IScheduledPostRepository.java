package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.enums.ScheduledPostStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface IScheduledPostRepository extends JpaRepository<ScheduledPost, Long> {
    List<ScheduledPost> findByStatus(ScheduledPostStatus status);

    List<ScheduledPost> findByScheduledTimeBetween(LocalDateTime start, LocalDateTime end);

    List<ScheduledPost> findByPostId(Long postId);
}
