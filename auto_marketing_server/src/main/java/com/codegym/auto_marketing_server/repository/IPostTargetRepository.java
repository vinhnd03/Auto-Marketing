package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.PostTarget;
import com.codegym.auto_marketing_server.entity.ScheduledPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPostTargetRepository extends JpaRepository<PostTarget, Long> {
    List<PostTarget> findByScheduledPostId(Long scheduledPostId);

    List<PostTarget> findByScheduledPost(ScheduledPost scheduledPost);

    List<PostTarget> findByFanpageId(Long fanpageId);

    // Tìm PostTarget theo postId
    Optional<PostTarget> findByPostId(Long postId);

    // Query chỉ check lượt thích
    @Query("SELECT pt FROM PostTarget pt WHERE pt.targetLikes > 0")
    List<PostTarget> findAllWithGoals();

    // Tìm PostTarget theo topic
    @Query("SELECT pt FROM PostTarget pt JOIN pt.post p JOIN p.topic t WHERE t.id = :topicId")
    List<PostTarget> findByTopicId(@Param("topicId") Long topicId);

    // Tìm PostTarget theo campaign
    @Query("SELECT pt FROM PostTarget pt JOIN pt.post p JOIN p.topic t JOIN t.campaign c WHERE c.id = :campaignId")
    List<PostTarget> findByCampaignId(@Param("campaignId") Long campaignId);

    // Tìm PostTarget theo workspace
    @Query("SELECT pt FROM PostTarget pt JOIN pt.post p JOIN p.topic t JOIN t.campaign c JOIN c.workspace w WHERE w.id = :workspaceId")
    List<PostTarget> findByWorkspaceId(@Param("workspaceId") Long workspaceId);

    @Query("SELECT COUNT(pt) FROM PostTarget pt JOIN pt.post p JOIN p.topic t WHERE t.id = :topicId AND pt.targetLikes > 0")
    long countPostsWithGoalsByTopicId(@Param("topicId") Long topicId);

    // Query posts đã đạt mục tiêu likes
    @Query("SELECT pt FROM PostTarget pt WHERE pt.targetLikes > 0 AND pt.actualLikes >= pt.targetLikes")
    List<PostTarget> findPostsReachedGoals();
}