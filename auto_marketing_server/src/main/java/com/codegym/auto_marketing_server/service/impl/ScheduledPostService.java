package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.service.IPostService;
import com.codegym.auto_marketing_server.service.IScheduledPostService;
import org.springframework.stereotype.Service;

@Service
public class ScheduledPostService implements IScheduledPostService {
    private final IPostService postService;

    public ScheduledPostService(IPostService postService) {
        this.postService = postService;
    }
}

