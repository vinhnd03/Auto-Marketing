package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.enums.SubscriptionStatus;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import com.codegym.auto_marketing_server.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubscriptionManagementService {
    private final ISubscriptionService subscriptionService;
    private final IUserService userService;

    @Transactional
    public void purchasePlan(Long userId, Plan newPlan) {
        Optional<Subscription> currentActiveOpt = subscriptionService.findActiveByUserId(userId);

        if (currentActiveOpt.isEmpty()) {
            activateNewSubscription(userId, newPlan);
            return;
        }

        Subscription currentActive = currentActiveOpt.get();
        Plan activePlan = currentActive.getPlan();

        if (newPlan.getPlanLevel() > activePlan.getPlanLevel()) {
            // Chuyển gói cũ sang PENDING
            currentActive.setStatus(SubscriptionStatus.PENDING);
            currentActive.setActivatedAt(null);
            subscriptionService.save(currentActive);

            // Kích hoạt gói mới
            activateNewSubscription(userId, newPlan);
        } else {
            User user = userService.findById(userId);
            // Thêm gói mới vào pending
            Subscription pending = new Subscription();
            pending.setUser(user);
            pending.setPlan(newPlan);
            pending.setStartDate(LocalDate.now());
            pending.setEndDate(LocalDate.now().plusDays(activePlan.getDurationDate()));
            pending.setStatus(SubscriptionStatus.PENDING);
            subscriptionService.save(pending);
        }
    }

    private void activateNewSubscription(Long userId, Plan plan) {
        User user = userService.findById(userId);
        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setPlan(plan);
        sub.setActivatedAt(LocalDate.now());
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusDays(plan.getDurationDate()));
        sub.setStatus(SubscriptionStatus.SUCCESS);
        System.out.println(sub + " ................");
        subscriptionService.save(sub);
    }
}
