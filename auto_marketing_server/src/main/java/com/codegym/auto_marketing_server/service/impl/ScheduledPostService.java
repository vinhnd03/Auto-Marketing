package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.IScheduledPostRepository;
import com.codegym.auto_marketing_server.service.IScheduledPostService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ScheduledPostService implements IScheduledPostService {
    private final IScheduledPostRepository scheduledPostRepository;
}
