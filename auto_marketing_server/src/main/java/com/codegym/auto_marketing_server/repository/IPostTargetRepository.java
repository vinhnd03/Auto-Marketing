package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.PostTarget;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPostTargetRepository extends JpaRepository<PostTarget,Long> {
    List<PostTarget> findByScheduledPost(ScheduledPost scheduledPost);
}
