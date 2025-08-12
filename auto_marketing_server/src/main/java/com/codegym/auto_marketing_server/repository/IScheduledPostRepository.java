package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.ScheduledPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IScheduledPostRepository extends JpaRepository<ScheduledPost,Long> {
}
