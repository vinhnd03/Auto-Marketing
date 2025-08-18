package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.entity.UserToken;

import java.util.Optional;

public interface IUserTokenService {
    String generateToken(User user);

    String hashToken(String token);

    Optional<UserToken> findByToken(String token);

    UserToken save(UserToken userToken);
}
