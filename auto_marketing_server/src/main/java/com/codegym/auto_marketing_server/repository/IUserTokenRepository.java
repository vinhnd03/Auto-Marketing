package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.entity.UserToken;
import com.codegym.auto_marketing_server.enums.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IUserTokenRepository extends JpaRepository<UserToken, Long> {
    List<UserToken> findAllByUserAndStatusTrue(User user);

    List<UserToken> findAllByUserAndTokenTypeAndStatusIsTrue(User user, TokenType tokenType);
    Optional<UserToken> findByTokenHash(String token);
}
