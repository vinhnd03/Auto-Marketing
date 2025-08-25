package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.repository.ISocialAccountRepository;
import com.codegym.auto_marketing_server.security.oauth2.FacebookTokenData;
import com.codegym.auto_marketing_server.service.ISocialAccountService;
import com.codegym.auto_marketing_server.service.impl.facebook.FacebookClient;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
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
    @Override
    public SocialAccount findById(Long id) {
        return socialAccountRepository.findById(id).orElse(null);
    }

    @Override
    public Boolean checkExistingSocialAccounts(Long userId) {
        Optional<SocialAccount> socialAccount = socialAccountRepository.findByUserId(userId);
        return socialAccount.isPresent();
    }

    @Override
    public SocialAccount saveFacebookAccount(User user, String shortLivedToken, String accountName, String providerId) {
        FacebookTokenData dataToken = exchangeFacebookToken(shortLivedToken);

        SocialAccount socialAccount = new SocialAccount();
        socialAccount.setPlatform("facebook");
        socialAccount.setAccountName(accountName);
        socialAccount.setPlatformAccountId(providerId);
        socialAccount.setAccessToken(dataToken.token());
        socialAccount.setExpiresAt(dataToken.expiry() != null
                ? LocalDateTime.ofInstant(dataToken.expiry(), ZoneId.systemDefault())
                : null);
        socialAccount.setUser(user);

        return socialAccountRepository.save(socialAccount);
    }

    private FacebookTokenData exchangeFacebookToken(String shortLivedToken) {
        String url = "https://graph.facebook.com/v23.0/oauth/access_token"
                + "?grant_type=fb_exchange_token"
                + "&client_id=" + appId
                + "&client_secret=" + appSecret
                + "&fb_exchange_token=" + shortLivedToken;

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> result = restTemplate.getForObject(url, Map.class);

        if (result != null && result.get("access_token") != null) {
            String longLivedToken = (String) result.get("access_token");

            Instant expiry = null;
            if (result.get("expires_in") != null) {
                long expiresInSec = ((Number) result.get("expires_in")).longValue();
                expiry = Instant.now().plusSeconds(expiresInSec);
            }

            return new FacebookTokenData(longLivedToken, expiry);
        }
        return new FacebookTokenData(shortLivedToken, null);
    }
}
