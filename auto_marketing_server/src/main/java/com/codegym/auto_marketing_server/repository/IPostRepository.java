package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.dto.PostFilterDTO;
import com.codegym.auto_marketing_server.entity.Post;
import com.codegym.auto_marketing_server.enums.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPostRepository extends JpaRepository<Post, Long> {
    List<Post> findByTopicId(Long topicId);

    List<Post> findByTopicIdAndStatus(Long topicId, PostStatus status);

    List<Post> findByGeneratedByAI(Boolean generatedByAI);

    @Query("""
                SELECT new com.codegym.auto_marketing_server.dto.PostFilterDTO(
                    p.id,
                    p.content,
                    p.aiModel,
                    p.contentType,
                    p.tone,
                    p.hashtag,
                    p.createdAt,
                    p.title,
                    t.id,
                    t.name,
                    c.id,
                    c.name,
                    w.id,
                    w.name
                )
                FROM Post p
                JOIN p.topic t
                JOIN t.campaign c
                JOIN c.workspace w
                WHERE (:workspaceId IS NULL OR w.id = :workspaceId)
                  AND (:campaignId IS NULL OR c.id = :campaignId)
                  AND (:topicId IS NULL OR t.id = :topicId)
            """)
    List<PostFilterDTO> findPostFilterDTOs(
            @Param("workspaceId") Long workspaceId,
            @Param("campaignId") Long campaignId,
            @Param("topicId") Long topicId
    );

    long countByTopicId(Long topicId);

    long countByTopicIdAndStatus(Long topicId, PostStatus status);
}
