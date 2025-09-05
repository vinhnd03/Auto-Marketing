package com.codegym.auto_marketing_server.dto;

import com.codegym.auto_marketing_server.entity.PostTarget;

import java.time.LocalDateTime;
import java.util.List;

public record ScheduledPostDTO(
        Long id,
        PostDTO post,
        LocalDateTime scheduledTime,
        String status,
//        List<Long> fanpageIds
        List<FanpageDTO> fanpages,
        LocalDateTime postedAt
) {}