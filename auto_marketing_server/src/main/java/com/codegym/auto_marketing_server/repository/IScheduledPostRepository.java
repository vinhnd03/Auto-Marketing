package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.ScheduledPost;
import com.codegym.auto_marketing_server.enums.ScheduledPostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface IScheduledPostRepository extends JpaRepository<ScheduledPost, Long> {
    List<ScheduledPost> findByStatus(ScheduledPostStatus status);

    List<ScheduledPost> findByScheduledTimeBetween(LocalDateTime start, LocalDateTime end);

    List<ScheduledPost> findByPostId(Long postId);

    List<ScheduledPost> findByStatusAndScheduledTimeLessThanEqual(ScheduledPostStatus status, LocalDateTime time);
    List<ScheduledPost> findByStatusOrderByScheduledTimeAsc(ScheduledPostStatus status);

    @Query("""
        SELECT sp FROM ScheduledPost sp
        JOIN PostTarget pt ON pt.scheduledPost = sp
        JOIN Fanpage f ON pt.fanpage = f
        JOIN SocialAccount sa ON f.socialAccount = sa
        WHERE sa.user.id = :userId AND sp.status = :status
        ORDER BY sp.scheduledTime ASC
    """)
    List<ScheduledPost> findByUserAndStatus(@Param("userId") Long userId,
                                            @Param("status") ScheduledPostStatus status);
}
