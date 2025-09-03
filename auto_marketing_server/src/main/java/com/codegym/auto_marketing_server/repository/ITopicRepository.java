package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Topic;
import com.codegym.auto_marketing_server.enums.TopicStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ITopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByCampaignId(Long campaignId);

    List<Topic> findByCampaignIdAndStatus(Long campaignId, TopicStatus status);

    @Query("""
        select t from Topic t
        where t.campaign.id = :campaignId
        and t.campaign.status = 'ACTIVE'
        and exists (
            select 1 from Post p
            where p.topic.id = t.id
                    and p.status = 'APPROVED'
        )
        """)
    List<Topic> findActiveTopicsWithPosts(@Param("campaignId") Long campaignId);
}
