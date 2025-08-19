package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPostMediaRepository extends JpaRepository<PostMedia,Long> {
}
