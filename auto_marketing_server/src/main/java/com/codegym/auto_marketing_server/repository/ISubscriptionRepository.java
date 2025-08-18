package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ISubscriptionRepository extends JpaRepository<Subscription, Long> {

}
