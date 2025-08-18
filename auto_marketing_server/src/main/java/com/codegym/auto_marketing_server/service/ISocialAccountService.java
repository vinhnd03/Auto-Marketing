package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.SocialAccount;

import java.util.Optional;

public interface ISocialAccountService {
    boolean isLinked(Long userId);
    Optional<SocialAccount> getByUserId(Long userId);
    SocialAccount save(SocialAccount account);
}
