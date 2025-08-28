package com.codegym.auto_marketing_server.scheduler;

import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.enums.SubscriptionStatus;
import com.codegym.auto_marketing_server.enums.WorkspaceStatus;
import com.codegym.auto_marketing_server.repository.ISubscriptionRepository;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import com.codegym.auto_marketing_server.service.IWorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SubscriptionScheduler {
    private final ISubscriptionService subscriptionService;
    private final IWorkspaceService workspaceService;


    @Scheduled(cron = "0 0 0 * * *") // 0h mỗi ngày
    public void extendPendingSubscriptions() {
        List<Subscription> pendingSubs = subscriptionService.findByStatus(SubscriptionStatus.PENDING.name());
        for (Subscription sub : pendingSubs) {
            sub.setEndDate(sub.getEndDate().plusDays(1));
        }
        subscriptionService.saveAll(pendingSubs);
    }


    @Scheduled(cron = "0 0 0 * * *")
//    @Scheduled(cron = "*/10 * * * * *") // For Test Purpose Only
    public void activateNextSubscription() {
        List<Subscription> activeSubs = subscriptionService.findByStatus(SubscriptionStatus.SUCCESS.name());
        for (Subscription active : activeSubs) {
            // Nếu gói đã hết hạn tính đến hôm nay
            if (!active.getEndDate().isAfter(LocalDate.now())) {
                active.setStatus(SubscriptionStatus.FAIL);
                subscriptionService.save(active);
                Long userId = active.getUser().getId();
                List<Workspace> wsList = workspaceService.searchWorkspaceByUserId(userId);
                for (Workspace ws : wsList) {
                    ws.setStatus(WorkspaceStatus.INACTIVE);
                    workspaceService.save(ws);
                }

                // Kiểm tra gói pending tiếp theo
                List<Subscription> pendings = subscriptionService.findPendingByUserIdOrderByLevel(userId);
                if (!pendings.isEmpty()) {
                    // => Nếu có pending thì kích hoạt gói mới
                    Subscription next = pendings.get(0);
                    next.setActivatedAt(LocalDate.now());
                    next.setStatus(SubscriptionStatus.SUCCESS);
                    subscriptionService.save(next);

                    // Sau khi kích hoạt gói mới thì bật lại tất cả workspace
                    for (Workspace ws : wsList) {
                        ws.setStatus(WorkspaceStatus.ACTIVE);
                        workspaceService.save(ws);
                    }

                } else {
                    // => Không còn gói nào: disable toàn bộ workspace
                    for (Workspace ws : wsList) {
                        ws.setStatus(WorkspaceStatus.INACTIVE);
                        workspaceService.save(ws);
                    }
                }
            }
        }
    }
}