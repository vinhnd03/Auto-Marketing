package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.PackageDTO;
import com.codegym.auto_marketing_server.dto.PackageStatsResponseDTO;
import com.codegym.auto_marketing_server.dto.RevenueDTO;
import com.codegym.auto_marketing_server.dto.RevenueStatsResponseDTO;
import com.codegym.auto_marketing_server.repository.ITransactionRepository;
import com.codegym.auto_marketing_server.service.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {
    private final ITransactionRepository transactionRepository;

    @Override
    public List<RevenueDTO> getRevenue(String type, LocalDateTime start, LocalDateTime end) {
        List<Object[]> results = switch (type.toLowerCase()) {
            case "day" -> transactionRepository.getRevenueByDay(start, end);
            case "month" -> transactionRepository.getRevenueByMonth(start, end);
            case "quarter" -> transactionRepository.getRevenueByQuarter(start, end);
            default -> throw new IllegalArgumentException("Invalid type: " + type);
        };

        return results.stream()
                .map(r -> new RevenueDTO(r[0].toString(), ((BigDecimal) r[1]).doubleValue()))
                .toList();
    }

    @Override
    public RevenueStatsResponseDTO getRevenueStats() {
        // Chốt timezone để tính ngày cho đúng VN
        ZoneId zone = ZoneId.systemDefault(); // hoặc ZoneId.of("Asia/Ho_Chi_Minh")
        LocalDate today = LocalDate.now(zone);

        // ---- WEEK ---- (thứ 2 → CN)
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);
        LocalDate startOfLastWeek = startOfWeek.minusWeeks(1);
        LocalDate endOfLastWeek = endOfWeek.minusWeeks(1);

        BigDecimal weekCur = transactionRepository.sumRevenue(startOfWeek.atStartOfDay(), endOfWeek.atTime(23, 59, 59));
        BigDecimal weekPrev = transactionRepository.sumRevenue(startOfLastWeek.atStartOfDay(), endOfLastWeek.atTime(23, 59, 59));

        // ---- MONTH ----
        YearMonth ym = YearMonth.now(zone);
        YearMonth ymPrev = ym.minusMonths(1);
        BigDecimal monthCur = transactionRepository.sumRevenue(ym.atDay(1).atStartOfDay(), ym.atEndOfMonth().atTime(23, 59, 59));
        BigDecimal monthPrev = transactionRepository.sumRevenue(ymPrev.atDay(1).atStartOfDay(), ymPrev.atEndOfMonth().atTime(23, 59, 59));

        // ---- QUARTER ----
        int q = (today.getMonthValue() - 1) / 3 + 1;
        int lastQ = q == 1 ? 4 : q - 1;
        int yearOfLastQ = q == 1 ? today.getYear() - 1 : today.getYear();

        LocalDate qStart = LocalDate.of(today.getYear(), (q - 1) * 3 + 1, 1);
        LocalDate qEnd = qStart.plusMonths(3).minusDays(1);
        LocalDate qPrevStart = LocalDate.of(yearOfLastQ, (lastQ - 1) * 3 + 1, 1);
        LocalDate qPrevEnd = qPrevStart.plusMonths(3).minusDays(1);

        BigDecimal quarterCur = transactionRepository.sumRevenue(qStart.atStartOfDay(), qEnd.atTime(23, 59, 59));
        BigDecimal quarterPrev = transactionRepository.sumRevenue(qPrevStart.atStartOfDay(), qPrevEnd.atTime(23, 59, 59));

        // ---- YEAR ----
        LocalDate yStart = LocalDate.of(today.getYear(), 1, 1);
        LocalDate yEnd = LocalDate.of(today.getYear(), 12, 31);
        BigDecimal yearCur = transactionRepository.sumRevenue(yStart.atStartOfDay(), yEnd.atTime(23, 59, 59));

        RevenueStatsResponseDTO res = new RevenueStatsResponseDTO();
        res.week = buildPeriod(weekCur, weekPrev);
        res.month = buildPeriod(monthCur, monthPrev);
        res.quarter = buildPeriod(quarterCur, quarterPrev);
        res.year = yearCur;
        return res;

    }

    @Override
    public PackageStatsResponseDTO getPackageStats() {
        LocalDateTime now = LocalDateTime.now();
        long totalSoldAllTime = transactionRepository.getTotalSoldAllTime();

        //  Tháng này
        LocalDate startOfThisMonthDate = now.toLocalDate().withDayOfMonth(1);
        LocalDate endOfThisMonthDate = now.toLocalDate().withDayOfMonth(now.toLocalDate().lengthOfMonth());

        LocalDateTime startThisMonth = startOfThisMonthDate.atStartOfDay();
        LocalDateTime endThisMonth = endOfThisMonthDate.atTime(LocalTime.MAX);

        //  Tháng trước
        LocalDate lastMonthDate = now.minusMonths(1).toLocalDate();
        LocalDate startOfLastMonthDate = lastMonthDate.withDayOfMonth(1);
        LocalDate endOfLastMonthDate = lastMonthDate.withDayOfMonth(lastMonthDate.lengthOfMonth());

        LocalDateTime startLastMonth = startOfLastMonthDate.atStartOfDay();
        LocalDateTime endLastMonth = endOfLastMonthDate.atTime(LocalTime.MAX);

        // Tổng số gói bán ra
        long soldThisMonth = transactionRepository.getTotalSoldInPeriod(startThisMonth, endThisMonth);
        long soldLastMonth = transactionRepository.getTotalSoldInPeriod(startLastMonth, endLastMonth);

        // Tính tăng trưởng %
        double growthRate = 0.0;
        if (soldLastMonth > 0) {
            growthRate = ((double) (soldThisMonth - soldLastMonth) / soldLastMonth) * 100;
        }

        // Gói phổ biến nhất + ít phổ biến nhất
        String mostPopular = transactionRepository.getMostPopularPackage();
        String leastPopular = transactionRepository.getLeastPopularPackage();

        return new PackageStatsResponseDTO(
                totalSoldAllTime,
                mostPopular,
                leastPopular,
                growthRate
        );
    }


    @Override
    public List<PackageDTO> getPackageChart(LocalDateTime start, LocalDateTime end) {
        return transactionRepository.getPackageSales(start,end);
    }


    private RevenueStatsResponseDTO.PeriodStat buildPeriod(BigDecimal current, BigDecimal previous) {
        RevenueStatsResponseDTO.PeriodStat p = new RevenueStatsResponseDTO.PeriodStat();
        p.current = nz(current);
        p.previous = nz(previous);

        if (p.previous.signum() == 0) {
            p.changePercent = p.current.signum() == 0 ? 0.0 : 100.0;
            p.changeType = p.current.signum() == 0 ? "flat" : "increase";
        } else {
            double pct = p.current.subtract(p.previous)
                    .divide(p.previous, 4, java.math.RoundingMode.HALF_UP)
                    .doubleValue() * 100.0;
            p.changePercent = Math.abs(pct) < 0.0001 ? 0.0 : pct;
            p.changeType = pct > 0 ? "increase" : (pct < 0 ? "decrease" : "flat");
        }
        return p;
    }

    private BigDecimal nz(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
