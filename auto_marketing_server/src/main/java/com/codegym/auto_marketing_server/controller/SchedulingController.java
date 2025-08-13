package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.SchedulePostRequestDTO;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.enums.ScheduledPostStatus;
import com.codegym.auto_marketing_server.service.IScheduledPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/scheduling")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Scheduling", description = "Post Scheduling and Management")
public class SchedulingController {

    private final IScheduledPostService scheduledPostService;

    @PostMapping("/schedule")
    @Operation(
            summary = "Schedule a post for publishing",
            description = "Schedule a post to be published at a specific time to selected fanpages"
    )
    public ResponseEntity<ScheduledPost> schedulePost(
            @Valid @RequestBody SchedulePostRequestDTO request) {

        log.info("📅 Scheduling post ID: {} for time: {}",
                request.getPostId(), request.getScheduledTime());

        ScheduledPost scheduledPost = scheduledPostService.schedulePost(request);
        return ResponseEntity.ok(scheduledPost);
    }

    @GetMapping("/status/{status}")
    @Operation(
            summary = "Get scheduled posts by status",
            description = "Retrieve scheduled posts filtered by status"
    )
    public ResponseEntity<List<ScheduledPost>> getScheduledPostsByStatus(
            @Parameter(description = "Scheduled post status") @PathVariable ScheduledPostStatus status) {

        List<ScheduledPost> posts = scheduledPostService.getScheduledPostsByStatus(status);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/time-range")
    @Operation(
            summary = "Get scheduled posts by time range",
            description = "Retrieve scheduled posts within a specific time range"
    )
    public ResponseEntity<List<ScheduledPost>> getScheduledPostsByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        List<ScheduledPost> posts = scheduledPostService.getScheduledPostsByTimeRange(start, end);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{scheduledPostId}/cancel")
    @Operation(
            summary = "Cancel a scheduled post",
            description = "Cancel a scheduled post before it gets published"
    )
    public ResponseEntity<ScheduledPost> cancelScheduledPost(
            @Parameter(description = "Scheduled post ID") @PathVariable Long scheduledPostId) {

        ScheduledPost cancelledPost = scheduledPostService.cancelScheduledPost(scheduledPostId);
        return ResponseEntity.ok(cancelledPost);
    }

    @PutMapping("/{scheduledPostId}/reschedule")
    @Operation(
            summary = "Reschedule a post",
            description = "Change the scheduled time for a post"
    )
    public ResponseEntity<ScheduledPost> reschedulePost(
            @Parameter(description = "Scheduled post ID") @PathVariable Long scheduledPostId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newTime) {

        ScheduledPost rescheduledPost = scheduledPostService.reschedulePost(scheduledPostId, newTime);
        return ResponseEntity.ok(rescheduledPost);
    }

    @PostMapping("/execute")
    @Operation(
            summary = "Execute scheduled posts (Manual trigger)",
            description = "Manually trigger execution of due scheduled posts"
    )
    public ResponseEntity<String> executeScheduledPosts() {
        scheduledPostService.executeScheduledPosts();
        return ResponseEntity.ok("Scheduled posts execution triggered");
    }
}
