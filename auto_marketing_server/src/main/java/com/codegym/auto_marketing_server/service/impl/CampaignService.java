package com.codegym.auto_marketing_server.service.impl;

import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.dto.CampaignDTO;
import com.codegym.auto_marketing_server.entity.Campaign;
import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.helper.ExcelHelper;
import com.codegym.auto_marketing_server.repository.ICampaignRepository;
import com.codegym.auto_marketing_server.repository.IWorkspaceRepository;
import com.codegym.auto_marketing_server.service.ICampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService implements ICampaignService {
    private final ICampaignRepository campaignRepository;
    private final IWorkspaceRepository workspaceRepository;

    @Override
    public Page<Campaign> findAll(String name, LocalDate startDate, LocalDate endDate,Long workspaceId, Pageable pageable) {
        return campaignRepository.findCampaignByName(name,startDate, endDate,workspaceId, pageable);
    }

    @Override
    public Campaign findById(Long id) {
        return campaignRepository.findById(id).orElse(null);
    }

    @Override
    public Campaign save(Campaign campaign) {
        return campaignRepository.save(campaign);
    }

    @Override
    @Transactional
    public List<Campaign> importFromExcel(MultipartFile file, Long workspaceId) {
        try {
            if (!ExcelHelper.isExcelFile(file)) {
                throw new ExcelHelper.ExcelValidationException("File phải có định dạng Excel (.xlsx hoặc .xls)");
            }

            List<CampaignDTO> campaignDTOs = ExcelHelper.excelToCampaigns(file.getInputStream());

            Workspace workspace = workspaceRepository.findById(workspaceId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Workspace"));

            return campaignDTOs.stream()
                    .map(dto -> {
                        Campaign campaign = new Campaign();
                        campaign.setName(dto.getName());
                        campaign.setDescription(dto.getDescription());
                        campaign.setStartDate(dto.getStartDate());
                        campaign.setEndDate(dto.getEndDate());
                        campaign.setStatus(dto.getStatus());
                        campaign.setWorkspace(workspace);
                        return campaignRepository.save(campaign);
                    })
                    .toList();

        } catch (IOException e) {
            throw new RuntimeException("Lỗi đọc file Excel", e);
        }
    }

    @Override
    public List<Campaign> findAll() {
        return campaignRepository.findAll();
    }

    @Override
    public List<Campaign> getCampaignsByWorkspace(Long workspaceId) {
        return campaignRepository.findByWorkspaceId(workspaceId);
    }
}
