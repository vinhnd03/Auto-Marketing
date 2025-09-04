package com.codegym.auto_marketing_server.service;

import com.codegym.auto_marketing_server.entity.Campaign;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Map;

public interface ICampaignService {
    Page<Campaign> findAll(String name, LocalDate startDate, Long workSpaceId, Pageable pageable);

    Campaign findById(Long id);

    Campaign save(Campaign campaign);

    List<Campaign> importFromExcel(MultipartFile file, Long workspaceId);

    List<Campaign> findAll();

    int countCampaignBySoftDel(Long id);

    List<Campaign> getCampaignsByWorkspace(Long workspaceId);

    List<Map<String, String>> getAllStatuses();
}
