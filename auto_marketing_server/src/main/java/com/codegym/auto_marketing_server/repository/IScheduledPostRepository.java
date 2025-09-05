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

    @Query(value = """
        SELECT u.email, u.name, f.page_id, f.page_name
        FROM scheduled_posts sp
        JOIN post_targets pt ON pt.schedule_post_id = sp.id
        JOIN fanpages f ON f.id = pt.fanpage_id
        JOIN social_accounts sa ON sa.id = f.social_account_id
        JOIN users u ON u.id = sa.user_id
        WHERE sp.id = :scheduledPostId
        """, nativeQuery = true)
    List<Object[]> findUserEmailsAndNamesByScheduledPostId(@Param("scheduledPostId") Long scheduledPostId);
    @Query(value = """
    SELECT sp.* FROM scheduled_posts sp
    JOIN posts p ON p.id = sp.post_id
    JOIN topics t ON t.id = p.topic_id
    JOIN campaigns c ON c.id = t.campaign_id
    JOIN workspaces w ON w.id = c.workspace_id
    WHERE w.id = :workspaceId
      AND sp.status = 'SCHEDULED'
    """, nativeQuery = true)
    List<ScheduledPost> findScheduledByWorkspace(@Param("workspaceId") Long workspaceId);
    @Query(value = """
    SELECT sp.* FROM scheduled_posts sp
    JOIN posts p ON p.id = sp.post_id
    JOIN topics t ON t.id = p.topic_id
    JOIN campaigns c ON c.id = t.campaign_id
    JOIN workspaces w ON w.id = c.workspace_id
    WHERE w.id = :workspaceId
      AND sp.status = 'POSTED'
            ORDER BY sp.posted_at DESC
        
    """, nativeQuery = true)
    List<ScheduledPost> findPostedByWorkspace(@Param("workspaceId") Long workspaceId);


}
