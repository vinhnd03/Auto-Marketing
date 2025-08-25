package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Subscription;

import java.util.List;
import java.util.Optional;

public interface ISubscriptionService {
    List<Subscription> findAll();

    void save(Subscription subscriptions);

    Optional<Subscription> findById(Long id);

    void remove(Long id);

}
