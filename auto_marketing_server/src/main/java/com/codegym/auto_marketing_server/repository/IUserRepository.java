package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.dto.MonthStatisticDTO;
import com.codegym.auto_marketing_server.dto.NotificationDTO;
import com.codegym.auto_marketing_server.dto.QuarterStatisticDTO;
import com.codegym.auto_marketing_server.dto.WeekStatisticDTO;
import com.codegym.auto_marketing_server.entity.User;
import jakarta.persistence.Id;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    @Query(value = "SELECT u.id FROM users u join social_accounts sa on u.id=sa.user_id where sa.id=:id", nativeQuery = true)
    Long selectUserIdBySocialAccountId(@Param("id") Long id);


    //đếm số lượng người dùng
    long count();
    // Chưa mua gói nào
    @Query("SELECT u FROM User u WHERE u.subscriptions IS EMPTY " +
            "OR NOT EXISTS (SELECT s FROM Subscription s WHERE s.user = u AND s.plan IS NOT NULL)")
    Page<User> findUsersWithoutSubscription(Pageable pageable);

    // Đã mua nhưng hết hạn
    @Query("SELECT DISTINCT u FROM User u " +
            "JOIN u.subscriptions s " +
            "WHERE s.plan IS NOT NULL AND s.endDate < :today " +
            "AND NOT EXISTS (SELECT s2 FROM Subscription s2 WHERE s2.user = u AND s2.plan IS NOT NULL AND s2.endDate >= :today AND s2.status = 'ACTIVE')")
    Page<User> findUsersWithExpiredSubscription(@Param("today") LocalDate today, Pageable pageable);

    // Đang sử dụng
    @Query("SELECT DISTINCT u FROM User u JOIN u.subscriptions s " +
            "WHERE s.plan IS NOT NULL AND s.endDate >= :today AND s.status = 'ACTIVE'")
    Page<User> findUsersWithActiveSubscription(@Param("today") LocalDate today, Pageable pageable);
    // Lấy danh sách người dùng và gói đã mua
