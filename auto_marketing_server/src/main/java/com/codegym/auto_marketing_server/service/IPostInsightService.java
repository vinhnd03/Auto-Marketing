package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.dto.InsightDTO;
import com.codegym.auto_marketing_server.entity.PostInsight;
import com.codegym.auto_marketing_server.entity.PostTarget;

import java.util.Map;

public interface IPostInsightService {
    Map<String, Integer> fetchInsightsFromFacebook(String postId, String pageToken);
    InsightDTO updateInsights(PostTarget target);
}
