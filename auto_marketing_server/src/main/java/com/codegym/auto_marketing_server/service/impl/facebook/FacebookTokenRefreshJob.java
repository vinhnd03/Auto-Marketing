package com.codegym.auto_marketing_server.service.impl.facebook;

import com.codegym.auto_marketing_server.entity.SocialAccount;
import com.codegym.auto_marketing_server.service.impl.SocialAccountService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FacebookTokenRefreshJob {
    private static final Logger logger = LoggerFactory.getLogger(FacebookTokenRefreshJob.class);
    private final SocialAccountService socialAccountService;

    // Chạy mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * *")
    public void autoRefreshTokens() {
        logger.info("=== Bắt đầu job refresh token Facebook ===");
        List<SocialAccount> accounts = socialAccountService.findFacebookAccountsExpiringSoon(5);

        for (SocialAccount account : accounts) {
            try {
                socialAccountService.refreshAccountToken(account);
                logger.info("Đã refresh token cho account {} (userId={})",
                        account.getAccountName(), account.getUser().getId());
            } catch (Exception e) {
                logger.error("Lỗi refresh token cho account {}: {}", account.getAccountName(), e.getMessage());
            }
        }
        logger.info("=== Hoàn thành job refresh token Facebook ===");
    }
}

