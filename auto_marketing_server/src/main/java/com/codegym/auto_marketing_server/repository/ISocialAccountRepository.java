package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.dto.SocialAccountDTO;
import com.codegym.auto_marketing_server.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ISocialAccountRepository extends JpaRepository<SocialAccount, Long> {

    @Query(value = "SELECT sa.id, sa.platform, sa.account_name\n" +
            "FROM social_accounts sa\n" +
            "WHERE sa.user_id = :userId;", nativeQuery = true)
    List<SocialAccountDTO> getSocialAccountsByUserId(@Param("userId") Long userId);
}
