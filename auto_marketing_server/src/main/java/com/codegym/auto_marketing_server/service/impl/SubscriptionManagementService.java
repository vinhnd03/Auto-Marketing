package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.enums.SubscriptionStatus;
import com.codegym.auto_marketing_server.repository.ISubscriptionRepository;
import com.codegym.auto_marketing_server.service.IPlanService;
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
    private final IPlanService planService;
    private final ISubscriptionRepository subscriptionRepository;

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
            User user = userService.findById(userId).get();
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
        User user = userService.findById(userId).get();
        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setPlan(plan);
        sub.setActivatedAt(LocalDate.now());
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusDays(plan.getDurationDate()));
        sub.setStatus(SubscriptionStatus.SUCCESS);
        subscriptionService.save(sub);
    }

    public void activateTrialPlan(Long userId) {
        Plan trialPlan = planService.findByName("Trial");
        if (trialPlan == null) {
            throw new RuntimeException("Plan Trial không tồn tại trong DB");
        }

        // 1. Kiểm tra user đang có active subscription nào không?
        Optional<Subscription> activeOpt = subscriptionService.findActiveByUserId(userId);
        if (activeOpt.isPresent()) {
            Plan currentPlan = activeOpt.get().getPlan();

            // Nếu currentPlan level > trialPlan level (đang dùng gói cao hơn)
            if (currentPlan.getPlanLevel() > trialPlan.getPlanLevel()) {
                throw new RuntimeException("Bạn đang dùng gói cao hơn nên không thể dùng gói FREE.");
            }
        }

        // 2. Kiểm tra user đã từng dùng FREE trước đó chưa (SUCCESS)
        int used = subscriptionRepository.countSuccessSubscriptionByPlan(userId, trialPlan.getId());
        if (used > 0) {
            throw new RuntimeException("Bạn đã sử dụng gói FREE trước đó rồi.");
        }


        User user = userService.findById(userId).orElse(null);
        if (user == null) {
            throw new RuntimeException("User không tồn tại");
        }

        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setPlan(trialPlan);
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusDays(trialPlan.getDurationDate()));
        sub.setActivatedAt(LocalDate.now());
        sub.setStatus(SubscriptionStatus.SUCCESS);
        subscriptionRepository.save(sub);
    }

}
