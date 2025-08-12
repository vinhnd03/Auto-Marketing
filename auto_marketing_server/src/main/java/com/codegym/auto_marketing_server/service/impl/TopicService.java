package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.ITopicRepository;
import com.codegym.auto_marketing_server.service.ITopicService;
import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
public class TopicService implements ITopicService {
    private final ITopicRepository topicRepository;
}
