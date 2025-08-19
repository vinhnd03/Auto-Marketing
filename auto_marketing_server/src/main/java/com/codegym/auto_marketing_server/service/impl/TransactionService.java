package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.repository.ITransactionRepository;
import com.codegym.auto_marketing_server.service.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {
    private final ITransactionRepository transactionRepository;
}
