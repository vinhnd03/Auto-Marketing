package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.PostActualStatsDTO;
import com.codegym.auto_marketing_server.dto.PostGoalDTO;
import com.codegym.auto_marketing_server.dto.PostTargetDTO;
import com.codegym.auto_marketing_server.entity.PostTarget;
import com.codegym.auto_marketing_server.repository.IPostTargetRepository;
import com.codegym.auto_marketing_server.service.IPostTargetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostTargetService implements IPostTargetService {

    private final IPostTargetRepository postTargetRepository;

    @Override
    @Transactional
    public PostTargetDTO setPostTargetGoals(Long postTargetId, PostGoalDTO goalsDTO) {
        PostTarget postTarget = postTargetRepository.findById(postTargetId)
                .orElseThrow(() -> new RuntimeException("PostTarget not found: " + postTargetId));

        // Chỉ set lượt thích
        postTarget.setTargetLikes(goalsDTO.getLikes());
        postTarget.setGoalsSetAt(LocalDateTime.now());

        PostTarget saved = postTargetRepository.save(postTarget);

        log.info("📊 Goals set for postTarget {}: Likes={}", postTargetId, saved.getTargetLikes());

        return mapToPostTargetDTO(saved);
    }

    @Override
    public PostGoalDTO getPostTargetGoals(Long postTargetId) {
        return postTargetRepository.findById(postTargetId)
                .map(this::mapToGoalDTO)
                .orElse(new PostGoalDTO());
    }

    @Override
    @Transactional
    public void deletePostTargetGoals(Long postTargetId) {
        PostTarget postTarget = postTargetRepository.findById(postTargetId)
                .orElseThrow(() -> new RuntimeException("PostTarget not found: " + postTargetId));

        // Reset goals về 0
        postTarget.setTargetLikes(0);
        postTargetRepository.save(postTarget);

        log.info("🗑️ Goals deleted for postTarget {}", postTargetId);
    }

    @Override
    @Transactional
    public PostTargetDTO updatePostTargetActualStats(Long postTargetId, PostActualStatsDTO statsDTO) {
        PostTarget postTarget = postTargetRepository.findById(postTargetId)
                .orElseThrow(() -> new RuntimeException("PostTarget not found: " + postTargetId));

        // Update actual stats
        postTarget.setActualLikes(statsDTO.getLikes());
        postTarget.setStatsUpdatedAt(LocalDateTime.now());

        PostTarget saved = postTargetRepository.save(postTarget);

        log.info("📈 Actual stats updated for postTarget {}: Likes={}", postTargetId, saved.getActualLikes());

        return mapToPostTargetDTO(saved);
    }

    @Override
    public PostActualStatsDTO getPostTargetActualStats(Long postTargetId) {
        return postTargetRepository.findById(postTargetId)
                .map(this::mapToStatsDTO)
                .orElse(new PostActualStatsDTO());
    }

    @Override
    public PostTargetDTO getPostTargetProgress(Long postTargetId) {
        PostTarget postTarget = postTargetRepository.findById(postTargetId)
                .orElse(null);

        if (postTarget == null) {
            return null;
        }

        return mapToPostTargetDTO(postTarget);
    }

    // Helper methods
    private PostGoalDTO mapToGoalDTO(PostTarget postTarget) {
        PostGoalDTO dto = new PostGoalDTO();
        dto.setLikes(postTarget.getTargetLikes());
        return dto;
    }

    private PostActualStatsDTO mapToStatsDTO(PostTarget postTarget) {
        PostActualStatsDTO dto = new PostActualStatsDTO();
        dto.setLikes(postTarget.getActualLikes());
        return dto;
    }

    private PostTargetDTO mapToPostTargetDTO(PostTarget postTarget) {
        PostTargetDTO dto = new PostTargetDTO();
        dto.setId(postTarget.getId());
        dto.setPostUrl(postTarget.getPostUrl());
        dto.setGoalsSetAt(postTarget.getGoalsSetAt());
        dto.setStatsUpdatedAt(postTarget.getStatsUpdatedAt());

        // Map goals
        dto.setGoals(mapToGoalDTO(postTarget));

        // Map actual stats
        dto.setActualStats(mapToStatsDTO(postTarget));

        // Calculate progress
        dto.setProgress(calculateProgress(dto.getGoals(), dto.getActualStats()));

        return dto;
    }

    private PostTargetDTO.ProgressSummaryDTO calculateProgress(PostGoalDTO goals, PostActualStatsDTO actualStats) {
        PostTargetDTO.ProgressSummaryDTO summary = new PostTargetDTO.ProgressSummaryDTO();

        Double likesProgress = calculatePercentage(actualStats.getLikes(), goals.getLikes());
        summary.setLikesProgress(likesProgress);
        summary.setOverallProgress(likesProgress); // Overall = likes progress

        return summary;
    }

    private Double calculatePercentage(Number actual, Number target) {
        if (target == null || target.doubleValue() == 0) return 0.0;
        if (actual == null) return 0.0;

        return Math.min((actual.doubleValue() / target.doubleValue()) * 100.0, 100.0);
    }
}