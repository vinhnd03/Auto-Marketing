package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ITransactionRepository extends JpaRepository<Transaction, Long> {
    Transaction findByTransactionCode(String transactionCode);
}
