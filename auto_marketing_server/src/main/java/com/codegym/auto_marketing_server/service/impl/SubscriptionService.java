package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.repository.ISubscriptionRepository;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubscriptionService implements ISubscriptionService {
    private final ISubscriptionRepository subscriptionRepository;

    @Override
    public List<Subscription> findAll() {
        return subscriptionRepository.findAll();
    }

    @Override
    public void save(Subscription subscriptions) {
        subscriptionRepository.save(subscriptions);
    }

    @Override
    public Optional<Subscription> findById(Long id) {
        return subscriptionRepository.findById(id);
    }

    @Override
    public void remove(Long id) {
        subscriptionRepository.deleteById(id);
    }
}
