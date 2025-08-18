package com.codegym.auto_marketing_server.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ScheduleRequestDTO(
        Long postId,
        LocalDateTime scheduledTime,
        List<Long> fanpageIds,
        List<PostMediaDTO> medias) {
}
