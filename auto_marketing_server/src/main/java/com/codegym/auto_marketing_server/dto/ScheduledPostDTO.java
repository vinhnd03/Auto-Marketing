package com.codegym.auto_marketing_server.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ScheduledPostDTO(
        Long id,
        PostDTO post,
        LocalDateTime scheduledTime,
        String status,
//        List<Long> fanpageIds
        List<FanpageDTO> fanpages
) {}