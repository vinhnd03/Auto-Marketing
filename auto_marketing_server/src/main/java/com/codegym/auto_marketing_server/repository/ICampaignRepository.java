package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICampaignRepository extends JpaRepository<Campaign,Long> {
}
