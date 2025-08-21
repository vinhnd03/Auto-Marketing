package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ISocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    Optional<SocialAccount> findByUserId(Long userId);
    Optional<SocialAccount> findByUserIdAndPlatform(Long userId, String platform);
    List<SocialAccount> findByPlatformAndExpiresAtBefore(String platform, LocalDateTime expiresAt);
}
