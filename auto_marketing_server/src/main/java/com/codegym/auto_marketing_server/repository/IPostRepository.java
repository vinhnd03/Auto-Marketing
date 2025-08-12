package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPostRepository extends JpaRepository<Post, Long> {
}
