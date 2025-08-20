package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Campaign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface ICampaignRepository extends JpaRepository<Campaign, Long> {
    @Query("""
    select c from Campaign c
    where (:name is null or c.name like concat('%', :name, '%'))
    and (
        (:startDate is null or c.endDate >= :startDate)
        and (:endDate is null or c.startDate <= :endDate)
    )
    """)
    Page<Campaign> findCampaignByName(@Param("name") String name,
                                      @Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate,
                                      Pageable pageable);
}
