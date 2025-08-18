package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Plan;
import org.springframework.stereotype.Service;


public interface ITransactionService {
    void handleSuccessfulPayment(String txnRef, long amount, String service, Long userId);
}
