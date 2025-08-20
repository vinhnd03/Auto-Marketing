package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Campaign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ICampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByWorkspaceId(Long workspaceId);

    @Query("""
    select c from Campaign c join Workspace  w on c.workspace.id = w.id
    where (:name is null or c.name like concat('%', :name, '%'))
    and (
        (:startDate is null or c.endDate >= :startDate)
        and (:endDate is null or c.startDate <= :endDate)
    )
    and w.id = :workspaceId
    """)
    Page<Campaign> findCampaignByName(@Param("name") String name,
                                      @Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate,
                                      @Param ("workspaceId") Long workspaceId,
                                      Pageable pageable);
}
