package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISocialAccountRepository extends JpaRepository<SocialAccount, Long> {
}
