package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByWorkspaceId(Long workspaceId);
}
