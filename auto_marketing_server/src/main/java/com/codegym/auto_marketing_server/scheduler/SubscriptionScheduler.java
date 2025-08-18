package com.codegym.auto_marketing_server.scheduler;

import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.enums.SubscriptionStatus;
import com.codegym.auto_marketing_server.repository.ISubscriptionRepository;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SubscriptionScheduler {
    private final ISubscriptionService subscriptionService;


    @Scheduled(cron = "0 0 0 * * *") // 0h mỗi ngày
    public void extendPendingSubscriptions() {
        List<Subscription> pendingSubs = subscriptionService.findByStatus(SubscriptionStatus.PENDING.name());
        for (Subscription sub : pendingSubs) {
            sub.setEndDate(sub.getEndDate().plusDays(1));
        }
        subscriptionService.saveAll(pendingSubs);
    }

    @Scheduled(cron = "0 5 0 * * *") // 0h05 mỗi ngày
    public void activateNextSubscription() {
        List<Subscription> activeSubs = subscriptionService.findByStatus(SubscriptionStatus.SUCCESS.name());
        for (Subscription active : activeSubs) {
            if (!active.getEndDate().isAfter(LocalDate.now())) {
                active.setStatus(SubscriptionStatus.FAIL);
                subscriptionService.save(active);

                List<Subscription> pendings = subscriptionService
                        .findPendingByUserIdOrderByLevel(active.getUser().getId());
                if (!pendings.isEmpty()) {
                    Subscription next = pendings.get(0);
                    next.setActivatedAt(LocalDate.now());
                    next.setStatus(SubscriptionStatus.SUCCESS);
                    subscriptionService.save(next);
                }
            }
        }
    }
}
