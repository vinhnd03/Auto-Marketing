package com.codegym.auto_marketing_server.controller.transaction;

import com.codegym.auto_marketing_server.entity.Transaction;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.service.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final ITransactionService transactionService;

    @GetMapping("")
    public ResponseEntity<?> getAllTransactionByEmail(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String filterPlan) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        User user = (User) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
        Page<Transaction> transactions = transactionService.findAllTransactionByEmail(user.getEmail(), filterPlan, pageable);

        if (transactions.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("transactions", transactions.getContent());
        response.put("currentPage", transactions.getNumber());
        response.put("totalItems", transactions.getTotalElements());
        response.put("totalPages", transactions.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
