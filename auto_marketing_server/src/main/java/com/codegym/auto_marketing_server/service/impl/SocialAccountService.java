package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.repository.ISocialAccountRepository;
import com.codegym.auto_marketing_server.repository.IUserRepository;
import com.codegym.auto_marketing_server.service.ISocialAccountService;
import com.codegym.auto_marketing_server.service.impl.facebook.FacebookClient;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SocialAccountService implements ISocialAccountService {
    private final ISocialAccountRepository socialAccountRepository;
    private final FacebookClient facebookClient;

    @Value("${app.facebook.appId}")
    private String appId;
    @Value("${app.facebook.appSecret}")
    private String appSecret;
    @Override
    public boolean isLinked(Long userId) {
        return socialAccountRepository.findByUserId(userId).isPresent();
    }

    @Override
    public Optional<SocialAccount> getByUserId(Long userId) {
        return socialAccountRepository.findByUserId(userId);
    }

    @Override
    public SocialAccount save(SocialAccount account) {
        return socialAccountRepository.save(account);
    }
    public SocialAccount refreshFacebookToken(Long userId) {
        SocialAccount account = socialAccountRepository.findByUserIdAndPlatform(userId, "facebook")
                .orElseThrow(() -> new RuntimeException("Facebook account not linked"));

        return refreshAccountToken(account);
    }

    public SocialAccount refreshAccountToken(SocialAccount account) {
        FacebookClient.FacebookTokenResponse tokenResp = facebookClient.refreshUserToken(
                appId, appSecret, account.getAccessToken()
        );

        account.setAccessToken(tokenResp.access_token());
        account.setExpiresAt(LocalDateTime.now().plusSeconds(tokenResp.expires_in()));
        return socialAccountRepository.save(account);
    }

    // Lấy tất cả tài khoản FB sắp hết hạn
    public List<SocialAccount> findFacebookAccountsExpiringSoon(int daysBefore) {
        LocalDateTime threshold = LocalDateTime.now().plusDays(daysBefore);
        return socialAccountRepository.findByPlatformAndExpiresAtBefore("facebook", threshold);
    }

}
