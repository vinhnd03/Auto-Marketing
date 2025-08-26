package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.User;

import java.util.Optional;

public interface ISocialAccountService {
    boolean isLinked(Long userId);
    Optional<SocialAccount> getByUserId(Long userId);
    SocialAccount save(SocialAccount account);

    SocialAccount findById(Long id);

    Boolean checkExistingSocialAccounts(Long userId);

    SocialAccount saveFacebookAccount(User user, String shortLivedToken, String accountName, String providerId);
}
