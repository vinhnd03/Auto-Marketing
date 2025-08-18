package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Subscription;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ISubscriptionService {
    void save(Subscription subscription);

    void saveAll(List<Subscription> subscriptions);

    Optional<Subscription> findActiveByUserId(Long userId);

    List<Subscription> findByStatus(String status);

    List<Subscription> findPendingByUserIdOrderByLevel(@Param("userId") Long userId);

    Integer findMaxWorkspaceByCurrenSubscription(@Param("id") Long id);

}
