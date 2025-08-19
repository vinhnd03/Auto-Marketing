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
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    @Override
    public void handlePayment(String txnRef, long amount, String serviceName, Long userId, String status) {
        // Lấy user và plan từ service
        User user = userService.findById(userId).orElse(null);
        Plan plan = planService.findByName(serviceName);

        if (user == null || plan == null) {
            // Nếu không tìm thấy user hoặc plan, bỏ qua hoặc log
            return;
        }

        // Kiểm tra transaction đã tồn tại chưa
        Transaction existing = transactionRepository.findByTransactionCode(txnRef);
        if (existing != null) {
            // Update trạng thái thanh toán
            existing.setPaymentStatus("success".equalsIgnoreCase(status) ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
            transactionRepository.save(existing);
            return;
        }

        // Tạo transaction mới
        Transaction transaction = new Transaction();
        transaction.setTransactionCode(txnRef);
        transaction.setAmount(amount);
        transaction.setPaymentMethod("VNPAY");
        transaction.setPaymentStatus("success".equalsIgnoreCase(status) ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUser(user);
        transaction.setPlan(plan);

        transactionRepository.save(transaction);

        // Nếu thanh toán thành công, tạo subscription
        if ("success".equalsIgnoreCase(status)) {
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
