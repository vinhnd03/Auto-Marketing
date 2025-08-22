package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Post;
import com.codegym.auto_marketing_server.entity.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPostMediaRepository extends JpaRepository<PostMedia,Long> {
    List<PostMedia> findByPostId(Long postId);
    void deleteByPost(Post post);
}
