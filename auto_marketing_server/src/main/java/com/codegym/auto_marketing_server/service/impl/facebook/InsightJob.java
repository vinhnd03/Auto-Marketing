package com.codegym.auto_marketing_server.service.impl.facebook;

import com.codegym.auto_marketing_server.entity.PostTarget;
import com.codegym.auto_marketing_server.repository.IPostTargetRepository;
import com.codegym.auto_marketing_server.service.IPostInsightService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class InsightJob {
    private static final Logger logger = LoggerFactory.getLogger(InsightJob.class);
    private final IPostTargetRepository postTargetRepository;
    private final IPostInsightService postInsightService;

    @Scheduled(cron = "0 0 * * * *") // mỗi giờ
    public void run() {
        List<PostTarget> targets = postTargetRepository.findAll();
        for (PostTarget target : targets) {
            if (target.getPostUrl() != null) {
                try {
                    postInsightService.updateInsights(target);
                    logger.info("Updated insights for post {}", target.getPostUrl());
                } catch (Exception e) {
                    logger.error("Failed to update insights for post {}: {}", target.getPostUrl(), e.getMessage());
                }
            }
        }
    }
}
