package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.SchedulePostRequestDTO;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.enums.ScheduledPostStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface IScheduledPostService {
    ScheduledPost schedulePost(SchedulePostRequestDTO request);

    List<ScheduledPost> getScheduledPostsByStatus(ScheduledPostStatus status);

    List<ScheduledPost> getScheduledPostsByTimeRange(LocalDateTime start, LocalDateTime end);

    void executeScheduledPosts();

    ScheduledPost cancelScheduledPost(Long scheduledPostId);

    ScheduledPost reschedulePost(Long scheduledPostId, LocalDateTime newTime);
}
