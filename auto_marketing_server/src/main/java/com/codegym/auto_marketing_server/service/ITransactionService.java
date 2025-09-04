package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;


import com.codegym.auto_marketing_server.dto.PackageDTO;
import com.codegym.auto_marketing_server.dto.PackageStatsResponseDTO;
import com.codegym.auto_marketing_server.dto.RevenueDTO;
import com.codegym.auto_marketing_server.dto.RevenueStatsResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface ITransactionService {
    List<RevenueDTO> getRevenue(String type, LocalDateTime start, LocalDateTime end);

    RevenueStatsResponseDTO getRevenueStats();

    PackageStatsResponseDTO getPackageStats();

    List<PackageDTO> getPackageChart(LocalDateTime start, LocalDateTime end);


    void handlePayment(String txnRef, long amount, String serviceName, Long userId, String status);

    String getMostPopularPackage();

    Page<Transaction> findAllTransactionByEmail(String email,String filterPlan, Pageable pageable);
}
