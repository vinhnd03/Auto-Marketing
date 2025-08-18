package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.PackageStatsResponseDTO;
import com.codegym.auto_marketing_server.service.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/packages")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PackageController {
    private final ITransactionService transactionService;

    /**
     * API lấy số liệu thống kê (cards)
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getPackageStats() {
        try {
            PackageStatsResponseDTO dto = transactionService.getPackageStats();
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            // Trả về JSON lỗi và HTTP 500
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage() != null ? ex.getMessage() : "Unexpected error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * API lấy dữ liệu chart
     */
    @GetMapping("/chart")
    public ResponseEntity<?> getPackageChart(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return ResponseEntity.ok(transactionService.getPackageChart(start, end));
    }
}
