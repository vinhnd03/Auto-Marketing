package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Subscription;
import com.codegym.auto_marketing_server.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ISubscriptionRepository extends JpaRepository<Subscription, Long> {
    @Query(value = "SELECT s.* FROM subscriptions s join users u on s.user_id=u.id where s.status=\"SUCCESS\" and u.id=:userId limit 1", nativeQuery = true)
    Optional<Subscription> findActiveByUserId(@Param("userId") Long userId);


    @Query(value = "SELECT s.* FROM subscriptions s " +
            "JOIN plans p ON s.plan_id = p.id " +
            "WHERE s.user_id = :userId AND s.status = 'PENDING' " +
            "ORDER BY p.plan_level DESC, s.start_date ASC", nativeQuery = true)
    List<Subscription> findPendingByUserIdOrderByLevel(@Param("userId") Long userId);

    @Query(value = "SELECT * FROM subscriptions s WHERE s.status = :status", nativeQuery = true)
    List<Subscription> findByStatus(@Param("status") String status);

    @Query(value = "select p.max_workspace from subscriptions s join plans p on s.plan_id=p.id where s.id=:id", nativeQuery = true)
    Integer findMaxWorkspaceByCurrenSubscription(@Param("id") Long id);

    @Query(value = "SELECT COUNT(*) FROM subscriptions " +
            "WHERE user_id = :userId AND plan_id = :planId AND status = 'SUCCESS' ", nativeQuery = true)
    int countSuccessSubscriptionByPlan(@Param("userId") Long userId, @Param("planId") Long planId);

    // Lấy tất cả subscription có status SUCCESS mà endDate <= ngày hiện tại
    List<Subscription> findAllByStatusAndEndDateLessThanEqual(SubscriptionStatus status, LocalDate date);
    @Query(value = "SELECT count(*) FROM subscriptions s join users u on s.user_id=u.id join plans p on p.id=s.plan_id where p.name=:planName and u.id=:userId", nativeQuery = true)
    int countSubscriptionByPlantName(@Param("planName") String planName ,@Param("userId") Long userId);
}
