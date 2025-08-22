package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.ScheduleRequestDTO;
import com.codegym.auto_marketing_server.dto.ScheduledPostDTO;
import com.codegym.auto_marketing_server.entity.ScheduledPost;

import java.util.List;
import java.util.Optional;

public interface IScheduledPostService {
    ScheduledPost createSchedule(ScheduleRequestDTO req);
    List<ScheduledPostDTO> getPublishedPosts();
    Optional<ScheduledPost> getById(Long id);
    ScheduledPost save(ScheduledPost scheduledPost);
    void delete(Long id);
    ScheduledPost updateScheduledPost(Long id, ScheduleRequestDTO updated);
}
