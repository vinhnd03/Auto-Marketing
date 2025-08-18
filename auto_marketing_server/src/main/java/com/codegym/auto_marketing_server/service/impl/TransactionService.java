package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.entity.Transaction;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.enums.PaymentStatus;
import com.codegym.auto_marketing_server.repository.ITransactionRepository;

import com.codegym.auto_marketing_server.service.IPlanService;
import com.codegym.auto_marketing_server.service.ISubscriptionService;
import com.codegym.auto_marketing_server.service.ITransactionService;
import com.codegym.auto_marketing_server.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {
    private final ITransactionRepository transactionRepository;
    private final IUserService userService;
    private final IPlanService planService;
    private final ISubscriptionService subscriptionService;
    private final SubscriptionManagementService subscriptionManagementService;

    @Override
    public void handleSuccessfulPayment(String txnRef, long amount, String service, Long userId) {
        User user = userService.findById(userId);
        Plan plan = planService.findByName(service);
        if (user != null && plan != null) {
            Transaction transaction = new Transaction();
            transaction.setTransactionCode(txnRef);
            transaction.setAmount(amount);
            transaction.setPaymentMethod("VNPAY");
            transaction.setPaymentStatus(PaymentStatus.SUCCESS);
            transaction.setCreatedAt(LocalDateTime.now());
            transaction.setUser(user);
            transaction.setPlan(plan);

            transactionRepository.save(transaction);

            Subscription subscription = new Subscription();
            subscription.setUser(user);
            subscription.setPlan(plan);
            subscription.setStartDate(LocalDate.now());
            subscription.setEndDate(LocalDate.now().plusDays(plan.getDurationDate()));
            subscription.setActivatedAt(LocalDate.now());
            subscriptionManagementService.purchasePlan(userId, plan);
        }
    }
}
