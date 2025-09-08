package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.PostActualStatsDTO;
import com.codegym.auto_marketing_server.dto.PostGoalDTO;
import com.codegym.auto_marketing_server.dto.PostTargetDTO;

public interface IPostTargetService {
    PostTargetDTO setPostTargetGoals(Long postTargetId, PostGoalDTO goalsDTO);

    PostGoalDTO getPostTargetGoals(Long postTargetId);

    void deletePostTargetGoals(Long postTargetId);

    PostTargetDTO updatePostTargetActualStats(Long postTargetId, PostActualStatsDTO statsDTO);

    PostActualStatsDTO getPostTargetActualStats(Long postTargetId);

    PostTargetDTO getPostTargetProgress(Long postTargetId);
}