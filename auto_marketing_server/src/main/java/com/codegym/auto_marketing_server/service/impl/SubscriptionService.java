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

//    @Override
//    public void save(Subscription subscriptions) {
//        subscriptionRepository.save(subscriptions);
//    }

    @Override
    public Optional<Subscription> findById(Long id) {
        return subscriptionRepository.findById(id);
    }

    @Override
    public void remove(Long id) {
        subscriptionRepository.deleteById(id);
    }

    @Override
    public void save(Subscription subscription) {
        subscriptionRepository.save(subscription);
    }

    @Override
    public void saveAll(List<Subscription> subscriptions) {
        subscriptionRepository.saveAll(subscriptions);
    }

    @Override
    public Optional<Subscription> findActiveByUserId(Long userId) {
        return subscriptionRepository.findActiveByUserId(userId);
    }

    @Override
    public List<Subscription> findByStatus(String status) {
        return subscriptionRepository.findByStatus(status);
    }

    @Override
    public List<Subscription> findPendingByUserIdOrderByLevel(Long userId) {
        return subscriptionRepository.findPendingByUserIdOrderByLevel(userId);
    }

    @Override
    public Integer findMaxWorkspaceByCurrenSubscription(Long id) {
        return subscriptionRepository.findMaxWorkspaceByCurrenSubscription(id);
    }

    @Override
    public int countSubscriptionByPlantName(String planName, Long userId) {
        return subscriptionRepository.countSubscriptionByPlantName(planName,userId);
    }
}
