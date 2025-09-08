package com.codegym.auto_marketing_server.controller.publish;

import com.codegym.auto_marketing_server.dto.InsightDTO;
import com.codegym.auto_marketing_server.entity.PostInsight;
import com.codegym.auto_marketing_server.repository.IPostTargetRepository;
import com.codegym.auto_marketing_server.service.IPostInsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class PostInsightController {
    private final IPostInsightService postInsightService;
    private final IPostTargetRepository postTargetRepository;

    @GetMapping("/{targetId}")
    public ResponseEntity<InsightDTO> getInsights(@PathVariable Long targetId) {
        return postTargetRepository.findById(targetId)
                .map(target -> ResponseEntity.ok(postInsightService.updateInsights(target)))
                .orElse(ResponseEntity.notFound().build());
    }
}
