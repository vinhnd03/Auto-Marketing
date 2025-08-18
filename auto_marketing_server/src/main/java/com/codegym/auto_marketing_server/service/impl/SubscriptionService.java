package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.ISubscriptionRepository;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class SubscriptionService implements ISubscriptionService {
    private final ISubscriptionRepository subscriptionRepository;

}
