package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Subscription;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

import com.codegym.auto_marketing_server.entity.Subscription;

import java.util.List;
import java.util.Optional;

public interface ISubscriptionService {
    List<Subscription> findAll();

//    void save(Subscription subscriptions);

    Optional<Subscription> findById(Long id);

    void remove(Long id);

    void save(Subscription subscription);

    void saveAll(List<Subscription> subscriptions);

    Optional<Subscription> findActiveByUserId(Long userId);

    List<Subscription> findByStatus(String status);

    List<Subscription> findPendingByUserIdOrderByLevel( Long userId);

    Integer findMaxWorkspaceByCurrenSubscription( Long id);

    int countSubscriptionByPlantName(String planName, Long userId);

}
