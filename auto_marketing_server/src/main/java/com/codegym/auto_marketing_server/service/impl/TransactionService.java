package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.dto.PackageDTO;
import com.codegym.auto_marketing_server.dto.PackageStatsResponseDTO;
import com.codegym.auto_marketing_server.dto.RevenueDTO;
import com.codegym.auto_marketing_server.dto.RevenueStatsResponseDTO;
import com.codegym.auto_marketing_server.entity.Plan;
import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.entity.Transaction;
import com.codegym.auto_marketing_server.entity.User;
import com.codegym.auto_marketing_server.enums.PaymentStatus;
import com.codegym.auto_marketing_server.repository.ITransactionRepository;
import com.codegym.auto_marketing_server.service.IPlanService;
import com.codegym.auto_marketing_server.service.ITransactionService;
import com.codegym.auto_marketing_server.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.*;
import java.util.List;

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
        return transactionRepository.getPackageSales(start, end);
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

    private final IUserService userService;
    private final IPlanService planService;
    private final SubscriptionManagementService subscriptionManagementService;

    @Transactional
    @Override
    public void handlePayment(String txnRef, long amount, String serviceName, Long userId, String status) {
        // Lấy user và plan từ service
        User user = userService.findById(userId).orElse(null);
        Plan plan = planService.findByName(serviceName);

        if (user == null || plan == null) {
            // Nếu không tìm thấy user hoặc plan, bỏ qua hoặc log
            return;
        }

        // Kiểm tra transaction đã tồn tại chưa
        Transaction existing = transactionRepository.findByTransactionCode(txnRef);
        if (existing != null) {
            // Update trạng thái thanh toán
            existing.setPaymentStatus("success".equalsIgnoreCase(status) ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
            transactionRepository.save(existing);
            return;
        }

        // Tạo transaction mới
        Transaction transaction = new Transaction();
        transaction.setTransactionCode(txnRef);
        transaction.setAmount(amount);
        transaction.setPaymentMethod("VNPAY");
        transaction.setPaymentStatus("success".equalsIgnoreCase(status) ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUser(user);
        transaction.setPlan(plan);

        transactionRepository.save(transaction);

        // Nếu thanh toán thành công, tạo subscription
        if ("success".equalsIgnoreCase(status)) {
            Subscription subscription = new Subscription();
            subscription.setUser(user);
            subscription.setPlan(plan);
            subscription.setStartDate(LocalDate.now());
            subscription.setEndDate(LocalDate.now().plusDays(plan.getDurationDate()));
            subscription.setActivatedAt(LocalDate.now());
            subscriptionManagementService.purchasePlan(userId, plan);
        }
    }

    @Override
    public String getMostPopularPackage() {
        return transactionRepository.getMostPopularPackage();
    }

    @Override
    public Page<Transaction> findAllTransactionByEmail(String email, String filterPlan, Pageable pageable) {
        return transactionRepository.findAllTransactionByEmail(email,filterPlan,pageable);
    }
}
