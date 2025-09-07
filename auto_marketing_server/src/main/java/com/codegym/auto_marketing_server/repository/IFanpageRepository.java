package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Fanpage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IFanpageRepository extends JpaRepository<Fanpage, Long> {
    @Query("SELECT f FROM Fanpage f WHERE f.socialAccount.id = :socialAccountId AND f.active = true")
    List<Fanpage> findBySocialAccountId(Long socialAccountId);

    List<Fanpage> findByPageId(String pageId);
    @Query("SELECT f FROM Fanpage f WHERE f.socialAccount.user.id = :userId")

    List<Fanpage> findByUserId(Long userId);

    Optional<Fanpage> findByPageIdAndSocialAccountId(String pageId, Long socialAccountId);
}
