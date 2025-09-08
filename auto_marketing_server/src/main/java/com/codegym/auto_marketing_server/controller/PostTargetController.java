package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.PostActualStatsDTO;
import com.codegym.auto_marketing_server.dto.PostGoalDTO;
import com.codegym.auto_marketing_server.dto.PostTargetDTO;
import com.codegym.auto_marketing_server.service.IPostTargetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/post-targets")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Post Targets", description = "Post Target Goals Management")
public class PostTargetController {

    private final IPostTargetService postTargetService;

    @PostMapping("/{postTargetId}/goals")
    @Operation(summary = "Set goals for post target", description = "Set target metrics for a specific post target (fanpage)")
    public ResponseEntity<PostTargetDTO> setPostTargetGoals(
            @PathVariable Long postTargetId,
            @Valid @RequestBody PostGoalDTO goalsDTO) {
        PostTargetDTO result = postTargetService.setPostTargetGoals(postTargetId, goalsDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{postTargetId}/goals")
    @Operation(summary = "Get post target goals", description = "Retrieve target metrics for a specific post target")
    public ResponseEntity<PostGoalDTO> getPostTargetGoals(@PathVariable Long postTargetId) {
        PostGoalDTO goals = postTargetService.getPostTargetGoals(postTargetId);
        return ResponseEntity.ok(goals);
    }

    @DeleteMapping("/{postTargetId}/goals")
    @Operation(summary = "Delete post target goals", description = "Remove target metrics for a specific post target")
    public ResponseEntity<Void> deletePostTargetGoals(@PathVariable Long postTargetId) {
        postTargetService.deletePostTargetGoals(postTargetId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postTargetId}/actual-stats")
    @Operation(summary = "Update actual stats", description = "Update actual performance metrics for a specific post target")
    public ResponseEntity<PostTargetDTO> updatePostTargetActualStats(
            @PathVariable Long postTargetId,
            @Valid @RequestBody PostActualStatsDTO statsDTO) {
        PostTargetDTO result = postTargetService.updatePostTargetActualStats(postTargetId, statsDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{postTargetId}/actual-stats")
    @Operation(summary = "Get actual stats", description = "Retrieve actual performance metrics for a specific post target")
    public ResponseEntity<PostActualStatsDTO> getPostTargetActualStats(@PathVariable Long postTargetId) {
        PostActualStatsDTO stats = postTargetService.getPostTargetActualStats(postTargetId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{postTargetId}/progress")
    @Operation(summary = "Get post target progress", description = "Get progress comparison between goals and actual stats for a specific post target")
    public ResponseEntity<PostTargetDTO> getPostTargetProgress(@PathVariable Long postTargetId) {
        PostTargetDTO progress = postTargetService.getPostTargetProgress(postTargetId);
        return ResponseEntity.ok(progress);
    }
}