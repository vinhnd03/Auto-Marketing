package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.dto.SocialAccountDTO;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ISocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    Optional<SocialAccount> findByUserId(Long userId);
    Optional<SocialAccount> findByUserIdAndPlatform(Long userId, String platform);
    List<SocialAccount> findByPlatformAndExpiresAtBefore(String platform, LocalDateTime expiresAt);

    @Query(value = "SELECT sa.id, sa.platform, sa.account_name\n" +
            "FROM social_accounts sa\n" +
            "WHERE sa.user_id = :userId;", nativeQuery = true)
    List<SocialAccountDTO> getSocialAccountsByUserId(@Param("userId") Long userId);
}
