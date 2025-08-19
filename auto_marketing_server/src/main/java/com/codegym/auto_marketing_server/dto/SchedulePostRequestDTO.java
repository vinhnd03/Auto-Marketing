package com.codegym.auto_marketing_server.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SchedulePostRequestDTO {
    @NotNull(message = "Post ID is required")
    private Long postId;

    @NotEmpty(message = "At least one fanpage must be selected")
    private List<Long> fanpageIds;

    @NotNull(message = "Scheduled Time is required")
    @Future(message = "Scheduled Time must be in the future")
    private LocalDateTime scheduledTime;

    // can modify AI content before scheduling
    private String finalContent;
}
