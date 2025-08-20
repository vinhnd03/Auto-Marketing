package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.dto.PackageDTO;
import com.codegym.auto_marketing_server.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ITransactionRepository extends JpaRepository<Transaction, Long> {
    @Query(value = """
             SELECT
                DATE(created_at) AS period,
                COALESCE(SUM(amount), 0) AS total_revenue
            FROM transactions
            WHERE payment_status = 'SUCCESS'
              AND created_at BETWEEN :startDate AND :endDate
            GROUP BY DATE(created_at)
            ORDER BY period
            """, nativeQuery = true)
    List<Object[]> getRevenueByDay(@Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    @Query(value = """
            SELECT
                DATE_FORMAT(created_at, '%Y-%m') AS period,
                COALESCE(SUM(amount), 0) AS total_revenue
            FROM transactions
            WHERE payment_status = 'SUCCESS'
              AND created_at BETWEEN :startDate AND :endDate
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY period
            """, nativeQuery = true)
    List<Object[]> getRevenueByMonth(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);

    @Query(value = """
             SELECT
                CONCAT(YEAR(created_at), '-Q', QUARTER(created_at)) AS period,
                COALESCE(SUM(amount), 0) AS total_revenue
            FROM transactions
            WHERE payment_status = 'SUCCESS'
              AND created_at BETWEEN :startDate AND :endDate
            GROUP BY CONCAT(YEAR(created_at), '-Q', QUARTER(created_at))
            ORDER BY period
            """, nativeQuery = true)
    List<Object[]> getRevenueByQuarter(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);

    @Query(value = """
            SELECT 
                COALESCE(SUM(t.amount),0)
            FROM transactions t 
            WHERE t.payment_status = 'SUCCESS'
              AND t.created_at BETWEEN :start AND :end""", nativeQuery = true)
    BigDecimal sumRevenue(@Param("start") LocalDateTime start,
                          @Param("end") LocalDateTime end);

    // Tổng số gói đã bán
    @Query(value = """
            SELECT COUNT(t.id)
            FROM transactions t
            WHERE t.payment_status = 'SUCCESS'
            """, nativeQuery = true)
    long getTotalSoldAllTime();


    // Gói phổ biến nhất
    @Query(value = """
            SELECT p.name
            FROM transactions t
            JOIN plans p ON p.id = t.plan_id
            WHERE t.payment_status = 'SUCCESS'
            GROUP BY p.name
            ORDER BY COUNT(t.id) DESC
            LIMIT 1
            """, nativeQuery = true)
    String getMostPopularPackage();

    // Gói ít phổ biến nhất
    @Query(value = """
            SELECT p.name
            FROM transactions t
            JOIN plans p ON p.id = t.plan_id
            WHERE t.payment_status = 'SUCCESS'
            GROUP BY p.name
            ORDER BY COUNT(t.id) ASC
            LIMIT 1
            """, nativeQuery = true)
    String getLeastPopularPackage();

    // Tổng gói bán ra của một khoảng thời gian (ví dụ tháng trước)
    @Query(value = """
                SELECT COUNT(t.id)
                FROM transactions t
                WHERE t.payment_status = 'SUCCESS'
                  AND t.created_at >= :startDate
                  AND t.created_at <= :endDate
            """, nativeQuery = true)
    long getTotalSoldInPeriod(@Param("startDate") LocalDateTime startDate,
                              @Param("endDate") LocalDateTime endDate);

    // thống kê theo năm tháng
    @Query(value = """
            SELECT p.name AS packageName,
                   EXTRACT(YEAR FROM t.created_at) AS year,
                   EXTRACT(MONTH FROM t.created_at) AS month,
                   COUNT(t.id) AS totalSold
            FROM transactions t
            JOIN plans p ON t.plan_id = p.id
            WHERE EXTRACT(YEAR FROM t.created_at) = :year
              AND EXTRACT(MONTH FROM t.created_at) = :month
            GROUP BY p.name, year, month
            ORDER BY totalSold DESC
            """, nativeQuery = true)
    List<Object[]> getSoldPackagesByMonth(@Param("year") int year, @Param("month") int month);


    // thống kê theo khoảng ngày
    @Query(value = """
            SELECT p.name AS packageName,
                   COUNT(t.id) AS totalSold
            FROM transactions t
            JOIN plans p ON t.plan_id = p.id
            WHERE t.created_at BETWEEN :startDate AND :endDate
            GROUP BY p.name
            ORDER BY totalSold DESC
            """, nativeQuery = true)
    List<Object[]> getSoldPackagesByDateRange(@Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);

    @Query(value = "SELECT p.name AS packageName, COUNT(t.id) AS sales " +
            "FROM transactions t " +
            "JOIN plans p ON t.plan_id = p.id " +
            "WHERE (:start IS NULL OR t.created_at >= :start) " +
            "AND (:end IS NULL OR t.created_at <= :end) " +
            "GROUP BY p.name",
            nativeQuery = true)
    List<PackageDTO> getPackageSales(@Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end);
}

