package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Post;
import com.codegym.auto_marketing_server.enums.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPostRepository extends JpaRepository<Post, Long> {
    List<Post> findByTopicId(Long topicId);

    List<Post> findByTopicIdAndStatus(Long topicId, PostStatus status);

    List<Post> findByGeneratedByAI(Boolean generatedByAI);
}
