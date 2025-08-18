package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.PostTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPostTargetRepository extends JpaRepository<PostTarget, Long> {
    List<PostTarget> findByScheduledPostId(Long scheduledPostId);

    List<PostTarget> findByFanpageId(Long fanpageId);
}