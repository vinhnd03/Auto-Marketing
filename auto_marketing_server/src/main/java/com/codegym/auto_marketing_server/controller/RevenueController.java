package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.RevenueDTO;
import com.codegym.auto_marketing_server.dto.RevenueStatsResponseDTO;
import com.codegym.auto_marketing_server.service.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RevenueController {
    private final ITransactionService transactionService;

    @GetMapping
    public List<RevenueDTO> getRevenue(
            @RequestParam(defaultValue = "month") String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            if (!List.of("day","month","quarter").contains(type)) {
                throw new IllegalArgumentException("Invalid type");
            }
            return transactionService.getRevenue(type, start, end);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // API dành riêng cho 4 StatCard trên trang /admin/revenue
    @GetMapping("/dashboard")
    public ResponseEntity<RevenueStatsResponseDTO> getDashboard() {
        try {
            RevenueStatsResponseDTO dto = transactionService.getRevenueStats();
            if (dto == null) dto = new RevenueStatsResponseDTO();
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
