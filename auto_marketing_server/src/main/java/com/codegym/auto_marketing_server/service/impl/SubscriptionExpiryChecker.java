package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.enums.SubscriptionStatus;
import com.codegym.auto_marketing_server.repository.ISubscriptionRepository;
import com.codegym.auto_marketing_server.security.email.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionExpiryChecker {

    private final ISubscriptionRepository subscriptionRepository;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 0 * * ?") // chạy mỗi ngày lúc 0h
    public void checkExpiredSubscriptions() {
        LocalDate today = LocalDate.now();
        List<Subscription> expiredSubs = subscriptionRepository
                .findAllByStatusAndEndDateLessThanEqual(SubscriptionStatus.SUCCESS, today);

        for (Subscription sub : expiredSubs) {
            // Cập nhật trạng thái
            sub.setStatus(SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(sub);

            // Gửi email thông báo
            try {
                emailService.sendSubscriptionExpiryEmail(
                        sub.getUser().getEmail(),
                        sub.getUser().getName(),
                        sub.getPlan().getName(),
                        sub.getEndDate()
                );
            } catch (MessagingException e) {
                // Log lỗi gửi email
                System.err.println("Lỗi gửi email hết hạn cho user " + sub.getUser().getEmail() + ": " + e.getMessage());
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
