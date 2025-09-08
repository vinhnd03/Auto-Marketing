package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.PostInsight;
import com.codegym.auto_marketing_server.entity.PostTarget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IPostInsightRepository extends JpaRepository<PostInsight, Long> {
    Optional<PostInsight> findByPostTarget(PostTarget target);
}