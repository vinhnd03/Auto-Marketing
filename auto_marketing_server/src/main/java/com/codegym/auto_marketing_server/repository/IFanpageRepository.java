package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Fanpage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IFanpageRepository extends JpaRepository<Fanpage, Long> {
    List<Fanpage> findBySocialAccountId(Long socialAccountId);

    List<Fanpage> findByPageId(String pageId);
}
