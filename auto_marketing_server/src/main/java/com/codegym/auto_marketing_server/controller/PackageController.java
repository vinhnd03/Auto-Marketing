package com.codegym.auto_marketing_server.controller;

import com.codegym.auto_marketing_server.dto.PackageDTO;
import com.codegym.auto_marketing_server.dto.PackageStatsResponseDTO;
import com.codegym.auto_marketing_server.service.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/packages")
@RequiredArgsConstructor
public class PackageController {
    private final ITransactionService transactionService;

    /**
     * API lấy số liệu thống kê (cards)
     */
    @GetMapping("/stats")
    public ResponseEntity<PackageStatsResponseDTO> getPackageStats() {
        try {
            PackageStatsResponseDTO dto = transactionService.getPackageStats();
            if (dto == null) dto = new PackageStatsResponseDTO();
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }
    /**
     * API lấy dữ liệu chart
     */
    @GetMapping("/chart")
    public ResponseEntity<List<PackageDTO>> getPackageChart(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        List<PackageDTO> data = transactionService.getPackageChart(start, end);
        return ResponseEntity.ok(data);
    }
}