//    @Query("""
//            SELECT DISTINCT u
//            FROM User u
//            LEFT JOIN Subscription s ON s.user = u
//            LEFT JOIN Plan p ON s.plan = p
//            WHERE (:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')))
//              AND (:planName IS NULL OR (p IS NOT NULL AND LOWER(p.name) LIKE LOWER(CONCAT('%', :planName, '%'))))
//              AND (:startDate IS NULL OR s.startDate >= :startDate)
//              AND (:endDate IS NULL OR s.startDate <= :endDate)
//    """)
//    Page<User> searchAndPage(@Param("name") String name,
//                              @Param("planName") String planName,
//                              @Param("startDate") LocalDate startDate,
//                              @Param("endDate") LocalDate endDate,
//                              Pageable pageable);
    @Query(value = """
            SELECT DISTINCT u
            FROM User u
            LEFT JOIN Subscription s ON s.user = u
            LEFT JOIN Plan p ON s.plan = p
            WHERE (:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')))
              AND (:planName IS NULL OR (p IS NOT NULL AND LOWER(p.name) LIKE LOWER(CONCAT('%', :planName, '%'))))
              AND (:startDate IS NULL OR u.createdAt >= :startDate)
              AND (:endDate IS NULL OR u.createdAt <= :endDate)
              AND (:status IS NULL OR u.status = :status)
            """,
            countQuery = """
                    SELECT COUNT(DISTINCT u.id)
                    FROM User u
                    LEFT JOIN Subscription s ON s.user = u
                    LEFT JOIN Plan p ON s.plan = p
                    WHERE (:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')))
                      AND (:planName IS NULL OR (p IS NOT NULL AND LOWER(p.name) LIKE LOWER(CONCAT('%', :planName, '%'))))
                      AND (:startDate IS NULL OR u.createdAt >= :startDate)
                      AND (:endDate IS NULL OR u.createdAt <= :endDate)
                      AND (:status IS NULL OR u.status = :status)
                    """)
    Page<User> searchAndPage(
            @Param("name") String name,
            @Param("planName") String planName,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") Boolean status,
            Pageable pageable
    );


    // Thống kê theo tháng trong 1 năm
    @Query("SELECT new com.codegym.auto_marketing_server.dto.MonthStatisticDTO(" +
            "MONTH(u.createdAt), COUNT(u)) " +
            "FROM User u " +
            "WHERE YEAR(u.createdAt) = :year " +
            "GROUP BY MONTH(u.createdAt) " +
            "ORDER BY MONTH(u.createdAt)")
    List<MonthStatisticDTO> countByMonth(@Param("year") int year);

    @Query("SELECT new com.codegym.auto_marketing_server.dto.QuarterStatisticDTO(" +
            "QUARTER(u.createdAt), COUNT(u)) " +
            "FROM User u " +
            "WHERE YEAR(u.createdAt) = :year " +
            "GROUP BY QUARTER(u.createdAt) " +
            "ORDER BY QUARTER(u.createdAt)")
    List<QuarterStatisticDTO> countByQuarter(@Param("year") int year);

    // Thống kê theo tuần trong 1 tháng (User.createdAt)
    @Query("SELECT new com.codegym.auto_marketing_server.dto.WeekStatisticDTO(" +
            "CASE " +
            "   WHEN DAY(u.createdAt) BETWEEN 1 AND 7 THEN 1 " +
            "   WHEN DAY(u.createdAt) BETWEEN 8 AND 14 THEN 2 " +
            "   WHEN DAY(u.createdAt) BETWEEN 15 AND 21 THEN 3 " +
            "   WHEN DAY(u.createdAt) BETWEEN 22 AND 28 THEN 4 " +
            "   ELSE 5 " +
            "END, COUNT(u)) " +
            "FROM User u " +
            "WHERE YEAR(u.createdAt) = :year AND MONTH(u.createdAt) = :month " +
            "GROUP BY " +
            "CASE " +
            "   WHEN DAY(u.createdAt) BETWEEN 1 AND 7 THEN 1 " +
            "   WHEN DAY(u.createdAt) BETWEEN 8 AND 14 THEN 2 " +
            "   WHEN DAY(u.createdAt) BETWEEN 15 AND 21 THEN 3 " +
            "   WHEN DAY(u.createdAt) BETWEEN 22 AND 28 THEN 4 " +
            "   ELSE 5 " +
            "END " +
            "ORDER BY " +
            "CASE " +
            "   WHEN DAY(u.createdAt) BETWEEN 1 AND 7 THEN 1 " +
            "   WHEN DAY(u.createdAt) BETWEEN 8 AND 14 THEN 2 " +
            "   WHEN DAY(u.createdAt) BETWEEN 15 AND 21 THEN 3 " +
            "   WHEN DAY(u.createdAt) BETWEEN 22 AND 28 THEN 4 " +
            "   ELSE 5 " +
            "END")
    List<WeekStatisticDTO> countByWeek(@Param("year") int year, @Param("month") int month);

    // Thống kê theo tháng trong 1 năm dựa trên startDate của Subscription
    @Query("SELECT new com.codegym.auto_marketing_server.dto.MonthStatisticDTO(" +
            "MONTH(s.startDate), COUNT(s)) " +
            "FROM Subscription s " +
            "WHERE YEAR(s.startDate) = :year " +
            "GROUP BY MONTH(s.startDate) " +
            "ORDER BY MONTH(s.startDate)")
    List<MonthStatisticDTO> countPackagesByMonth(@Param("year") int year);

    // Thống kê theo quý trong 1 năm dựa trên startDate của Subscription
    @Query("SELECT new com.codegym.auto_marketing_server.dto.QuarterStatisticDTO(" +
            "QUARTER(s.startDate), COUNT(s)) " +
            "FROM Subscription s " +
            "WHERE YEAR(s.startDate) = :year " +
            "GROUP BY QUARTER(s.startDate) " +
            "ORDER BY QUARTER(s.startDate)")
    List<QuarterStatisticDTO> countPackagesByQuarter(@Param("year") int year);


    // Thống kê theo tuần trong 1 tháng (Subscription.startDate)
    @Query("SELECT new com.codegym.auto_marketing_server.dto.WeekStatisticDTO(" +
            "CASE " +
            "   WHEN DAY(s.startDate) BETWEEN 1 AND 7 THEN 1 " +
            "   WHEN DAY(s.startDate) BETWEEN 8 AND 14 THEN 2 " +
            "   WHEN DAY(s.startDate) BETWEEN 15 AND 21 THEN 3 " +
            "   WHEN DAY(s.startDate) BETWEEN 22 AND 28 THEN 4 " +
            "   ELSE 5 " +
            "END, COUNT(s)) " +
            "FROM Subscription s " +
            "WHERE YEAR(s.startDate) = :year AND MONTH(s.startDate) = :month " +
            "GROUP BY " +
            "CASE " +
            "   WHEN DAY(s.startDate) BETWEEN 1 AND 7 THEN 1 " +
            "   WHEN DAY(s.startDate) BETWEEN 8 AND 14 THEN 2 " +
            "   WHEN DAY(s.startDate) BETWEEN 15 AND 21 THEN 3 " +
            "   WHEN DAY(s.startDate) BETWEEN 22 AND 28 THEN 4 " +
            "   ELSE 5 " +
            "END " +
            "ORDER BY " +
            "CASE " +
            "   WHEN DAY(s.startDate) BETWEEN 1 AND 7 THEN 1 " +
            "   WHEN DAY(s.startDate) BETWEEN 8 AND 14 THEN 2 " +
            "   WHEN DAY(s.startDate) BETWEEN 15 AND 21 THEN 3 " +
            "   WHEN DAY(s.startDate) BETWEEN 22 AND 28 THEN 4 " +
            "   ELSE 5 " +
            "END")
    List<WeekStatisticDTO> countPackagesByWeek(@Param("year") int year, @Param("month") int month);

    //thông báo
    @Query("""
                SELECT new com.codegym.auto_marketing_server.dto.NotificationDTO(
                    CONCAT('Người dùng mới: ', u.name),
                    u.createdAt,
                    false
                )
                FROM User u
            """)
    List<NotificationDTO> findUserCreatedNotifications();

    @Query("""
                SELECT new com.codegym.auto_marketing_server.dto.NotificationDTO(
                    CONCAT('Người dùng ', u.name, ' đã mua gói ', p.name),
                    s.startDate,false
                )
                FROM Subscription s
                JOIN s.user u
                JOIN s.plan p
            """)
    List<NotificationDTO> findSubscriptionNotifications();

    @Query("SELECT COUNT(u) FROM User u WHERE YEAR(u.createdAt) = :year AND MONTH(u.createdAt) = :month")
    int countByYearAndMonth(@Param("year") int year, @Param("month") int month);

}
