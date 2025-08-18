package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Topic;
import com.codegym.auto_marketing_server.enums.TopicStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ITopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByCampaignId(Long campaignId);

    List<Topic> findByCampaignIdAndStatus(Long campaignId, TopicStatus status);
}
