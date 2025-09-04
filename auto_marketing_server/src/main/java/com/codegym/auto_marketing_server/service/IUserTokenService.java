package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.entity.UserToken;
import com.codegym.auto_marketing_server.enums.TokenType;

import java.util.Optional;

public interface IUserTokenService {
    String generateToken(User user, TokenType tokenType);

    String hashToken(String token);

    Optional<UserToken> findByToken(String token);

    UserToken save(UserToken userToken);
}
