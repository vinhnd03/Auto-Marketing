package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ITopicRepository extends JpaRepository<Topic, Long> {
}
