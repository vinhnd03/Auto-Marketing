package com.codegym.auto_marketing_server.service;

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

}
